package com.example.diploma.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateSessionRequest(
        @NotNull Long coachId,
        @NotNull Long memberId,
        @NotBlank String title,
        @NotNull LocalDateTime startsAt,
        @NotNull LocalDateTime endsAt
) {}
