package com.example.diploma.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "training_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Например, "STRENGTH", "CARDIO"

    @Column(nullable = false)
    private Integer defaultPoints;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "training_category_default_exercises", joinColumns = @JoinColumn(name = "category_id"))
    @Builder.Default
    private List<DefaultExercise> defaultExercises = new ArrayList<>();
}