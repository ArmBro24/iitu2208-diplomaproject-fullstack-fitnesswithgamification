package com.example.diploma.repository;

import com.example.diploma.model.PointsLedger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointsLedgerRepository extends JpaRepository<PointsLedger, Long> {

    boolean existsBySessionId(Long sessionId);

    List<PointsLedger> findAllByMemberId(Long memberId);
}