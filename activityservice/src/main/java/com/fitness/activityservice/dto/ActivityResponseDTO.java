package com.fitness.activityservice.dto;

import java.util.Map;

import com.fitness.activityservice.model.ActivityType;

import lombok.Data;

@Data
public class ActivityResponseDTO {
    private String id;
    private String userId;
    private ActivityType type;
    private Integer duration;
    private Integer caloriesBurned;
    private String startTime;
    private String createdAt;
    private String updatedAt;
    private Map<String, Object> additionalMetrics;
}
