package com.example.auth_service.controller.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @Email String email,
        @NotBlank String password
) {}