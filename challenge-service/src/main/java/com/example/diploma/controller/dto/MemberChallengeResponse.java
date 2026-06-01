package com.example.diploma.controller.dto;

import com.example.diploma.model.enums.ChallengeStatus;
import com.example.diploma.model.enums.ParticipantStatus;

import java.time.LocalDateTime;

public record MemberChallengeResponse(
        Long id,
        String title,
        String description,
        Integer targetPoints,
        ChallengeStatus status,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        Integer currentPoints,
        ParticipantStatus participationStatus
) {
}
