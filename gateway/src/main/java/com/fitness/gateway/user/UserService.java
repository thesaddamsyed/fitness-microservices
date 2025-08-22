package com.fitness.gateway.user;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final WebClient userServiceWebClient;

    public Mono<Boolean> validateUser(String userId) {
        String url = "/api/users/" + userId + "/validate";
        log.info("Calling user-service: {}", url);

        return userServiceWebClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    if (ex.getStatusCode() == HttpStatus.NOT_FOUND) {
                        log.warn("User not found: {}", userId);
                        return Mono.just(false);
                    } else if (ex.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        log.warn("Invalid user ID format: {}", userId);
                        return Mono.just(false);
                    } else {
                        log.error("Unexpected error validating user {}: {}", userId, ex.getMessage());
                        return Mono.error(ex);
                    }
                });
    }

    public Mono<UserResponse> registerUser(RegisterRequest registerRequest) {
        String url = "/api/users/register";
        log.info("Registering user via user-service: {}", url);

        return userServiceWebClient.post()
                .uri(url)
                .bodyValue(registerRequest)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    log.error("Error registering user: {}", ex.getMessage());
                    return Mono.error(ex);
                });
    }
}
