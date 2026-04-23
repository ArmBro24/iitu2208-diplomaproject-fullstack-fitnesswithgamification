package com.example.diploma.event;

import java.time.LocalDateTime;

public record ChallengeCompletedEvent(
        Long challengeId,
        Long memberId,
        Integer finalPoints,
        LocalDateTime completedAt
) {}