package com.example.diploma.controller.dto;


import jakarta.validation.constraints.NotNull;

public record JoinChallengeRequest(
        @NotNull Long challengeId,
        @NotNull Long memberId
) {}