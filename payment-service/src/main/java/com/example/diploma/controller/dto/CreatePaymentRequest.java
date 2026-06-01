package com.example.diploma.controller.dto;

import com.example.diploma.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreatePaymentRequest(
        @NotNull Long subscriptionId,
        @NotNull Long memberId,
        @NotNull BigDecimal amount,
        @NotBlank String currency,
        @NotNull PaymentMethod method
) {}