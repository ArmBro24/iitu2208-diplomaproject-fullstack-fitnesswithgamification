package com.example.diploma.controller.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AiChatRequest {

    @NotBlank(message = "Message is required")
    private String message;

    @Valid
    private List<AiMessageDto> messages;

    private Map<String, Object> userContext;
}
