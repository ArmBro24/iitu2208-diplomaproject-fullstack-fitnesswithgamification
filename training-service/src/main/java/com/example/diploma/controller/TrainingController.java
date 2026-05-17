package com.example.diploma.controller;

import com.example.diploma.controller.dto.*;
import com.example.diploma.model.Exercise;
import com.example.diploma.model.SessionLog;
import com.example.diploma.model.TrainingSession;
import com.example.diploma.model.enums.TrainingSessionStatus;
import com.example.diploma.service.TrainingSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/training")
public class TrainingController {

    private final TrainingSessionService trainingSessionService;

    @GetMapping("/sessions/member/{memberId}")
    public List<TrainingSessionDto> getMemberSessions(@PathVariable Long memberId) {
        return trainingSessionService.getSessionsByMemberId(memberId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingSessionDto createSession(@RequestBody @Valid CreateSessionRequest req) {
        TrainingSession session = TrainingSession.builder()
                .coachId(req.coachId())
                .memberId(req.memberId())
                .title(req.title())
                .startsAt(req.startsAt())
                .endsAt(req.endsAt())
                .type(req.type())
                .points(req.points())
                .build();

        if (req.exercises() != null) {
            List<Exercise> exercises = req.exercises().stream()
                    .map(dto -> Exercise.builder()
                            .name(dto.name())
                            .planned(dto.planned())
                            .done(0)
                            .session(session)
                            .build())
                    .collect(Collectors.toList());
            session.setExercises(exercises);
        }

        TrainingSession saved = trainingSessionService.createSession(session);
        return mapToDto(saved);
    }

    @PostMapping("/logs")
    @ResponseStatus(HttpStatus.CREATED)
    public SessionLog submitLog(@RequestBody @Valid SubmitLogRequest req) {
        SessionLog log = SessionLog.builder()
                .sessionId(req.sessionId())
                .memberId(req.memberId())
                .coachId(req.coachId())
                .memberComment(req.memberComment())
                .build();

        List<Exercise> submittedExercises = req.exercises() == null ? List.of() :
                req.exercises().stream()
                        .map(dto -> Exercise.builder()
                                .id(dto.id())
                                .name(dto.name())
                                .planned(dto.planned())
                                .done(dto.done())
                                .build())
                        .collect(Collectors.toList());

        return trainingSessionService.submitLog(log, submittedExercises);
    }

    @PatchMapping("/logs/{logId}/approve")
    public SessionLog approveLog(@PathVariable Long logId,
                                 @RequestBody @Valid ApproveLogRequest req) {
        return trainingSessionService.approveLog(logId, req.points(), req.coachComment());
    }

    @PatchMapping("/logs/{logId}/reject")
    public SessionLog rejectLog(@PathVariable Long logId,
                                @RequestBody RejectLogRequest req) {
        return trainingSessionService.rejectLog(logId, req.coachComment());
    }

    @PatchMapping("/sessions/{sessionId}/status")
    public TrainingSessionDto updateStatus(@PathVariable Long sessionId,
                                           @RequestParam TrainingSessionStatus status) {
        TrainingSession updated = trainingSessionService.updateSessionStatus(sessionId, status);
        return mapToDto(updated);
    }

    private TrainingSessionDto mapToDto(TrainingSession s) {
        List<ExerciseDto> exerciseDtos = s.getExercises() == null ? List.of() :
                s.getExercises().stream()
                        .map(e -> new ExerciseDto(e.getId(), e.getName(), e.getPlanned(), e.getDone()))
                        .collect(Collectors.toList());

        int total = s.getPoints() != null ? s.getPoints() :
                (s.getType() != null ? s.getType().getDefaultPoints() : 0);

        int endurance = (int) (total * 0.4);
        int consistency = (int) (total * 0.3);
        int motivation = total - endurance - consistency;

        PointsDto pointsDto = new PointsDto(total, endurance, consistency, motivation);

        return new TrainingSessionDto(
                s.getId(),
                s.getCoachId(),
                s.getMemberId(),
                s.getTitle(),
                s.getStartsAt(),
                s.getEndsAt(),
                s.getStatus(),
                pointsDto,
                exerciseDtos
        );
    }
}