package com.example.diploma.redis;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@RedisHash("payment_session")
public class PaymentSession {

    @Id
    private String id;

    private Long paymentId;
    private Long memberId;
    private Long subscriptionId;
    private String status;
    private LocalDateTime createdAt;
}