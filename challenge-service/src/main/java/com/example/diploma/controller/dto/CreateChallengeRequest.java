package com.example.diploma.controller.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateChallengeRequest(
        @NotBlank String title,
        String description,
        @NotNull Integer targetPoints,
        @NotNull LocalDateTime startsAt,
        @NotNull LocalDateTime endsAt
) {}