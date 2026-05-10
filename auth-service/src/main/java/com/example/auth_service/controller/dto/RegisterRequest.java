package com.example.auth_service.controller.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @jakarta.validation.constraints.Email String email,
        @jakarta.validation.constraints.NotBlank String password,
        String role,
        String firstName,
        String lastName,
        String nickname,
        String phone,
        String gender,
        java.time.LocalDate birthDate
) {}