package com.example.diploma.repository;

import com.example.diploma.model.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
}
