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
import org.springframework.stereotype.Service;

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

        ChallengeStatus currentStatus = challenge.getStatus();

        if (!isValidChallengeStatusTransition(currentStatus, status)) {
            throw new IllegalStateException(
                    "Invalid challenge status transition: " + currentStatus + " -> " + status
            );
        }

        if (status == ChallengeStatus.ACTIVE) {
            validateChallengeCanBeActivated(challenge);
        }

        Challenge updated = challenge.toBuilder()
                .status(status)
                .updatedAt(LocalDateTime.now())
                .build();

        Challenge saved = challengeRepository.save(updated);

        if (status == ChallengeStatus.CLOSED) {
            closeChallengeParticipants(saved.getId());
        }

        return saved;
    }

    @Override
    public ChallengeParticipant joinChallenge(ChallengeParticipant participant) {
        Challenge challenge = challengeRepository.findById(participant.getChallengeId())
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        if (challenge.getStatus() != ChallengeStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Member can join only ACTIVE challenge. Current status: " + challenge.getStatus()
            );
        }

        if (participant.getMemberId() == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        boolean alreadyJoined = challengeParticipantRepository.existsByChallengeIdAndMemberId(
                participant.getChallengeId(),
                participant.getMemberId()
        );

        if (alreadyJoined) {
            throw new IllegalStateException("Member already joined this challenge");
        }

        ChallengeParticipant entity = participant.toBuilder()
                .status(ParticipantStatus.JOINED)
                .currentPoints(0)
                .joinedAt(LocalDateTime.now())
                .completedAt(null)
                .build();

        return challengeParticipantRepository.save(entity);
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

        log.info("applyProgress start: memberId={}, points={}", memberId, points);

        List<ChallengeParticipant> participants =
                challengeParticipantRepository.findAllByMemberIdAndStatus(
                        memberId,
                        ParticipantStatus.JOINED
                );

        log.info("active joined participants found: {}", participants.size());

        for (ChallengeParticipant participant : participants) {
            Challenge challenge = challengeRepository.findById(participant.getChallengeId())
                    .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

            if (challenge.getStatus() != ChallengeStatus.ACTIVE) {
                log.info(
                        "Skipping participant {} because challenge {} is not ACTIVE. Current status: {}",
                        participant.getId(),
                        challenge.getId(),
                        challenge.getStatus()
                );
                continue;
            }

            int currentPoints = participant.getCurrentPoints() != null
                    ? participant.getCurrentPoints()
                    : 0;

            int calculatedPoints = currentPoints + points;
            int newPoints = Math.min(calculatedPoints, challenge.getTargetPoints());
            boolean completed = newPoints >= challenge.getTargetPoints();
            LocalDateTime now = LocalDateTime.now();

            ChallengeParticipant updated = participant.toBuilder()
                    .currentPoints(newPoints)
                    .status(completed ? ParticipantStatus.COMPLETED : ParticipantStatus.JOINED)
                    .completedAt(completed ? now : participant.getCompletedAt())
                    .build();

            ChallengeParticipant saved = challengeParticipantRepository.save(updated);

            log.info(
                    "challenge progress updated: participantId={}, challengeId={}, memberId={}, currentPoints={}, status={}",
                    saved.getId(),
                    saved.getChallengeId(),
                    saved.getMemberId(),
                    saved.getCurrentPoints(),
                    saved.getStatus()
            );

            if (completed) {
                challengeEventProducer.sendChallengeCompleted(
                        new ChallengeCompletedEvent(
                                saved.getChallengeId(),
                                saved.getMemberId(),
                                saved.getCurrentPoints(),
                                now
                        )
                );

                log.info(
                        "challenge completed event sent: challengeId={}, memberId={}, finalPoints={}",
                        saved.getChallengeId(),
                        saved.getMemberId(),
                        saved.getCurrentPoints()
                );
            }
        }
    }


    private void closeChallengeParticipants(Long challengeId) {
        List<ChallengeParticipant> participants =
                challengeParticipantRepository.findAllByChallengeId(challengeId);

        LocalDateTime now = LocalDateTime.now();

        for (ChallengeParticipant participant : participants) {

            if (participant.getStatus() == ParticipantStatus.COMPLETED) {
                continue;
            }

            ChallengeParticipant updatedParticipant = participant.toBuilder()
                    .status(ParticipantStatus.COMPLETED)
                    .completedAt(now)
                    .build();

            challengeParticipantRepository.save(updatedParticipant);

            log.info(
                    "participant {} completed because challenge {} was CLOSED",
                    updatedParticipant.getId(),
                    challengeId
            );
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


    private boolean isValidChallengeStatusTransition(
            ChallengeStatus currentStatus,
            ChallengeStatus newStatus
    ) {
        if (currentStatus == newStatus) {
            return true;
        }

        return switch (currentStatus) {
            case DRAFT -> newStatus == ChallengeStatus.ACTIVE
                    || newStatus == ChallengeStatus.CLOSED;

            case ACTIVE -> newStatus == ChallengeStatus.CLOSED;

            case COMPLETED, CLOSED -> false;
        };
    }
}