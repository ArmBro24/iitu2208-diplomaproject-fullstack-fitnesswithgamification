package com.example.diploma.controller.dto;

import jakarta.validation.constraints.NotNull;

public record SubmitLogRequest(
        @NotNull Long sessionId,
        @NotNull Long memberId,
        @NotNull Long coachId,
        String memberComment
) {}
