package com.example.diploma.controller.dto;

import com.example.diploma.model.enums.TrainingType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public record CreateSessionRequest(
        @NotNull Long coachId,
        @NotNull Long memberId,
        @NotBlank String title,
        @NotNull
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime startsAt,
        @NotNull
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime endsAt,
        @NotNull TrainingType type,
        Integer points,
        List<ExerciseDto> exercises
) {}