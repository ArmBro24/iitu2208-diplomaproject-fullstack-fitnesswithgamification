package com.example.diploma.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/training/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @GetMapping("/coach/{coachId}")
    public List<Map<String, Object>> getCoachReviews(@PathVariable Long coachId) {
        return List.of();
    }
}