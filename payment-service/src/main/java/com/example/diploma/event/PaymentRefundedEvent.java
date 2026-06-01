package com.example.diploma.event;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class PaymentRefundedEvent {

    private Long paymentId;
    private Long memberId;
    private Long subscriptionId;
    private BigDecimal amount;
}