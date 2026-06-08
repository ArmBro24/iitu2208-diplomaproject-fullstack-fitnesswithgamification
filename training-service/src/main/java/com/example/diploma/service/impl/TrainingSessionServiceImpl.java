package com.example.diploma.service.impl;

import com.example.diploma.event.TrainingLogApprovedEvent;
import com.example.diploma.kafka.TrainingEventProducer;
import com.example.diploma.model.SessionLog;
import com.example.diploma.model.TrainingSession;
import com.example.diploma.model.TrainingCategory;
import com.example.diploma.model.enums.SessionLogStatus;
import com.example.diploma.model.enums.TrainingSessionStatus;
import com.example.diploma.repository.SessionLogRepository;
import com.example.diploma.repository.TrainingSessionRepository;
import com.example.diploma.repository.TrainingCategoryRepository;
import com.example.diploma.service.TrainingSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.diploma.model.Exercise;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrainingSessionServiceImpl implements TrainingSessionService {

    private final TrainingSessionRepository trainingSessionRepository;
    private final SessionLogRepository sessionLogRepository;
    private final TrainingEventProducer trainingEventProducer;
    private final TrainingCategoryRepository trainingCategoryRepository;

    @Override
    public List<TrainingSession> getSessionsByMemberId(Long memberId) {
        log.info("Fetching sessions for memberId: {}", memberId);
        return trainingSessionRepository.findAllByMemberId(memberId);
    }

    @Override
    public TrainingSession createSession(TrainingSession session) {
        if (session.getStartsAt() == null || session.getEndsAt() == null) {
            throw new IllegalArgumentException("Session start and end time are required");
        }

        if (!session.getEndsAt().isAfter(session.getStartsAt())) {
            throw new IllegalArgumentException("Session end time must be after start time");
        }

        if (session.getCoachId() == null) {
            throw new IllegalArgumentException("Coach id is required");
        }

        if (session.getMemberId() == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        int finalPoints = session.getPoints() != null ? session.getPoints() :
                (session.getType() != null ? session.getType().getDefaultPoints() : 20);

        if (finalPoints <= 0) {
            throw new IllegalArgumentException("Session points must be positive");
        }

        TrainingSession entity = session.toBuilder()
                .status(TrainingSessionStatus.REQUESTED)
                .points(finalPoints)
                .build();

        if (session.getExercises() != null && !session.getExercises().isEmpty()) {
            session.getExercises().forEach(ex -> {
                if (ex.getName() == null || ex.getName().isBlank()) {
                    throw new IllegalArgumentException("Exercise name is required");
                }

                if (ex.getPlanned() == null || ex.getPlanned() <= 0) {
                    throw new IllegalArgumentException("Exercise planned value must be positive");
                }

                ex.setDone(0);
                ex.setSession(entity);
            });

            entity.setExercises(session.getExercises());
        } else {
            java.util.Optional<TrainingCategory> categoryOpt =
                    trainingCategoryRepository.findByName(session.getType() != null ? session.getType().name() : "");

            if (categoryOpt.isPresent() && categoryOpt.get().getDefaultExercises() != null) {
                List<Exercise> defaultExercises = categoryOpt.get().getDefaultExercises().stream()
                        .map(de -> Exercise.builder()
                                .name(de.getName())
                                .planned(de.getPlanned())
                                .done(0)
                                .session(entity)
                                .build())
                        .toList();
                entity.setExercises(defaultExercises);
            }
        }

        return trainingSessionRepository.save(entity);
    }

    @Override
    public SessionLog submitLog(SessionLog log, List<Exercise> submittedExercises) {

        TrainingSession session = trainingSessionRepository.findById(log.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() == TrainingSessionStatus.CANCELED) {
            throw new RuntimeException("Cannot submit log for canceled session");
        }

        if (session.getStatus() != TrainingSessionStatus.CONFIRMED) {
            throw new RuntimeException("Logs can only be submitted for CONFIRMED sessions");
        }

        if (!session.getMemberId().equals(log.getMemberId())) {
            throw new RuntimeException("Member mismatch");
        }

        if (!session.getCoachId().equals(log.getCoachId())) {
            throw new RuntimeException("Coach mismatch");
        }

        boolean alreadyExists =
                sessionLogRepository.existsBySessionIdAndMemberIdAndStatusIn(
                        log.getSessionId(),
                        log.getMemberId(),
                        Set.of(
                                SessionLogStatus.SUBMITTED,
                                SessionLogStatus.APPROVED
                        )
                );

        if (alreadyExists) {
            throw new RuntimeException("Log already exists for this session");
        }

        applySubmittedExerciseResults(session, submittedExercises);

        session.setStatus(TrainingSessionStatus.SUBMITTED);
        trainingSessionRepository.save(session);

        log.setStatus(SessionLogStatus.SUBMITTED);
        log.setSubmittedAt(LocalDateTime.now());

        return sessionLogRepository.save(log);
    }

    @Override
    public SessionLog approveLog(Long logId, Integer points, String coachComment) {
        SessionLog existing = sessionLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("SessionLog not found for logId: " + logId));

        if (existing.getStatus() != SessionLogStatus.SUBMITTED &&
                existing.getStatus() != SessionLogStatus.REVISED) {
            throw new IllegalStateException("Log cannot be approved. Current status: " + existing.getStatus());
        }

        TrainingSession session = trainingSessionRepository.findById(existing.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        if (session.getStatus() == TrainingSessionStatus.CANCELED) {
            throw new IllegalStateException("Cannot approve log for CANCELED session.");
        }

        if (points == null || points <= 0) {
            throw new IllegalArgumentException("Approved log must have positive points");
        }

        SessionLog updated = existing.toBuilder()
                .status(SessionLogStatus.APPROVED)
                .pointsAwarded(points)
                .coachComment(coachComment)
                .reviewedAt(LocalDateTime.now())
                .build();

        SessionLog saved = sessionLogRepository.save(updated);

        TrainingSession completedSession = session.toBuilder()
                .status(TrainingSessionStatus.COMPLETED)
                .build();

        trainingSessionRepository.save(completedSession);

        try {
            TrainingLogApprovedEvent event = new TrainingLogApprovedEvent(
                    saved.getSessionId(),
                    saved.getMemberId(),
                    saved.getPointsAwarded(),
                    java.time.LocalDateTime.now()
            );
            trainingEventProducer.sendLogApproved(event);
            log.info("Successfully sent TrainingLogApprovedEvent to Kafka for sessionId: {}", saved.getSessionId());
        } catch (Exception e) {
            log.error("Failed to send event to Kafka: {}", e.getMessage());
        }

        log.info("Log {} approved with {} points", logId, points);
        return saved;
    }

    @Override
    public SessionLog rejectLog(Long logId, String coachComment) {
        SessionLog existing = sessionLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("SessionLog not found"));

        if (existing.getStatus() != SessionLogStatus.SUBMITTED &&
                existing.getStatus() != SessionLogStatus.REVISED) {
            throw new IllegalStateException("Log cannot be rejected. Current status: " + existing.getStatus());
        }

        SessionLog updated = existing.toBuilder()
                .status(SessionLogStatus.REJECTED)
                .pointsAwarded(0)
                .coachComment(coachComment)
                .reviewedAt(LocalDateTime.now())
                .build();

        SessionLog saved = sessionLogRepository.save(updated);

        log.info("Log {} rejected", logId);
        return saved;
    }

    @Override
    public TrainingSession updateSessionStatus(Long sessionId, TrainingSessionStatus status) {
        TrainingSession session = trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        TrainingSessionStatus currentStatus = session.getStatus();

        if (!isValidStatusTransition(currentStatus, status)) {
            throw new IllegalStateException(
                    "Invalid session status transition: " + currentStatus + " -> " + status
            );
        }

        TrainingSession updated = session.toBuilder()
                .status(status)
                .build();

        return trainingSessionRepository.save(updated);
    }

    private boolean isValidStatusTransition(
            TrainingSessionStatus currentStatus,
            TrainingSessionStatus newStatus
    ) {
        if (currentStatus == newStatus) {
            return true;
        }

        return switch (currentStatus) {
            case REQUESTED -> newStatus == TrainingSessionStatus.CONFIRMED
                    || newStatus == TrainingSessionStatus.CANCELED;

            case CONFIRMED -> newStatus == TrainingSessionStatus.COMPLETED
                    || newStatus == TrainingSessionStatus.CANCELED
                    || newStatus == TrainingSessionStatus.SUBMITTED
                    || newStatus == TrainingSessionStatus.MISSED;

            case SUBMITTED -> newStatus == TrainingSessionStatus.COMPLETED;

            case COMPLETED, CANCELED, MISSED -> false;
        };
    }

    private void applySubmittedExerciseResults(
            TrainingSession session,
            List<Exercise> submittedExercises
    ) {
        if (submittedExercises == null || submittedExercises.isEmpty()) {
            return;
        }

        if (session.getExercises() == null || session.getExercises().isEmpty()) {
            throw new IllegalArgumentException("Session has no planned exercises");
        }

        for (Exercise submittedExercise : submittedExercises) {
            if (submittedExercise.getId() == null) {
                throw new IllegalArgumentException("Submitted exercise id is required");
            }

            if (submittedExercise.getDone() == null || submittedExercise.getDone() < 0) {
                throw new IllegalArgumentException("Exercise done value must be zero or positive");
            }

            Exercise plannedExercise = session.getExercises().stream()
                    .filter(ex -> ex.getId().equals(submittedExercise.getId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Exercise does not belong to this session: " + submittedExercise.getId()
                    ));

            if (submittedExercise.getDone() > plannedExercise.getPlanned()) {
                throw new IllegalArgumentException(
                        "Exercise done value cannot exceed planned value"
                );
            }

            plannedExercise.setDone(submittedExercise.getDone());
        }
    }

    @Override
    @Scheduled(cron = "0 0 * * * *")
    public void updateMissedSessions() {
        List<TrainingSession> sessions = trainingSessionRepository.findByStatusInAndEndsAtBefore(
                List.of(TrainingSessionStatus.CONFIRMED, TrainingSessionStatus.REQUESTED),
                LocalDateTime.now()
        );

        if (!sessions.isEmpty()) {
            sessions.forEach(s -> s.setStatus(TrainingSessionStatus.MISSED));
            trainingSessionRepository.saveAll(sessions);
            log.info("Автоматически обновлен статус {} сессий на MISSED", sessions.size());
        }
    }

    @Override
    public TrainingSession findById(Long sessionId) {
        return trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Training session not found with id: " + sessionId));
    }
}