package com.example.diploma.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiRecommendationCreatedEvent {

    private String level;

    private String goal;

    private String plan;

    private LocalDateTime createdAt;
}