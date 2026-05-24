package com.example.diploma.security;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/challenges")
                        .hasAnyAuthority("COACH", "ROLE_COACH")

                        .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/challenges/*/status")
                        .hasAnyAuthority("COACH", "ROLE_COACH")

                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/challenges/join")
                        .hasAnyAuthority("MEMBER", "ROLE_MEMBER")

                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/challenges/member/*")
                        .hasAnyAuthority("MEMBER", "ROLE_MEMBER")

                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/challenges/*")
                        .authenticated()

                        .anyRequest()
                        .authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}