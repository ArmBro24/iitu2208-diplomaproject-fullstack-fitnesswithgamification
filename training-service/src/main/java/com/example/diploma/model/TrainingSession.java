package com.example.diploma.model;

import com.example.diploma.model.enums.TrainingSessionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "\"training_sessions\"")
@Builder(toBuilder = true)
public class TrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long coachId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime startsAt;

    @Column(nullable = false)
    private LocalDateTime endsAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrainingSessionStatus status;
}
