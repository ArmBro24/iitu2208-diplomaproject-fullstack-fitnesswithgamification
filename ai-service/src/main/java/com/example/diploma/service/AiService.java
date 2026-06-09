package com.example.diploma.service;

import com.example.diploma.controller.dto.AiMessageDto;

import java.util.List;
import java.util.Map;

public interface AiService {

    String askAi(String message, List<AiMessageDto> messages, Map<String, Object> userContext);

    String generateWorkout(String level,
                           String goal,
                           List<String> lastSessions);
}
