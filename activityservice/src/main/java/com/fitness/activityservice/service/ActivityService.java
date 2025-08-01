package com.fitness.activityservice.service;

import org.springframework.stereotype.Service;

import com.fitness.activityservice.dto.ActivityRequestDTO;
import com.fitness.activityservice.dto.ActivityResponseDTO;
import com.fitness.activityservice.mapper.ActivityMapper;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;

    // create activity
    public ActivityResponseDTO createActivity(ActivityRequestDTO activityRequestDTO) {

        boolean isValidUser = userValidationService.validateUser(activityRequestDTO.getUserId());
        if (!isValidUser) {
            throw new RuntimeException("User not found with id: " + activityRequestDTO.getUserId());
        }

        // Convert ActivityRequestDTO to Activity entity
        Activity activity = activityRepository.save(ActivityMapper.mapToEntity(activityRequestDTO));
        // Convert Activity entity to ActivityResponseDTO
        return ActivityMapper.mapToResponseDTO(activity);
    }

}
