package com.example.auth_service.controller.dto;

public record AuthResponse(
        String token,
        Long userId,
        String role
) {}