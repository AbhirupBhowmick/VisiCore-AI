package com.aivideo.api.services;

import com.aivideo.api.config.RabbitMQConfig;
import com.aivideo.api.dto.VideoDTO;
import com.aivideo.api.dto.SummaryDTO;
import com.aivideo.api.dto.TranscriptDTO;
import com.aivideo.api.dto.VideoMessageDTO;
import com.aivideo.api.models.User;
import com.aivideo.api.models.Video;
import com.aivideo.api.repositories.VideoRepository;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final MinioClient minioClient;
    private final RabbitTemplate rabbitTemplate;

    @Value("${minio.bucket}")
    private String bucketName;

    public VideoService(VideoRepository videoRepository, MinioClient minioClient, RabbitTemplate rabbitTemplate) {
        this.videoRepository = videoRepository;
        this.minioClient = minioClient;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public VideoDTO uploadVideo(MultipartFile file, String title, User user) throws Exception {
        // Generate unique object name
        String objectName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        // Upload to MinIO
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());
        }

        String minioUrl = String.format("/%s/%s", bucketName, objectName);

        // Save to Database
        Video video = Video.builder()
                .user(user)
                .title(title)
                .status("UPLOAD_PENDING")
                .minioUrl(minioUrl)
                .build();
        video = videoRepository.save(video);

        // Publish to RabbitMQ
        VideoMessageDTO message = new VideoMessageDTO(video.getId(), minioUrl);
        rabbitTemplate.convertAndSend(RabbitMQConfig.VIDEO_PROCESSING_QUEUE, message);

        return mapToDTO(video);
    }

    public VideoDTO getVideoById(UUID id) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new RuntimeException("Video not found"));
        return mapToDTO(video);
    }

    @Transactional
    public void deleteVideoById(UUID id, User user) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (!video.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this video");
        }

        try {
            String url = video.getMinioUrl();
            if (url.startsWith("/" + bucketName + "/")) {
                String objectName = url.substring(bucketName.length() + 2);
                minioClient.removeObject(
                        io.minio.RemoveObjectArgs.builder()
                                .bucket(bucketName)
                                .object(objectName)
                                .build()
                );
                System.out.println("Deleted MinIO object: " + objectName);
            }
        } catch (Exception e) {
            System.err.println("Warning: Failed to delete file from MinIO: " + e.getMessage());
        }

        videoRepository.delete(video);
    }

    public java.util.List<VideoDTO> getAllUserVideos(User user) {
        return videoRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    private VideoDTO mapToDTO(Video video) {
        TranscriptDTO transcriptDTO = video.getTranscript() != null ? 
            TranscriptDTO.builder()
                .id(video.getTranscript().getId())
                .content(video.getTranscript().getContent())
                .timestamps(video.getTranscript().getTimestamps())
                .build() : null;

        SummaryDTO summaryDTO = video.getSummary() != null ?
            SummaryDTO.builder()
                .id(video.getSummary().getId())
                .shortSummary(video.getSummary().getShortSummary())
                .detailedSummary(video.getSummary().getDetailedSummary())
                .build() : null;

        return VideoDTO.builder()
                .id(video.getId())
                .title(video.getTitle())
                .status(video.getStatus())
                .minioUrl(video.getMinioUrl())
                .duration(video.getDuration())
                .createdAt(video.getCreatedAt())
                .transcript(transcriptDTO)
                .summary(summaryDTO)
                .build();
    }
}
