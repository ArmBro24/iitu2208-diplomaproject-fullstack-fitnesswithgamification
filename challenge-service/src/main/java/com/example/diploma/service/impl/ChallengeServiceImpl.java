package com.example.diploma.service.impl;

import com.example.diploma.event.ChallengeCompletedEvent;
import com.example.diploma.kafka.ChallengeEventProducer;
import com.example.diploma.model.Challenge;
import com.example.diploma.model.ChallengeParticipant;
import com.example.diploma.model.enums.ChallengeStatus;
import com.example.diploma.model.enums.ParticipantStatus;
import com.example.diploma.repository.ChallengeParticipantRepository;
import com.example.diploma.repository.ChallengeRepository;
import com.example.diploma.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ChallengeParticipantRepository challengeParticipantRepository;
    private final ChallengeEventProducer challengeEventProducer;

    @Override
    public Challenge createChallenge(Challenge challenge) {
        if (challenge.getTitle() == null || challenge.getTitle().isBlank()) {
            throw new IllegalArgumentException("Challenge title is required");
        }
        if (challenge.getTargetPoints() == null || challenge.getTargetPoints() <= 0) {
            throw new IllegalArgumentException("Challenge target points must be positive");
        }
        if (challenge.getStartsAt() == null || challenge.getEndsAt() == null) {
            throw new IllegalArgumentException("Challenge start and end time are required");
        }
        if (!challenge.getEndsAt().isAfter(challenge.getStartsAt())) {
            throw new IllegalArgumentException("Challenge end time must be after start time");
        }

        Challenge entity = challenge.toBuilder()
                .status(ChallengeStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return challengeRepository.save(entity);
    }

    @Override
    public Challenge updateChallengeStatus(Long challengeId, ChallengeStatus status) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        if (!isValidChallengeStatusTransition(challenge.getStatus(), status)) {
            throw new IllegalStateException(
                    "Invalid challenge status transition: " + challenge.getStatus() + " -> " + status
            );
        }
        if (status == ChallengeStatus.ACTIVE) {
            validateChallengeCanBeActivated(challenge);
        }

        Challenge saved = challengeRepository.save(challenge.toBuilder()
                .status(status)
                .updatedAt(LocalDateTime.now())
                .build());

        if (status == ChallengeStatus.CLOSED) {
            closeChallengeParticipants(saved.getId());
        }
        return saved;
    }

    @Override
    public ChallengeParticipant joinChallenge(ChallengeParticipant participant) {
        if (participant.getMemberId() == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        Challenge challenge = challengeRepository.findById(participant.getChallengeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Challenge not found"));

        if (challenge.getStatus() != ChallengeStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Challenge is not active");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(challenge.getStartsAt())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Challenge has not started yet");
        }
        if (now.isAfter(challenge.getEndsAt())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Challenge has already ended");
        }

        ChallengeParticipant previous = challengeParticipantRepository
                .findByChallengeIdAndMemberId(participant.getChallengeId(), participant.getMemberId())
                .orElse(null);

        if (previous != null && previous.getStatus() != ParticipantStatus.LEFT) {
            return previous;
        }
        if (previous != null) {
            previous.setStatus(ParticipantStatus.JOINED);
            previous.setCurrentPoints(0);
            previous.setJoinedAt(now);
            previous.setCompletedAt(null);
            return challengeParticipantRepository.save(previous);
        }

        ChallengeParticipant entity = participant.toBuilder()
                .status(ParticipantStatus.JOINED)
                .currentPoints(0)
                .joinedAt(now)
                .completedAt(null)
                .build();

        return challengeParticipantRepository.save(entity);
    }

    @Override
    public ChallengeParticipant leaveChallenge(Long challengeId, Long memberId) {
        ChallengeParticipant participant = challengeParticipantRepository
                .findByChallengeIdAndMemberId(challengeId, memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "You have not joined this challenge"));

        if (participant.getStatus() == ParticipantStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Completed challenge cannot be abandoned");
        }

        participant.setStatus(ParticipantStatus.LEFT);
        return challengeParticipantRepository.save(participant);
    }

    @Override
    public Challenge getChallenge(Long id) {
        return challengeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));
    }

    @Override
    public List<ChallengeParticipant> getMemberChallenges(Long memberId) {
        if (memberId == null) {
            throw new IllegalArgumentException("Member id is required");
        }
        return challengeParticipantRepository.findAllByMemberId(memberId);
    }

    @Override
    public void applyProgress(Long memberId, Integer points) {
        if (memberId == null) {
            throw new IllegalArgumentException("Member id is required");
        }
        if (points == null || points <= 0) {
            throw new IllegalArgumentException("Progress points must be positive");
        }

        List<ChallengeParticipant> participants = challengeParticipantRepository
                .findAllByMemberIdAndStatus(memberId, ParticipantStatus.JOINED);

        for (ChallengeParticipant participant : participants) {
            Challenge challenge = challengeRepository.findById(participant.getChallengeId())
                    .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

            if (challenge.getStatus() != ChallengeStatus.ACTIVE) {
                log.info("Skipping participant {} because challenge {} is {}", participant.getId(),
                        challenge.getId(), challenge.getStatus());
                continue;
            }

            int currentPoints = participant.getCurrentPoints() == null ? 0 : participant.getCurrentPoints();
            int newPoints = Math.min(currentPoints + points, challenge.getTargetPoints());
            boolean completed = newPoints >= challenge.getTargetPoints();
            LocalDateTime now = LocalDateTime.now();

            ChallengeParticipant saved = challengeParticipantRepository.save(participant.toBuilder()
                    .currentPoints(newPoints)
                    .status(completed ? ParticipantStatus.COMPLETED : ParticipantStatus.JOINED)
                    .completedAt(completed ? now : participant.getCompletedAt())
                    .build());

            if (completed) {
                challengeEventProducer.sendChallengeCompleted(new ChallengeCompletedEvent(
                        saved.getChallengeId(),
                        saved.getMemberId(),
                        saved.getCurrentPoints(),
                        now
                ));
            }
        }
    }

    private void closeChallengeParticipants(Long challengeId) {
        LocalDateTime now = LocalDateTime.now();

        for (ChallengeParticipant participant : challengeParticipantRepository.findAllByChallengeId(challengeId)) {
            if (participant.getStatus() == ParticipantStatus.COMPLETED) {
                continue;
            }
            challengeParticipantRepository.save(participant.toBuilder()
                    .status(ParticipantStatus.COMPLETED)
                    .completedAt(now)
                    .build());
        }
    }

    private void validateChallengeCanBeActivated(Challenge challenge) {
        LocalDateTime now = LocalDateTime.now();

        if (challenge.getStartsAt() == null || challenge.getEndsAt() == null) {
            throw new IllegalStateException("Challenge start and end time are required for activation");
        }
        if (!challenge.getEndsAt().isAfter(now)) {
            throw new IllegalStateException("Cannot activate challenge that already ended");
        }
        if (!challenge.getEndsAt().isAfter(challenge.getStartsAt())) {
            throw new IllegalStateException("Challenge end time must be after start time");
        }
        if (challenge.getTargetPoints() == null || challenge.getTargetPoints() <= 0) {
            throw new IllegalStateException("Challenge target points must be positive");
        }
    }

    private boolean isValidChallengeStatusTransition(ChallengeStatus currentStatus, ChallengeStatus newStatus) {
        if (currentStatus == newStatus) {
            return true;
        }
        return switch (currentStatus) {
            case DRAFT -> newStatus == ChallengeStatus.ACTIVE || newStatus == ChallengeStatus.CLOSED;
            case ACTIVE -> newStatus == ChallengeStatus.CLOSED;
            case COMPLETED, CLOSED -> false;
        };
    }
}
