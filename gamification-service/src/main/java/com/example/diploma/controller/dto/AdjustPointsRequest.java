package com.example.diploma.controller.dto;


import jakarta.validation.constraints.NotNull;

public record AdjustPointsRequest(
        @NotNull Integer delta,
        String comment
) {}
