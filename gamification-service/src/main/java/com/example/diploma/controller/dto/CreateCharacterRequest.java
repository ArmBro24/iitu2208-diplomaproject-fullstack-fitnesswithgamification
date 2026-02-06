package com.example.diploma.controller.dto;


import jakarta.validation.constraints.NotNull;

public record CreateCharacterRequest(
        @NotNull Long memberId
) {}
