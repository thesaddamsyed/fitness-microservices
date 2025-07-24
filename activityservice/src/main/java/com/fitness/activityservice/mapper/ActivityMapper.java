package com.fitness.activityservice.mapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import com.fitness.activityservice.dto.ActivityRequestDTO;
import com.fitness.activityservice.dto.ActivityResponseDTO;
import com.fitness.activityservice.model.Activity;

public class ActivityMapper {

    public static Activity mapToEntity(ActivityRequestDTO activityRequestDTO) {

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime inputTime = LocalTime.parse(activityRequestDTO.getStartTime(), timeFormatter);
        Activity activity;
        activity = new Activity();

        activity.setUserId(activityRequestDTO.getUserId());
        activity.setType(activityRequestDTO.getType());
        activity.setDuration(activityRequestDTO.getDuration());
        activity.setCaloriesBurned(activityRequestDTO.getCaloriesBurned());
        activity.setStartTime(LocalDateTime.of(LocalDate.now(), inputTime));
        activity.setAdditionalMetrics(activityRequestDTO.getAdditionalMetrics());
        activity.setCreatedAt(LocalDateTime.now());
        activity.setUpdatedAt(LocalDateTime.now());
        return activity;
    }

    public static ActivityResponseDTO mapToResponseDTO(Activity activity) {
        ActivityResponseDTO responseDTO = new ActivityResponseDTO();
        responseDTO.setId(activity.getId());
        responseDTO.setUserId(activity.getUserId());
        responseDTO.setType(activity.getType());
        responseDTO.setDuration(activity.getDuration());
        responseDTO.setCaloriesBurned(activity.getCaloriesBurned());
        responseDTO.setStartTime(activity.getStartTime().toLocalTime().toString());
        responseDTO.setAdditionalMetrics(activity.getAdditionalMetrics());
        responseDTO.setCreatedAt(activity.getCreatedAt().toString());
        responseDTO.setUpdatedAt(activity.getUpdatedAt().toString());
        return responseDTO;
    }

}
