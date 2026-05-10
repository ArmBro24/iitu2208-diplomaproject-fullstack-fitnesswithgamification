package com.example.diploma.controller.dto;

public record ExerciseDto(
        Long id,
        String name,
        Integer planned,
        Integer done
) {}