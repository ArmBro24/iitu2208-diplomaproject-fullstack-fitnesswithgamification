package com.example.diploma.service;


import com.example.diploma.model.Challenge;
import com.example.diploma.model.ChallengeParticipant;

import java.util.List;

public interface ChallengeService {

    Challenge createChallenge(Challenge challenge);

    ChallengeParticipant joinChallenge(ChallengeParticipant participant);

    Challenge getChallenge(Long id);

    List<ChallengeParticipant> getMemberChallenges(Long memberId);

    void applyProgress(Long memberId, Integer points);
}