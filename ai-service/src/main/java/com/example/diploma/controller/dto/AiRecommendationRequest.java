package com.example.diploma.controller.dto;

import lombok.Data;

import java.util.List;

@Data
public class AiRecommendationRequest {

    private String level;

    private String goal;

    private List<String> lastSessions;
}