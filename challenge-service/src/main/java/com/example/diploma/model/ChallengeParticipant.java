package com.example.diploma.model;

import com.example.diploma.model.enums.ParticipantStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "\"challenge_participants\"")
@Builder(toBuilder = true)
public class ChallengeParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long challengeId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Integer currentPoints;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipantStatus status;

    private LocalDateTime joinedAt;
    private LocalDateTime completedAt;
}