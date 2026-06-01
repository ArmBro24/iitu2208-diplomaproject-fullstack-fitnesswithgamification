package com.example.diploma.event;

import java.math.BigDecimal;

public record PaymentRefundedEvent(
        Long paymentId,
        Long memberId,
        Long subscriptionId,
        BigDecimal amount
) {}