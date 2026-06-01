package com.example.diploma.controller.dto;

import com.example.diploma.model.enums.ChallengeStatus;

import java.time.LocalDateTime;

public record AdminChallengeResponse(
        Long id,
        String title,
        String description,
        Integer targetPoints,
        ChallengeStatus status,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        long participants,
        long completedParticipants
) {
}
