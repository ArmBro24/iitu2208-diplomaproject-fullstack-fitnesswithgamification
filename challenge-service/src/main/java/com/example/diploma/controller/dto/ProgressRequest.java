package com.example.diploma.controller.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProgressRequest(
        @NotNull @Positive Integer points
) {}