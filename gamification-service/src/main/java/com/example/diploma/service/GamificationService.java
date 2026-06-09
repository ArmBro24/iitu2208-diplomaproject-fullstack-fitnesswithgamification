package com.example.diploma.service;

import com.example.diploma.model.Character;
import com.example.diploma.model.PointsLedger;

public interface GamificationService {

    Character createCharacter(Character character);

    Character applyPoints(Long memberId, Integer delta, String comment, String category);
    Character applyPoints(Long memberId, Integer delta, String comment);

    Character applyTrainingPoints(Long sessionId, Long memberId, Integer points, String comment, String category);
    Character applyTrainingPoints(Long sessionId, Long memberId, Integer points, String comment);

    PointsLedger addLedgerEntry(PointsLedger entry);

    Character getCharacter(Long memberId);

}