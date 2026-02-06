package com.example.diploma.event;

import java.time.LocalDateTime;

public record TrainingLogApprovedEvent(
        Long sessionId,
        Long memberId,
        Integer points,
        LocalDateTime approvedAt
) {}

