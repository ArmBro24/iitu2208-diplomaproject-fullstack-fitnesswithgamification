package com.example.diploma.repository;

import com.example.diploma.model.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
    List<TrainingSession> findAllByMemberId(Long memberId);
}
