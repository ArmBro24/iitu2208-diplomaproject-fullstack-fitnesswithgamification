package com.example.diploma.controller.dto;

import com.example.diploma.model.enums.SessionLogStatus;

import java.time.LocalDateTime;

public record AdminSessionLogDto(
        Long id,
        Long sessionId,
        Long memberId,
        Long coachId,
        String memberComment,
        Integer pointsAwarded,
        String coachComment,
        SessionLogStatus status,
        LocalDateTime submittedAt,
        LocalDateTime reviewedAt
) {
}
