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
        Challenge entity = challenge.toBuilder()
                .status(ChallengeStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return challengeRepository.save(entity);
    }

    @Override
    public ChallengeParticipant joinChallenge(ChallengeParticipant participant) {
        boolean exists = challengeParticipantRepository.findAll().stream()
                .anyMatch(p -> p.getChallengeId().equals(participant.getChallengeId())
                        && p.getMemberId().equals(participant.getMemberId()));

        if (exists) {
            throw new IllegalStateException("Member already joined this challenge");
        }

        ChallengeParticipant entity = participant.toBuilder()
                .currentPoints(0)
                .status(ParticipantStatus.JOINED)
                .joinedAt(LocalDateTime.now())
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
        return challengeParticipantRepository.findAll().stream()
                .filter(p -> p.getMemberId().equals(memberId))
                .toList();
    }

    @Override
    public void applyProgress(Long memberId, Integer points) {

        log.info("applyProgress start: memberId={}, points={}", memberId, points);

        List<ChallengeParticipant> participants =
                challengeParticipantRepository.findAll().stream()
                        .filter(p -> p.getMemberId().equals(memberId))
                        .toList();

        log.info("participants found: {}", participants.size());

        for (ChallengeParticipant p : participants) {

            if (p.getStatus() == ParticipantStatus.COMPLETED) continue;

            log.info("before update: participantId={}, currentPoints={}", p.getId(), p.getCurrentPoints());

            int newPoints = p.getCurrentPoints() + points;

            Challenge challenge = challengeRepository.findById(p.getChallengeId())
                    .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

            boolean completed = newPoints >= challenge.getTargetPoints();
            LocalDateTime now = LocalDateTime.now();

            ChallengeParticipant updated = p.toBuilder()
                    .currentPoints(newPoints)
                    .status(completed ? ParticipantStatus.COMPLETED : ParticipantStatus.JOINED)
                    .completedAt(completed ? now : p.getCompletedAt())
                    .build();

            log.info("after update: participantId={}, currentPoints={}", updated.getId(), updated.getCurrentPoints());

            ChallengeParticipant saved = challengeParticipantRepository.save(updated);

            log.info("participant saved: id={}, currentPoints={}", saved.getId(), saved.getCurrentPoints());

            if (completed) {
                log.info("challenge completed: challengeId={}, memberId={}, finalPoints={}",
                        saved.getChallengeId(), saved.getMemberId(), saved.getCurrentPoints());

                challengeEventProducer.sendChallengeCompleted(
                        new ChallengeCompletedEvent(
                                saved.getChallengeId(),
                                saved.getMemberId(),
                                saved.getCurrentPoints(),
                                now
                        )
                );
            }
        }
    }
}