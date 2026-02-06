package com.example.diploma.model;

import com.example.diploma.model.enums.PointsReason;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "\"points_ledger\"")
@Builder(toBuilder = true)
public class PointsLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long sessionId;

    @Column(nullable = false)
    private Integer pointsAwarded;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PointsReason reason;

    @Column(length = 2000)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;

}
