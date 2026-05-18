package com.aivideo.api.dto;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class VideoDTO {
    private UUID id;
    private String title;
    private String status;
    private String minioUrl;
    private Integer duration;
    private Instant createdAt;
    private TranscriptDTO transcript;
    private SummaryDTO summary;
}
