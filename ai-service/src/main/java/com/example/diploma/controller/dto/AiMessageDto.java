package com.example.diploma.controller.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiMessageDto {

    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Content is required")
    private String content;
}