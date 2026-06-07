package com.example.diploma.controller;

import com.example.diploma.controller.dto.AdminChallengeResponse;
import com.example.diploma.controller.dto.CreateChallengeRequest;
import com.example.diploma.controller.dto.JoinChallengeRequest;
import com.example.diploma.controller.dto.MemberChallengeResponse;
import com.example.diploma.controller.dto.ProgressRequest;
import com.example.diploma.model.Challenge;
import com.example.diploma.model.ChallengeParticipant;
import com.example.diploma.model.enums.ChallengeStatus;
import com.example.diploma.model.enums.ParticipantStatus;
import com.example.diploma.repository.ChallengeParticipantRepository;
import com.example.diploma.repository.ChallengeRepository;
import com.example.diploma.security.JwtService;
import com.example.diploma.service.ChallengeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;
    private final ChallengeRepository challengeRepository;
    private final ChallengeParticipantRepository challengeParticipantRepository;
    private final JwtService jwtService;

    @GetMapping("/admin")
    public List<AdminChallengeResponse> getAdminChallenges() {
        return challengeRepository.findAll().stream()
                .map(challenge -> new AdminChallengeResponse(
                        challenge.getId(),
                        challenge.getTitle(),
                        challenge.getDescription(),
                        challenge.getTargetPoints(),
                        challenge.getRewardPoints(),
                        challenge.getStatus(),
                        challenge.getStartsAt(),
                        challenge.getEndsAt(),
                        challengeParticipantRepository.countByChallengeId(challenge.getId()),
                        challengeParticipantRepository.countByChallengeIdAndStatus(
                                challenge.getId(),
                                ParticipantStatus.COMPLETED
                        )
                ))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Challenge createChallenge(@RequestBody @Valid CreateChallengeRequest req) {
        if (!req.endsAt().isAfter(req.startsAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date must be after start date");
        }

        Challenge challenge = Challenge.builder()
                .title(req.title())
                .description(req.description())
                .targetPoints(req.targetPoints())
                .rewardPoints(req.rewardPoints())
                .startsAt(req.startsAt())
                .endsAt(req.endsAt())
                .status(ChallengeStatus.ACTIVE)
                .build();

        return challengeService.createChallenge(challenge);
    }

    @PatchMapping("/{challengeId}/status")
    public Challenge updateChallengeStatus(@PathVariable Long challengeId,
                                           @RequestParam ChallengeStatus status) {
        return challengeService.updateChallengeStatus(challengeId, status);
    }

    @PostMapping("/join")
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeParticipant joinChallenge(
            @RequestBody @Valid JoinChallengeRequest req,
            @RequestHeader("Authorization") String authorization
    ) {
        ChallengeParticipant participant = ChallengeParticipant.builder()
                .challengeId(req.challengeId())
                .memberId(getCurrentUserId(authorization))
                .build();

        return challengeService.joinChallenge(participant);
    }

    @PatchMapping("/{challengeId}/leave")
    public ChallengeParticipant leaveChallenge(
            @PathVariable Long challengeId,
            @RequestHeader("Authorization") String authorization
    ) {
        return challengeService.leaveChallenge(challengeId, getCurrentUserId(authorization));
    }

    @GetMapping("/{id}")
    public Challenge getChallenge(@PathVariable Long id) {
        return challengeService.getChallenge(id);
    }

    @GetMapping("/catalog")
    public List<MemberChallengeResponse> getPublishedChallenges() {
        return challengeRepository.findAllByStatusOrderByCreatedAtDesc(ChallengeStatus.ACTIVE).stream()
                .map(challenge -> new MemberChallengeResponse(
                        challenge.getId(),
                        challenge.getTitle(),
                        challenge.getDescription(),
                        challenge.getTargetPoints(),
                        challenge.getStatus(),
                        challenge.getStartsAt(),
                        challenge.getEndsAt(),
                        0,
                        null
                ))
                .toList();
    }

    @GetMapping("/member/{memberId}")
    public List<MemberChallengeResponse> getMemberChallenges(
            @PathVariable Long memberId,
            @RequestHeader("Authorization") String authorization
    ) {
        if (!memberId.equals(getCurrentUserId(authorization))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own challenge participation");
        }
        return getPersonalChallenges(memberId);
    }

    @GetMapping("/me")
    public List<MemberChallengeResponse> getMyChallenges(@RequestHeader("Authorization") String authorization) {
        return getPersonalChallenges(getCurrentUserId(authorization));
    }

    @PostMapping("/{challengeId}/progress")
    @ResponseStatus(HttpStatus.OK)
    public void reportProgress(
            @PathVariable Long challengeId,
            @RequestBody @Valid ProgressRequest req,
            @RequestHeader("Authorization") String authorization
    ) {
        Long memberId = getCurrentUserId(authorization);
        challengeService.applyProgress(memberId, req.points());
    }

    private List<MemberChallengeResponse> getPersonalChallenges(Long memberId) {
        Map<Long, ChallengeParticipant> participantByChallenge = challengeService.getMemberChallenges(memberId).stream()
                .collect(Collectors.toMap(
                        ChallengeParticipant::getChallengeId,
                        Function.identity(),
                        (existing, newer) -> newer
                ));

        return challengeRepository.findAllByStatusOrderByCreatedAtDesc(ChallengeStatus.ACTIVE).stream()
                .map(challenge -> {
                    ChallengeParticipant participant = participantByChallenge.get(challenge.getId());
                    return new MemberChallengeResponse(
                            challenge.getId(),
                            challenge.getTitle(),
                            challenge.getDescription(),
                            challenge.getTargetPoints(),
                            challenge.getStatus(),
                            challenge.getStartsAt(),
                            challenge.getEndsAt(),
                            participant == null ? 0 : participant.getCurrentPoints(),
                            participant == null ? null : participant.getStatus()
                    );
                })
                .toList();
    }

    private Long getCurrentUserId(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required");
        }
        return jwtService.extractUserId(authorization.substring(7));
    }
}