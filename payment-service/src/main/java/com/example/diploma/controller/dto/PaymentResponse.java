package com.example.diploma.controller.dto;

import com.example.diploma.model.enums.PaymentMethod;
import com.example.diploma.model.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long subscriptionId,
        Long memberId,
        BigDecimal amount,
        String currency,
        PaymentMethod method,
        PaymentStatus status,
        String failureReason,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime paidAt,
        LocalDateTime refundedAt
) {}