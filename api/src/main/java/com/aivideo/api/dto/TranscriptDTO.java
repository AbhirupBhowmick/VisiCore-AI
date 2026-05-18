package com.aivideo.api.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class TranscriptDTO {
    private UUID id;
    private String content;
    private String timestamps;
}
