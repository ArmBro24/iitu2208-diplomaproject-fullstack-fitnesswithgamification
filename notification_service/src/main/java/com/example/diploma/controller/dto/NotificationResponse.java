package com.example.diploma.controller.dto;

import com.example.diploma.model.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long notificationId,
        Long userId,
        String title,
        String message,
        NotificationType type,
        Boolean isRead,
        LocalDateTime createdAt
) {}