package com.example.diploma.service;


import com.example.diploma.model.SessionLog;
import com.example.diploma.model.TrainingSession;
import com.example.diploma.model.enums.TrainingSessionStatus;
import com.example.diploma.model.Exercise;

import java.util.List;

public interface TrainingSessionService {
    TrainingSession createSession(TrainingSession session);

    SessionLog submitLog(SessionLog log, List<Exercise> submittedExercises);

    SessionLog approveLog(Long logId, Integer points, String coachComment);

    SessionLog rejectLog(Long logId, String coachComment);

    List<TrainingSession> getSessionsByMemberId(Long memberId);

    TrainingSession updateSessionStatus(Long sessionId, TrainingSessionStatus status);

    void updateMissedSessions();

    TrainingSession findById(Long sessionId);
}