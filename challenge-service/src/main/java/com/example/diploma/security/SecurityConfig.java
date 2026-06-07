package com.example.diploma.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .logout(logout -> logout.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/**", "/error").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/challenges/catalog").permitAll()
                        .requestMatchers("/api/challenges/admin").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/challenges").hasAnyRole("ADMIN", "COACH")
                        .requestMatchers(HttpMethod.PATCH, "/api/challenges/*/status").hasAnyRole("ADMIN", "COACH")
                        .requestMatchers(HttpMethod.POST, "/api/challenges/join").hasRole("MEMBER")
                        .requestMatchers(HttpMethod.PATCH, "/api/challenges/*/leave").hasRole("MEMBER")
                        .requestMatchers(HttpMethod.GET, "/api/challenges/member/*").hasRole("MEMBER")
                        .requestMatchers(HttpMethod.GET, "/api/challenges/me").hasRole("MEMBER")
                        .requestMatchers(HttpMethod.POST, "/api/challenges/{id}/progress").hasRole("MEMBER")                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}