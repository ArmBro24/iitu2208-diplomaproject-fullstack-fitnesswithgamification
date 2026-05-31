package com.example.auth_service.controller.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record RegisterRequest(
        @jakarta.validation.constraints.Email String email,
        @jakarta.validation.constraints.NotBlank String password,
        String role,
        String firstName,
        String lastName,
        String nickname,
        String phone,
        String gender,
        @JsonFormat(pattern = "yyyy-MM-dd") LocalDate birthDate
) {}