package com.example.diploma.controller.dto;

import com.example.diploma.model.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateNotificationRequest(
        @NotNull Long userId,
        @NotBlank String title,
        @NotBlank String message,
        @NotNull NotificationType type
) {}