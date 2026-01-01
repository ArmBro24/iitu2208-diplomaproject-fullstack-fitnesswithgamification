package com.example.diploma.controller.dto;

import jakarta.validation.constraints.NotNull;

public record ApproveLogRequest(
        @NotNull Integer points,
        String coachComment
) {}
