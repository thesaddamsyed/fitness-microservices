package com.fitness.aiservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;

    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public Optional<Recommendation> getActivityRecommendation(String activityId) {
        Optional<Recommendation> data = recommendationRepository.findByActivityId(activityId);
        if (data == null) {
            return Optional.empty();
        } else {
            return data;
        }
    }

}
