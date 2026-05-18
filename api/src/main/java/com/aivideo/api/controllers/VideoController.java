package com.aivideo.api.controllers;

import com.aivideo.api.dto.VideoDTO;
import com.aivideo.api.security.UserDetailsImpl;
import com.aivideo.api.services.VideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("/upload")
    public ResponseEntity<VideoDTO> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @AuthenticationPrincipal UserDetailsImpl userDetails) throws Exception {
        return ResponseEntity.ok(videoService.uploadVideo(file, title, userDetails.getUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoDTO> getVideo(@PathVariable UUID id) {
        return ResponseEntity.ok(videoService.getVideoById(id));
    }

    @GetMapping
    public ResponseEntity<List<VideoDTO>> getAllVideos(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(videoService.getAllUserVideos(userDetails.getUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable UUID id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        videoService.deleteVideoById(id, userDetails.getUser());
        return ResponseEntity.noContent().build();
    }
}
