package com.example.diploma.controller;


import com.example.diploma.controller.dto.CreateChallengeRequest;
import com.example.diploma.controller.dto.JoinChallengeRequest;
import com.example.diploma.model.Challenge;
import com.example.diploma.model.ChallengeParticipant;
import com.example.diploma.service.ChallengeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Challenge createChallenge(@RequestBody @Valid CreateChallengeRequest req) {
        Challenge challenge = Challenge.builder()
                .title(req.title())
                .description(req.description())
                .targetPoints(req.targetPoints())
                .startsAt(req.startsAt())
                .endsAt(req.endsAt())
                .build();

        return challengeService.createChallenge(challenge);
    }

    @PostMapping("/join")
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeParticipant joinChallenge(@RequestBody @Valid JoinChallengeRequest req) {
        ChallengeParticipant participant = ChallengeParticipant.builder()
                .challengeId(req.challengeId())
                .memberId(req.memberId())
                .build();

        return challengeService.joinChallenge(participant);
    }

    @GetMapping("/{id}")
    public Challenge getChallenge(@PathVariable Long id) {
        return challengeService.getChallenge(id);
    }

    @GetMapping("/member/{memberId}")
    public List<ChallengeParticipant> getMemberChallenges(@PathVariable Long memberId) {
        return challengeService.getMemberChallenges(memberId);
    }
}