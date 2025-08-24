package com.fitness.gateway;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class KeycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        RegisterRequest registerRequest = getUserDetails(token);

        if (userId == null) {
            userId = registerRequest.getKeycloakId();
        }

        if (userId != null && token != null) {
            String finalUserid = userId;
            return userService.validateUser(userId)
                    .flatMap(exists -> {
                        if (!exists) {
                            if (registerRequest != null) {
                                log.info("Registering new user: {}", registerRequest.getEmail());
                                return userService.registerUser(registerRequest).then(Mono.empty());
                            } else {
                                log.warn("Could not extract user details from token");
                                return Mono.empty();
                            }
                        } else {
                            log.info("User already exists: {}");
                            return Mono.just(true);
                        }
                    })
                    .then(Mono.defer(() -> {
                        // Always continue the filter chain
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-Id", finalUserid)
                                .build();

                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }

        // If no userId/token, just continue the filter chain
        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer ", "");
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));
            registerRequest.setPassword("dummypassword123");

            return registerRequest;
        } catch (Exception e) {
            log.error("Failed to parse token: {}", e.getMessage(), e);
            return null;
        }
    }
}
