package com.fitness.aiservice.model;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.Data;

@Data
public class Activity {
    private String id;
    private String userId;
    private String type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<String, Object> additionalMetrics;
}
