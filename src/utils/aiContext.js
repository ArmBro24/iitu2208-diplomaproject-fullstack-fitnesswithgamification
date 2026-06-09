const TRAINER_STORAGE_KEY = 'herofit-trainer-dashboard';
export const AI_PROFILE_STORAGE_PREFIX = 'herofit-ai-profile';
const LEGACY_AI_PROFILE_STORAGE_KEY = AI_PROFILE_STORAGE_PREFIX;
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
    goalUpdatedAt: profile.goalUpdatedAt,
    checkInUpdatedAt: profile.checkInUpdatedAt,
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

export const getAIProfileMemoryKey = (owner = {}) => {
    if (typeof window === 'undefined') return `${AI_PROFILE_STORAGE_PREFIX}:guest`;

    const id = owner?.id ?? owner?.userId ?? owner?.memberId ?? window.localStorage.getItem('userId') ?? 'guest';
    const role = owner?.role ?? window.localStorage.getItem('activeRole') ?? 'member';

    return `${AI_PROFILE_STORAGE_PREFIX}:${String(role).toLowerCase()}:${id}`;
};

export const loadAIProfileMemory = (owner) => {
    if (typeof window === 'undefined') return null;

    try {
        const raw = window.localStorage.getItem(getAIProfileMemoryKey(owner));
        if (raw) return JSON.parse(raw);

        const legacyRaw = window.localStorage.getItem(LEGACY_AI_PROFILE_STORAGE_KEY);
        if (!owner?.id && legacyRaw) return JSON.parse(legacyRaw);

        return null;
    } catch {
        return null;
    }
};

export const getSavedAIProfileMemories = () => {
    if (typeof window === 'undefined') return [];

    try {
        return Object.keys(window.localStorage)
            .filter((key) => key === LEGACY_AI_PROFILE_STORAGE_KEY || key.startsWith(`${AI_PROFILE_STORAGE_PREFIX}:`))
            .map((key) => [key, window.localStorage.getItem(key)])
            .filter(([, value]) => value);
    } catch {
        return [];
    }
};

export const saveAIProfileMemory = (profile = {}, owner) => {
    if (typeof window === 'undefined') return null;

    const current = loadAIProfileMemory(owner) ?? {};
    const now = new Date().toISOString();
    const hasWeight = profile.weight !== undefined && profile.weight !== '';
    const hasGoal = profile.fitnessGoal !== undefined && profile.fitnessGoal !== '';
    const nextProfile = removeEmptyValues({
        ...current,
        ...profile,
        ownerId: owner?.id ?? current.ownerId,
        ownerRole: owner?.role ?? current.ownerRole,
        setupCompletedAt: current.setupCompletedAt ?? now,
        lastUpdatedAt: now,
        weightUpdatedAt: hasWeight ? now : current.weightUpdatedAt,
        goalUpdatedAt: hasGoal ? now : current.goalUpdatedAt,
        checkInUpdatedAt: hasWeight || hasGoal ? now : current.checkInUpdatedAt,
    });

    window.localStorage.setItem(getAIProfileMemoryKey(owner), JSON.stringify(nextProfile));
    return nextProfile;
};

export const isAIProfileSetupComplete = (profile = loadAIProfileMemory()) =>
    Boolean(profile?.setupCompletedAt && hasSavedAIProfileData(profile));

export const isAIProfileRefreshDue = (profile = loadAIProfileMemory()) => {
    if (!isAIProfileSetupComplete(profile)) return false;

    const lastCheckIn = new Date(profile.checkInUpdatedAt ?? profile.weightUpdatedAt ?? profile.goalUpdatedAt);
    if (Number.isNaN(lastCheckIn.getTime())) return true;

    const diffDays = (Date.now() - lastCheckIn.getTime()) / (24 * 60 * 60 * 1000);
    return diffDays >= PROFILE_REFRESH_DAYS;
};

export const migrateLegacyAIProfileMemory = (owner) => {
    if (typeof window === 'undefined' || !owner?.id) return null;

    const key = getAIProfileMemoryKey(owner);

    try {
        if (window.localStorage.getItem(key)) return loadAIProfileMemory(owner);

        const legacyRaw = window.localStorage.getItem(LEGACY_AI_PROFILE_STORAGE_KEY);
        if (!legacyRaw) return null;

        const legacyProfile = JSON.parse(legacyRaw);
        window.localStorage.setItem(key, JSON.stringify({
            ...legacyProfile,
            ownerId: owner.id,
            ownerRole: owner.role,
        }));

        return loadAIProfileMemory(owner);
    } catch {
        return null;
    }
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

    const rememberedProfile = aiProfileMemory ?? loadAIProfileMemory(selectedClient ?? currentUser);
    const profileSource = selectedClient
        ? {
            ...selectedClient,
            ...(rememberedProfile ?? {}),
        }
        : {
            ...(currentUser ?? {}),
            ...(rememberedProfile ?? {}),
        };

    return {
        userProfile: compactProfile(profileSource),
        currentAppUser: selectedClient
            ? compactProfile(currentUser ?? {})
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
