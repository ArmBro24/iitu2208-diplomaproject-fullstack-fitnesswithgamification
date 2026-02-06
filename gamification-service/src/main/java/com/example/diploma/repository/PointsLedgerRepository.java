package com.example.diploma.repository;


import com.example.diploma.model.PointsLedger;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointsLedgerRepository extends JpaRepository<PointsLedger, Long> {
}
