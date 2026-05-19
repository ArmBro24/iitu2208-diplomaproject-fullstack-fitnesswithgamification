import express from 'express';
import { askAI, generateWorkout } from '../services/openaiService.js';

const router = express.Router();
const CHAT_HISTORY_LIMIT = 6;
const RECENT_SESSION_LIMIT = 12;

const toText = (value, maxLength = 220) => {
    if (typeof value === 'string') return value.trim().slice(0, maxLength);
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    return undefined;
};

const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
};

const normalizeStatus = (status) => String(status ?? '').trim().toUpperCase();

const isCompletedStatus = (status) =>
    ['COMPLETED', 'CONFIRMED', 'ATTENDED', 'PRESENT', 'DONE'].includes(normalizeStatus(status));

const isMissedStatus = (status) =>
    ['MISSED', 'ABSENT', 'SKIPPED'].includes(normalizeStatus(status));

const getSessionDate = (session) => {
    const rawDate = session?.startsAt ?? session?.date ?? session?.createdAt;
    const date = rawDate ? new Date(rawDate) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
};

const isWithinLastDays = (date, days) => {
    if (!date) return false;
    const now = Date.now();
    const diff = now - date.getTime();
    return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
};

const normalizeSession = (session = {}) => ({
    title: toText(session.title ?? session.name ?? session.workout, 120),
    status: toText(session.status, 40),
    startsAt: toText(session.startsAt ?? session.date, 80),
    time: toText(session.time, 80),
    points: toNumber(session.points?.total ?? session.points),
});

const normalizeChallenge = (challenge = {}) => ({
    title: toText(challenge.title, 120),
    status: toText(challenge.status, 40),
    points: toNumber(challenge.points),
    description: toText(challenge.description ?? challenge.desc, 180),
});

const normalizeProfile = (profile = {}) => ({
    id: toText(profile.id, 60),
    role: toText(profile.role, 40),
    name: toText(profile.name ?? profile.nickname, 120),
    age: toNumber(profile.age),
    gender: toText(profile.gender, 40),
    height: toNumber(profile.height ?? profile.heightCm),
    weight: toNumber(profile.weight ?? profile.weightKg),
    fitnessGoal: toText(profile.fitnessGoal ?? profile.goal, 160),
    trainingLevel: toText(profile.trainingLevel ?? profile.level, 80),
    limitations: toText(profile.limitations ?? profile.injuries ?? profile.note, 240),
    attendance: toText(profile.attendance, 40),
    progress: toNumber(profile.progress),
    status: toText(profile.status, 80),
    streak: toText(profile.streak, 80),
    nextWorkout: toText(profile.nextWorkout, 120),
});

const calculateMetrics = (profile, sessions) => {
    const heightCm = toNumber(profile.height);
    const weightKg = toNumber(profile.weight);
    const heightM = heightCm && heightCm > 3 ? heightCm / 100 : heightCm;
    const bmi = heightM && weightKg ? Number((weightKg / (heightM * heightM)).toFixed(1)) : undefined;

    const last7Days = sessions.filter((session) => isWithinLastDays(getSessionDate(session), 7));
    const completedLast7Days = last7Days.filter((session) => isCompletedStatus(session.status)).length;
    const missedLast7Days = last7Days.filter((session) => isMissedStatus(session.status)).length;
    const completedTotal = sessions.filter((session) => isCompletedStatus(session.status)).length;
    const missedTotal = sessions.filter((session) => isMissedStatus(session.status)).length;
    const decidedTotal = completedTotal + missedTotal;
    const consistencyRate = decidedTotal
        ? Number(((completedTotal / decidedTotal) * 100).toFixed(1))
        : undefined;

    return {
        bmi,
        completedWorkoutsLast7Days: completedLast7Days,
        missedWorkoutsLast7Days: missedLast7Days,
        completedSessionsCount: completedTotal,
        missedSessionsCount: missedTotal,
        consistencyRate,
    };
};

const normalizeUserContext = (userContext) => {
    if (!userContext || typeof userContext !== 'object' || Array.isArray(userContext)) {
        return undefined;
    }

    const userProfile = normalizeProfile(userContext.userProfile ?? {});
    const sessions = Array.isArray(userContext.recentWorkoutHistory?.sessions)
        ? userContext.recentWorkoutHistory.sessions.slice(-RECENT_SESSION_LIMIT).map(normalizeSession)
        : [];
    const gamification = userContext.gamification && typeof userContext.gamification === 'object'
        ? {
            level: toNumber(userContext.gamification.level) ?? toText(userContext.gamification.level, 40),
            xp: toNumber(userContext.gamification.xp),
            points: toNumber(userContext.gamification.points),
            endurance: toNumber(userContext.gamification.endurance),
            consistency: toNumber(userContext.gamification.consistency),
            motivation: toNumber(userContext.gamification.motivation),
            challenges: Array.isArray(userContext.gamification.challenges)
                ? userContext.gamification.challenges.slice(0, 6).map(normalizeChallenge)
                : [],
        }
        : undefined;

    return {
        userProfile,
        currentAppUser: normalizeProfile(userContext.currentAppUser ?? {}),
        profileMemory: normalizeProfile(userContext.profileMemory ?? {}),
        recentWorkoutHistory: {
            sessions,
        },
        gamification,
        derivedMetrics: calculateMetrics(userProfile, sessions),
    };
};

router.post('/chat', async (req, res) => {
    try {
        const { message, messages, userContext } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required.' });
        }

        const history = Array.isArray(messages) ? messages.slice(-CHAT_HISTORY_LIMIT) : [];
        const normalizedUserContext = normalizeUserContext(userContext);
        const reply = await askAI([
            ...history,
            { role: 'user', content: message },
        ], normalizedUserContext);

        return res.json({ reply });
    } catch (error) {
        console.error('AI chat error:', error);
        return res.status(500).json({ error: 'AI chat failed.' });
    }
});

router.post('/recommend', async (req, res) => {
    try {
        const { level, goal, lastSessions } = req.body;
        const plan = await generateWorkout({ level, goal, lastSessions });

        return res.json({ plan });
    } catch (error) {
        console.error('AI recommendation error:', error);
        return res.status(500).json({ error: 'AI workout recommendation failed.' });
    }
});

export default router;
