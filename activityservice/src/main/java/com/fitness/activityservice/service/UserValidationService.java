package com.fitness.activityservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {
    private final WebClient userservicewWebClient;

    public boolean validateUser(String userId) {
        try {
            String url = "/api/users/" + userId + "/validate";
            log.info("Calling user-service: {}", url);

            return userservicewWebClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to validate user mr saddam");
        }
    }

}
