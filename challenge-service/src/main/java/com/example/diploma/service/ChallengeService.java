package com.example.diploma.service;

import com.example.diploma.model.Challenge;
import com.example.diploma.model.ChallengeParticipant;
import com.example.diploma.model.enums.ChallengeStatus;

import java.util.List;

public interface ChallengeService {

    Challenge createChallenge(Challenge challenge);

    Challenge updateChallengeStatus(Long challengeId, ChallengeStatus status);

    ChallengeParticipant joinChallenge(ChallengeParticipant participant);

    ChallengeParticipant leaveChallenge(Long challengeId, Long memberId);

    Challenge getChallenge(Long id);

    List<ChallengeParticipant> getMemberChallenges(Long memberId);

    void applyProgress(Long memberId, Integer points);
}
