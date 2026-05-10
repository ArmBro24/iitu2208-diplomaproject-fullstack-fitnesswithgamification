package com.example.diploma.model;

import com.example.diploma.model.enums.TrainingSessionStatus;
import com.example.diploma.model.enums.TrainingType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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

    @Column(nullable = false)
    private Integer points;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Exercise> exercises;

    public void setExercises(List<Exercise> exercises) {
        this.exercises = exercises;
        if (exercises != null) {
            exercises.forEach(exercise -> exercise.setSession(this));
        }
    }

    @Enumerated(EnumType.STRING)
    private TrainingType type;
}
