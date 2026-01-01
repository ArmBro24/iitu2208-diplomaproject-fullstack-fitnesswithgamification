package com.example.diploma.controller;

import com.example.diploma.controller.dto.ApproveLogRequest;
import com.example.diploma.controller.dto.CreateSessionRequest;
import com.example.diploma.controller.dto.SubmitLogRequest;
import com.example.diploma.model.SessionLog;
import com.example.diploma.model.TrainingSession;
import com.example.diploma.service.TrainingSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/training")
public class TrainingController {

    private final TrainingSessionService trainingSessionService;

    // 1) Create training session
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

    // 2) Submit session log (member sends results)
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

    // 3) Approve log (coach confirms + awards points)
    @PatchMapping("/logs/{logId}/approve")
    public SessionLog approveLog(@PathVariable Long logId,
                                 @RequestBody @Valid ApproveLogRequest req) {
        return trainingSessionService.approveLog(logId, req.points(), req.coachComment());
    }
}
