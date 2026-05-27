package com.example.diploma.controller.dto;

public record AdminTrainingOverviewDto(
        long totalSessions,
        long mentorships,
        long submittedLogs,
        long completedSessions
) {
}
