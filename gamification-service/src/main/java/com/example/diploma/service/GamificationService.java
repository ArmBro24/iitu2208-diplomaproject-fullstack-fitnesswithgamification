package com.example.diploma.service;

import com.example.diploma.model.Character;
import com.example.diploma.model.PointsLedger;

public interface GamificationService {

    Character createCharacter(Character character);

    Character applyPoints(Long memberId, Integer delta, String comment);

    PointsLedger addLedgerEntry(PointsLedger entry);

    Character getCharacter(Long memberId);
}
