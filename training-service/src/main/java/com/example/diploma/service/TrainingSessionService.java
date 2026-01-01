package com.example.diploma.service;

import com.example.diploma.model.SessionLog;
import com.example.diploma.model.TrainingSession;

public interface TrainingSessionService {
    TrainingSession createSession(TrainingSession session);

    SessionLog submitLog(SessionLog log);

    SessionLog approveLog(Long logId, Integer points, String coachComment);
}
