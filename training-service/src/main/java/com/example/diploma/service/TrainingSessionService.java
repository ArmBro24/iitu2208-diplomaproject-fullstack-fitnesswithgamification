package com.example.diploma.service;

import com.example.diploma.model.SessionLog;
import com.example.diploma.model.TrainingSession;
import com.example.diploma.model.enums.TrainingSessionStatus;

import java.util.List;

public interface TrainingSessionService {
    TrainingSession createSession(TrainingSession session);

    SessionLog submitLog(SessionLog log);

    SessionLog approveLog(Long logId, Integer points, String coachComment);

    List<TrainingSession> getSessionsByMemberId(Long memberId);

    TrainingSession updateSessionStatus(Long sessionId, TrainingSessionStatus status);
}