package com.example.diploma.controller;

import com.example.diploma.controller.dto.AdjustPointsRequest;
import com.example.diploma.controller.dto.CreateCharacterRequest;
import com.example.diploma.model.Character;
import com.example.diploma.service.GamificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gamification")
public class GamificationController {

    private final GamificationService gamificationService;

    @PostMapping("/characters")
    @ResponseStatus(HttpStatus.CREATED)
    public Character createCharacter(@RequestBody @Valid CreateCharacterRequest req) {
        Character character = Character.builder()
                .memberId(req.memberId())
                .build();

        return gamificationService.createCharacter(character);
    }

    @PatchMapping("/characters/{memberId}/points")
    public Character applyPoints(@PathVariable Long memberId,
                                 @RequestBody @Valid AdjustPointsRequest req) {
        return gamificationService.applyPoints(memberId, req.delta(), req.comment());
    }

    @GetMapping("/characters/{memberId}")
    public Character getCharacter(@PathVariable Long memberId) {
        return gamificationService.getCharacter(memberId);
    }


}
