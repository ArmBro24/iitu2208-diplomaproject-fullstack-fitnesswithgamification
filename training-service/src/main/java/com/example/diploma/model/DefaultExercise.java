package com.example.diploma.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DefaultExercise {

    private String name;
    private Integer planned;
}