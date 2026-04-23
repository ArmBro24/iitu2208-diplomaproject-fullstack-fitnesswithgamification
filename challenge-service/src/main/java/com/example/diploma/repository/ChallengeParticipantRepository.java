package com.example.diploma.repository;

import com.example.diploma.model.ChallengeParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeParticipantRepository extends JpaRepository<ChallengeParticipant, Long> {
}