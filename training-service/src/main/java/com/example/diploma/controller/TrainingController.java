package com.example.diploma.controller;

import com.example.diploma.controller.dto.ApproveLogRequest;
import com.example.diploma.controller.dto.CreateSessionRequest;
import com.example.diploma.controller.dto.SubmitLogRequest;
import com.example.diploma.model.SessionLog;
import com.example.diploma.model.TrainingSession;
import com.example.diploma.model.enums.TrainingSessionStatus;
import com.example.diploma.service.TrainingSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/training")
public class TrainingController {

    private final TrainingSessionService trainingSessionService;

    @GetMapping("/sessions/member/{memberId}")
    public List<TrainingSession> getMemberSessions(@PathVariable Long memberId) {
        return trainingSessionService.getSessionsByMemberId(memberId);
    }

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingSession createSession(@RequestBody @Valid CreateSessionRequest req) {
        TrainingSession session = TrainingSession.builder()
                .coachId(req.coachId())
                .memberId(req.memberId())
                .title(req.title())
                .startsAt(req.startsAt())
                .endsAt(req.endsAt())
                .build();

        return trainingSessionService.createSession(session);
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

        return trainingSessionService.submitLog(log);
    }

    @PatchMapping("/logs/{logId}/approve")
    public SessionLog approveLog(@PathVariable Long logId,
                                 @RequestBody @Valid ApproveLogRequest req) {
        return trainingSessionService.approveLog(logId, req.points(), req.coachComment());
    }

    @PatchMapping("/sessions/{sessionId}/status")
    public TrainingSession updateStatus(@PathVariable Long sessionId,
                                        @RequestParam TrainingSessionStatus status) {
        return trainingSessionService.updateSessionStatus(sessionId, status);
    }
}