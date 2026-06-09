package com.example.diploma.controller;

import com.example.diploma.controller.dto.AiChatRequest;
import com.example.diploma.controller.dto.AiChatResponse;
import com.example.diploma.controller.dto.AiRecommendationRequest;
import com.example.diploma.controller.dto.AiRecommendationResponse;
import com.example.diploma.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public AiChatResponse chat(@RequestBody @Valid AiChatRequest request) {
        String reply = aiService.askAi(request.getMessage(), request.getMessages(), request.getUserContext());
        return new AiChatResponse(reply);
    }

    @PostMapping("/recommend")
    public AiRecommendationResponse recommend(@RequestBody AiRecommendationRequest request) {
        String plan = aiService.generateWorkout(
                request.getLevel(),
                request.getGoal(),
                request.getLastSessions()
        );

        return new AiRecommendationResponse(plan);
    }
}
