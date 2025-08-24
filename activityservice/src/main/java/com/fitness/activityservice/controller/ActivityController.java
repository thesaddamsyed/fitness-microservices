package com.fitness.activityservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitness.activityservice.dto.ActivityRequestDTO;
import com.fitness.activityservice.dto.ActivityResponseDTO;
import com.fitness.activityservice.service.ActivityService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponseDTO> createActivity(@RequestBody ActivityRequestDTO activityRequestDTO,
            @RequestHeader("X-User-Id") String userId) {

        if (userId != null) {
            activityRequestDTO.setUserId(userId);
        }
        ActivityResponseDTO response = activityService.createActivity(activityRequestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping()
    public ResponseEntity<List<ActivityResponseDTO>> getUserActivities(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }
}
