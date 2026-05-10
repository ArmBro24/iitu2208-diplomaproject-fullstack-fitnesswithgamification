package com.example.diploma.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "training_exercises")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer planned;
    private Integer done;

    @ManyToOne
    @JoinColumn(name = "training_session_id")
    private TrainingSession session;
}