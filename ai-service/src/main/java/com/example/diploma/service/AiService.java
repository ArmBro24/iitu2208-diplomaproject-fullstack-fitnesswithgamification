package com.example.diploma.service;

import com.example.diploma.controller.dto.AiMessageDto;

import java.util.List;

public interface AiService {

    String askAi(String message, List<AiMessageDto> messages);

    String generateWorkout(String level,
                           String goal,
                           List<String> lastSessions);
}