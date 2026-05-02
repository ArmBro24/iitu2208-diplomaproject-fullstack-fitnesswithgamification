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
import java.util.List; // Не забудьте этот импорт

@Slf4j
@Service
@RequiredArgsConstructor
public class TrainingSessionServiceImpl implements TrainingSessionService {

    private final TrainingSessionRepository trainingSessionRepository;
    private final SessionLogRepository sessionLogRepository;
    private final TrainingEventProducer trainingEventProducer;

    // --- Новый метод ---
    @Override
    public List<TrainingSession> getSessionsByMemberId(Long memberId) {
        log.info("Fetching sessions for memberId: {}", memberId);
        return trainingSessionRepository.findAllByMemberId(memberId);
    }
    // -------------------

    @Override
    public TrainingSession createSession(TrainingSession session) {
        TrainingSession entity = session.toBuilder()
                .status(TrainingSessionStatus.REQUESTED)
                .build();

        return trainingSessionRepository.save(entity);
    }

    @Override
    public SessionLog submitLog(SessionLog log) {
        SessionLog entity = log.toBuilder()
                .status(SessionLogStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now())
                .build();

        return sessionLogRepository.save(entity);
    }

    @Override
    public SessionLog approveLog(Long logId, Integer points, String coachComment) {
        SessionLog existing = sessionLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("SessionLog not found"));

        if (existing.getStatus() != SessionLogStatus.SUBMITTED &&
                existing.getStatus() != SessionLogStatus.REVISED) {
            throw new IllegalStateException(
                    "Log cannot be approved. Current status: " + existing.getStatus()
            );
        }

        SessionLog updated = existing.toBuilder()
                .status(SessionLogStatus.APPROVED)
                .pointsAwarded(points)
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