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

        // без кастомных finder-ов: проверяем через findAll()
        boolean exists = characterRepository.findAll().stream()
                .anyMatch(c -> c.getMemberId().equals(character.getMemberId()));

        if (exists) {
            throw new IllegalStateException("Character already exists for memberId=" + character.getMemberId());
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

        Character existing = characterRepository.findAll().stream()
                .filter(c -> c.getMemberId().equals(memberId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Character not found for memberId=" + memberId));

        int safeDelta = (delta == null ? 0 : delta);

        int newTotal = existing.getTotalPoints() + safeDelta;
        if (newTotal < 0) newTotal = 0; // чтобы не уходить в минус

        int xpAdd = Math.max(safeDelta, 0);
        int newXp = existing.getXp() + xpAdd;

        // простая формула уровня (можешь потом заменить бизнес-логикой)
        int newLevel = 1 + (newXp / 100);

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
                .sessionId(null) // тут руками, без тренировки
                .pointsAwarded(safeDelta)
                .reason(reason)
                .comment(comment)
                .createdAt(now)
                .build();

        pointsLedgerRepository.save(entry);

        log.info("POINTS APPLIED: memberId={}, delta={}, totalPoints={}, xp={}, level={}",
                memberId, safeDelta, saved.getTotalPoints(), saved.getXp(), saved.getLevel());

        pointsEventProducer.sendPointsAwarded(
                new PointsAwardedEvent(
                        memberId,
                        safeDelta,
                        now
                )
        );

        return saved;
    }

    @Override
    public PointsLedger addLedgerEntry(PointsLedger entry) {
        return pointsLedgerRepository.save(entry);
    }

    @Override
    public Character getCharacter(Long memberId) {
        return characterRepository.findAll().stream()
                .filter(c -> c.getMemberId().equals(memberId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Character not found"));
    }

}
