package com.example.diploma.service.impl;

import com.example.diploma.event.PointsAwardedEvent;
import com.example.diploma.kafka.PointsEventProducer;
import com.example.diploma.model.Character;
import com.example.diploma.model.PointsLedger;
import com.example.diploma.model.enums.PointsReason;
import com.example.diploma.repository.CharacterRepository;
import com.example.diploma.repository.PointsLedgerRepository;
import com.example.diploma.service.GamificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class GamificationServiceImpl implements GamificationService {

    private final CharacterRepository characterRepository;
    private final PointsLedgerRepository pointsLedgerRepository;
    private final PointsEventProducer pointsEventProducer;

    @Override
    public Character createCharacter(Character character) {
        if (character.getMemberId() == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        if (characterRepository.existsByMemberId(character.getMemberId())) {
            throw new IllegalStateException("Character already exists for this member");
        }

        LocalDateTime now = LocalDateTime.now();

        Character entity = character.toBuilder()
                .level(1)
                .xp(0)
                .totalPoints(0)
                .createdAt(now)
                .updatedAt(now)
                .build();

        return characterRepository.save(entity);
    }

    @Override
    public Character applyPoints(Long memberId, Integer delta, String comment) {
        if (memberId == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        Character existing = characterRepository.findByMemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Character not found for member: " + memberId));

        int safeDelta = (delta == null ? 0 : delta);

        int newTotal = existing.getTotalPoints() + safeDelta;
        if (newTotal < 0) newTotal = 0;

        int xpAdd = Math.max(safeDelta, 0);
        int newXp = existing.getXp() + xpAdd;

        int newLevel = calculateLevel(newXp);

        LocalDateTime now = LocalDateTime.now();

        Character updated = existing.toBuilder()
                .totalPoints(newTotal)
                .xp(newXp)
                .level(newLevel)
                .updatedAt(now)
                .build();

        Character saved = characterRepository.save(updated);

        PointsReason reason;
        if (safeDelta > 0) reason = PointsReason.FULL;
        else if (safeDelta == 0) reason = PointsReason.ZERO;
        else reason = PointsReason.PENALTY;

        PointsLedger entry = PointsLedger.builder()
                .memberId(memberId)
                .sessionId(null)
                .pointsAwarded(safeDelta)
                .reason(reason)
                .comment(comment)
                .createdAt(now)
                .build();

        pointsLedgerRepository.save(entry);

        log.info("POINTS APPLIED: memberId={}, delta={}, totalPoints={}, xp={}, level={}",
                memberId, safeDelta, saved.getTotalPoints(), saved.getXp(), saved.getLevel());

        if (safeDelta > 0) {
            pointsEventProducer.sendPointsAwarded(
                    new PointsAwardedEvent(
                            memberId,
                            safeDelta,
                            now
                    )
            );
        }

        return saved;
    }

    @Override
    public Character applyTrainingPoints(Long sessionId, Long memberId, Integer points, String comment) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Session id is required");
        }

        if (memberId == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        if (points == null || points <= 0) {
            throw new IllegalArgumentException("Training points must be positive");
        }

        if (pointsLedgerRepository.existsBySessionId(sessionId)) {
            log.info(
                    "Training points for session {} already processed. Skipping duplicate event.",
                    sessionId
            );

            return getCharacter(memberId);
        }

        Character character = characterRepository.findByMemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Character not found for member: " + memberId));

        int currentXp = character.getXp() != null ? character.getXp() : 0;
        int currentTotalPoints = character.getTotalPoints() != null ? character.getTotalPoints() : 0;

        int oldLevel = character.getLevel() != null ? character.getLevel() : 1;

        int newXp = currentXp + points;
        int newTotalPoints = currentTotalPoints + points;
        int newLevel = calculateLevel(newXp);

        Character updated = character.toBuilder()
                .xp(newXp)
                .totalPoints(newTotalPoints)
                .level(newLevel)
                .updatedAt(LocalDateTime.now())
                .build();

        Character saved = characterRepository.save(updated);

        if (newLevel > oldLevel) {
            log.info(
                    "LEVEL UP: memberId={}, oldLevel={}, newLevel={}, xp={}",
                    memberId,
                    oldLevel,
                    newLevel,
                    newXp
            );
        }

        PointsLedger ledger = PointsLedger.builder()
                .memberId(memberId)
                .sessionId(sessionId)
                .pointsAwarded(points)
                .reason(PointsReason.FULL)
                .comment(comment)
                .createdAt(LocalDateTime.now())
                .build();

        pointsLedgerRepository.save(ledger);

        pointsEventProducer.sendPointsAwarded(
                new PointsAwardedEvent(
                        memberId,
                        points,
                        LocalDateTime.now()
                )
        );

        log.info(
                "Training points applied: sessionId={}, memberId={}, points={}, totalPoints={}",
                sessionId,
                memberId,
                points,
                saved.getTotalPoints()
        );

        return saved;
    }

    @Override
    public PointsLedger addLedgerEntry(PointsLedger entry) {
        if (entry.getMemberId() == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        if (entry.getPointsAwarded() == null) {
            throw new IllegalArgumentException("Points value is required");
        }

        if (entry.getCreatedAt() == null) {
            entry = entry.toBuilder()
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        return pointsLedgerRepository.save(entry);
    }

    @Override
    public Character getCharacter(Long memberId) {
        if (memberId == null) {
            throw new IllegalArgumentException("Member id is required");
        }

        return characterRepository.findByMemberId(memberId)
                .orElseGet(() -> {
                    log.info("Character not found for memberId={}. Creating default RPG profile.", memberId);
                    LocalDateTime now = LocalDateTime.now();
                    Character newCharacter = Character.builder()
                            .memberId(memberId)
                            .level(1)
                            .xp(0)
                            .totalPoints(0)
                            .createdAt(now)
                            .updatedAt(now)
                            .build();
                    return characterRepository.save(newCharacter);
                });
    }

    private int calculateLevel(Integer xp) {
        int safeXp = xp != null ? xp : 0;
        return (safeXp / 100) + 1;
    }
}