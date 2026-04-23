package com.example.diploma.event;

import java.time.LocalDateTime;

public record PointsAwardedEvent(
        Long memberId,
        Integer points,
        LocalDateTime createdAt
) {}