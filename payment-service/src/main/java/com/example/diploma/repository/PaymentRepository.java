package com.example.diploma.repository;

import com.example.diploma.model.Payment;
import com.example.diploma.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findAllByMemberId(Long memberId);

    List<Payment> findAllBySubscriptionId(Long subscriptionId);

    List<Payment> findAllByStatus(PaymentStatus status);
}