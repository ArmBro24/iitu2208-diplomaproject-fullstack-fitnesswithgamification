package com.example.diploma.model.enums;

import lombok.Getter;

@Getter
public enum TrainingType {
    STRENGTH(50),
    CARDIO(40),
    YOGA(30),
    CROSSFIT(60),
    OTHER(20);

    private final int defaultPoints;

    TrainingType(int defaultPoints) {
        this.defaultPoints = defaultPoints;
    }
}