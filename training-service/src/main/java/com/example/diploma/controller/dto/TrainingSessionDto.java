package com.example.diploma.controller.dto;

import com.example.diploma.model.enums.TrainingSessionStatus;
import java.time.LocalDateTime;
import java.util.List;

public record TrainingSessionDto(
        Long id,
        Long coachId,
        Long memberId,
        String title,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        TrainingSessionStatus status,
        PointsDto points,
        List<ExerciseDto> exercises
) {}