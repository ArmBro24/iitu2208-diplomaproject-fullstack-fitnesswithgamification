package com.example.diploma.controller;

import com.example.diploma.model.Mentorship;
import com.example.diploma.repository.MentorshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training/mentorship")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MentorshipController {

    private final MentorshipRepository mentorshipRepository;

    @GetMapping("/client/{clientId}")
    public Mentorship getMentorshipByClient(@PathVariable Long clientId) {
        return mentorshipRepository.findByClientId(clientId).orElse(null);
    }

    @GetMapping("/coach/{coachId}")
    public List<Mentorship> getMyClients(@PathVariable Long coachId) {
        return mentorshipRepository.findAllByCoachId(coachId);
    }

    @PostMapping("/assign")
    @Transactional
    public Mentorship assignCoach(@RequestParam Long clientId, @RequestParam Long coachId) {
        // Удаляем старую связь, если она была
        mentorshipRepository.deleteByClientId(clientId);

        Mentorship newRelation = Mentorship.builder()
                .clientId(clientId)
                .coachId(coachId)
                .status("ACTIVE")
                .build();

        return mentorshipRepository.save(newRelation);
    }

    @DeleteMapping("/client/{clientId}")
    @Transactional
    public void terminate(@PathVariable Long clientId) {
        mentorshipRepository.findByClientId(clientId).ifPresent(m -> {
            m.setStatus("Terminated");
            mentorshipRepository.save(m);
        });
    }
}