package com.example.diploma.repository;

import com.example.diploma.model.SessionLog;
import com.example.diploma.model.enums.SessionLogStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface SessionLogRepository extends JpaRepository<SessionLog, Long> {
    long countByStatus(SessionLogStatus status);

    boolean existsBySessionIdAndMemberIdAndStatusIn(
            Long sessionId,
            Long memberId,
            Collection<SessionLogStatus> statuses
    );

    Optional<SessionLog> findTopBySessionIdOrderBySubmittedAtDesc(Long sessionId);
    Optional<SessionLog> findBySessionId(Long sessionId);
}
