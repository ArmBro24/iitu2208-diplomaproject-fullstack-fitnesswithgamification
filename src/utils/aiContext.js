const TRAINER_STORAGE_KEY = 'herofit-trainer-dashboard';
const AI_PROFILE_STORAGE_KEY = 'herofit-ai-profile';
const PROFILE_REFRESH_DAYS = 14;

const readStoredTrainerState = () => {
    if (typeof window === 'undefined') return {};

    try {
        const raw = window.localStorage.getItem(TRAINER_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const calculateAge = (birthDate) => {
    if (!birthDate) return undefined;

    const date = new Date(birthDate);
    if (Number.isNaN(date.getTime())) return undefined;

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age -= 1;
    }

    return age >= 0 ? age : undefined;
};

const compactProfile = (profile = {}) => ({
    id: profile.id,
    role: profile.role,
    name: profile.name ?? profile.nickname ?? profile.email,
    age: profile.age ?? calculateAge(profile.birthDate),
    gender: profile.gender,
    birthDate: profile.birthDate,
    height: profile.height ?? profile.heightCm,
    weight: profile.weight ?? profile.weightKg,
    fitnessGoal: profile.fitnessGoal ?? profile.goal,
    trainingLevel: profile.trainingLevel ?? profile.level,
    limitations: profile.limitations ?? profile.injuries ?? profile.note,
    attendance: profile.attendance,
    progress: profile.progress,
    status: profile.status,
    streak: profile.streak,
    nextWorkout: profile.nextWorkout,
    lastUpdatedAt: profile.lastUpdatedAt,
    weightUpdatedAt: profile.weightUpdatedAt,
});

const removeEmptyValues = (value = {}) =>
    Object.fromEntries(
        Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== '')
    );

const hasSavedAIProfileData = (profile = {}) =>
    ['height', 'weight', 'fitnessGoal', 'trainingLevel', 'limitations'].some((field) => {
        const value = profile?.[field];
        return value !== undefined && value !== null && String(value).trim() !== '';
    });

export const loadAIProfileMemory = () => {
    if (typeof window === 'undefined') return null;

    try {
        const raw = window.localStorage.getItem(AI_PROFILE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const saveAIProfileMemory = (profile = {}) => {
    if (typeof window === 'undefined') return null;

    const current = loadAIProfileMemory() ?? {};
    const now = new Date().toISOString();
    const nextProfile = removeEmptyValues({
        ...current,
        ...profile,
        setupCompletedAt: current.setupCompletedAt ?? now,
        lastUpdatedAt: now,
        weightUpdatedAt: profile.weight !== undefined && profile.weight !== ''
            ? now
            : current.weightUpdatedAt,
    });

    window.localStorage.setItem(AI_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    return nextProfile;
};

export const isAIProfileSetupComplete = (profile = loadAIProfileMemory()) =>
    Boolean(profile?.setupCompletedAt && hasSavedAIProfileData(profile));

export const isAIProfileRefreshDue = (profile = loadAIProfileMemory()) => {
    if (!isAIProfileSetupComplete(profile) || !profile?.weightUpdatedAt) return false;

    const lastWeightUpdate = new Date(profile.weightUpdatedAt);
    if (Number.isNaN(lastWeightUpdate.getTime())) return true;

    const diffDays = (Date.now() - lastWeightUpdate.getTime()) / (24 * 60 * 60 * 1000);
    return diffDays >= PROFILE_REFRESH_DAYS;
};

const compactSession = (session = {}) => ({
    id: session.id,
    title: session.title ?? session.name ?? session.workout,
    status: session.status,
    startsAt: session.startsAt ?? session.date,
    endsAt: session.endsAt,
    time: session.time,
    points: session.points,
});

const compactChallenge = (challenge = {}) => ({
    title: challenge.title,
    status: challenge.status,
    points: challenge.points,
    description: challenge.desc,
});

export const collectHeroFitAIContext = ({
    currentUser,
    userStats,
    challenges,
    sessions,
    selectedClient,
    assignedWorkouts,
    scheduleItems,
    aiProfileMemory,
} = {}) => {
    const storedTrainerState = readStoredTrainerState();
    const workoutHistory = [
        ...(Array.isArray(sessions) ? sessions : []),
        ...(Array.isArray(assignedWorkouts) ? assignedWorkouts : []),
        ...(Array.isArray(scheduleItems) ? scheduleItems : []),
        ...(Array.isArray(storedTrainerState.assignedWorkouts) ? storedTrainerState.assignedWorkouts : []),
        ...(Array.isArray(storedTrainerState.scheduleItems) ? storedTrainerState.scheduleItems : []),
    ];

    const rememberedProfile = aiProfileMemory ?? loadAIProfileMemory();
    const profileSource = selectedClient
        ? selectedClient
        : {
            ...(currentUser ?? {}),
            ...(rememberedProfile ?? {}),
        };

    return {
        userProfile: compactProfile(profileSource),
        currentAppUser: selectedClient
            ? compactProfile({
                ...(currentUser ?? {}),
                ...(rememberedProfile ?? {}),
            })
            : undefined,
        profileMemory: rememberedProfile ? compactProfile(rememberedProfile) : undefined,
        recentWorkoutHistory: {
            sessions: workoutHistory.slice(-12).map(compactSession),
        },
        gamification: {
            level: userStats?.level ?? selectedClient?.level,
            xp: userStats?.xp ?? userStats?.points,
            points: userStats?.points,
            endurance: userStats?.endurance,
            consistency: userStats?.consistency,
            motivation: userStats?.motivation,
            challenges: Array.isArray(challenges) ? challenges.slice(0, 6).map(compactChallenge) : [],
        },
    };
};
