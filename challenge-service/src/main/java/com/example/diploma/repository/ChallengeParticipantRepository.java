package com.example.diploma.repository;

import com.example.diploma.model.ChallengeParticipant;
import com.example.diploma.model.enums.ParticipantStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeParticipantRepository extends JpaRepository<ChallengeParticipant, Long> {

    boolean existsByChallengeIdAndMemberId(Long challengeId, Long memberId);

    List<ChallengeParticipant> findAllByMemberId(Long memberId);

    List<ChallengeParticipant> findAllByMemberIdAndStatus(Long memberId, ParticipantStatus status);

    List<ChallengeParticipant> findAllByChallengeId(Long challengeId);
}