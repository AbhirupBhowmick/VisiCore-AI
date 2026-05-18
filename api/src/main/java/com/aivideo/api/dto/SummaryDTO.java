package com.aivideo.api.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class SummaryDTO {
    private UUID id;
    private String shortSummary;
    private String detailedSummary;
}
