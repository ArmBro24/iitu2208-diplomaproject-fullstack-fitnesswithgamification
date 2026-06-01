package com.example.diploma.event;

import java.math.BigDecimal;

public record PaymentCompletedEvent(
        Long paymentId,
        Long memberId,
        Long subscriptionId,
        BigDecimal amount
) {}