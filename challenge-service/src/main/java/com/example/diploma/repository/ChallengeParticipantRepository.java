package com.example.diploma.repository;

import com.example.diploma.model.ChallengeParticipant;
import com.example.diploma.model.enums.ParticipantStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChallengeParticipantRepository extends JpaRepository<ChallengeParticipant, Long> {

    long countByChallengeId(Long challengeId);

    long countByChallengeIdAndStatus(Long challengeId, ParticipantStatus status);

    List<ChallengeParticipant> findAllByMemberId(Long memberId);

    List<ChallengeParticipant> findAllByMemberIdAndStatus(Long memberId, ParticipantStatus status);

    List<ChallengeParticipant> findAllByChallengeId(Long challengeId);

    Optional<ChallengeParticipant> findByChallengeIdAndMemberId(Long challengeId, Long memberId);
}
