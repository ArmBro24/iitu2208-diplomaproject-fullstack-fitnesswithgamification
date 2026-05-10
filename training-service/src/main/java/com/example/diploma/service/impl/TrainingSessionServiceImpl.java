package com.example.diploma.service.impl;

import com.example.diploma.event.TrainingLogApprovedEvent;
import com.example.diploma.kafka.TrainingEventProducer;
import com.example.diploma.model.SessionLog;
import com.example.diploma.model.TrainingSession;
import com.example.diploma.model.enums.SessionLogStatus;
import com.example.diploma.model.enums.TrainingSessionStatus;
import com.example.diploma.repository.SessionLogRepository;
import com.example.diploma.repository.TrainingSessionRepository;
import com.example.diploma.service.TrainingSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrainingSessionServiceImpl implements TrainingSessionService {

    private final TrainingSessionRepository trainingSessionRepository;
    private final SessionLogRepository sessionLogRepository;
    private final TrainingEventProducer trainingEventProducer;

    @Override
    public List<TrainingSession> getSessionsByMemberId(Long memberId) {
        log.info("Fetching sessions for memberId: {}", memberId);
        return trainingSessionRepository.findAllByMemberId(memberId);
    }

    @Override
    public TrainingSession createSession(TrainingSession session) {
        int finalPoints = session.getPoints() != null ? session.getPoints() :
                (session.getType() != null ? session.getType().getDefaultPoints() : 20);

        TrainingSession entity = session.toBuilder()
                .status(TrainingSessionStatus.REQUESTED)
                .points(finalPoints)
                .build();

        if (session.getExercises() != null) {
            session.getExercises().forEach(ex -> ex.setSession(entity));
            entity.setExercises(session.getExercises());
        }

        return trainingSessionRepository.save(entity);
    }

    @Override
    public SessionLog submitLog(SessionLog sessionLog) {
        TrainingSession session = trainingSessionRepository.findById(sessionLog.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        SessionLog entity = sessionLog.toBuilder()
                .status(SessionLogStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now())
                .build();

        log.info("User {} submitted results for session {}", sessionLog.getMemberId(), sessionLog.getSessionId());
        return sessionLogRepository.save(entity);
    }

    @Override
    public SessionLog approveLog(Long logId, Integer points, String coachComment) {
        SessionLog existing = sessionLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("SessionLog not found"));

        if (existing.getStatus() != SessionLogStatus.SUBMITTED &&
                existing.getStatus() != SessionLogStatus.REVISED) {
            throw new IllegalStateException("Log cannot be approved. Current status: " + existing.getStatus());
        }

        int finalPoints = (points != null) ? points : -10;

        SessionLog updated = existing.toBuilder()
                // Если баллы положительные — APPROVED, если отрицательные или 0 — REJECTED
                .status(finalPoints > 0 ? SessionLogStatus.APPROVED : SessionLogStatus.REJECTED)
                .pointsAwarded(finalPoints)
                .coachComment(coachComment)
                .reviewedAt(LocalDateTime.now())
                .build();

        SessionLog saved = sessionLogRepository.save(updated);

        trainingEventProducer.sendLogApproved(
                new TrainingLogApprovedEvent(
                        saved.getSessionId(),
                        saved.getMemberId(),
                        saved.getPointsAwarded(),
                        saved.getReviewedAt()
                )
        );

        log.info("Log {} processed with status {} and points {}", logId, saved.getStatus(), finalPoints);
        return saved;
    }

    @Override
    public TrainingSession updateSessionStatus(Long sessionId, TrainingSessionStatus status) {
        TrainingSession session = trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        TrainingSession updated = session.toBuilder()
                .status(status)
                .build();

        return trainingSessionRepository.save(updated);
    }
}