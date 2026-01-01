package com.example.diploma.repository;

import com.example.diploma.model.SessionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionLogRepository extends JpaRepository<SessionLog, Long> {
}
