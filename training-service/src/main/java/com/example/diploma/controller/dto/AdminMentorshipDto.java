package com.example.diploma.controller.dto;

import java.time.LocalDateTime;

public record AdminMentorshipDto(
        Long id,
        Long coachId,
        Long clientId,
        String status,
        LocalDateTime createdAt
) {
}
