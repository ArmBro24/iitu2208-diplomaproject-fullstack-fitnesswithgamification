package com.example.diploma.repository;


import com.example.diploma.model.Challenge;
import com.example.diploma.model.enums.ChallengeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findAllByStatusOrderByCreatedAtDesc(ChallengeStatus status);
}
