package com.example.diploma.controller.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class AiChatRequest {

    @NotBlank(message = "Message is required")
    private String message;

    @Valid
    private List<AiMessageDto> messages;
}