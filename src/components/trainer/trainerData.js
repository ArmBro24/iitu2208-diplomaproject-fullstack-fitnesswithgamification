import {
    FiActivity,
    FiBell,
    FiTrendingUp,
    FiUsers
} from 'react-icons/fi';

export const trainer = {
    name: 'Name Surname',
    points: 288,
    traits: [
        { label: 'endurance', value: 89 },
        { label: 'consistency', value: 96 },
        { label: 'motivation', value: 103 },
    ],
};

export const kpiCards = [
    { title: 'Active Clients', value: '24', icon: FiUsers, accent: 'olive' },
    { title: 'Reviewed', value: '41', icon: FiActivity, accent: 'violet' },
    { title: 'Completion', value: '87%', icon: FiTrendingUp, accent: 'gold' },
    { title: 'Alerts', value: '5', icon: FiBell, accent: 'rose' },
];

export const alerts = [
    '2 clients missed the deadline for workout submission.',
    "Leaderboard refresh is due after today's evening session.",
    'Aruzhan K. requested feedback on video technique.',
];

export const initialAssignedWorkouts = [
    { id: 1, client: 'Aruzhan K.', workout: 'Lower Body Power', time: '13:00 - 14:00', status: 'present' },
    { id: 2, client: 'Dias N.', workout: 'Cardio Endurance', time: '15:00 - 16:00', status: 'missed' },
    { id: 3, client: 'Madi B.', workout: 'Mobility Recovery', time: '18:00 - 19:00', status: 'upcoming' },
];

export const initialClients = [
    {
        id: 1,
        name: 'Aruzhan K.',
        level: 'Lv. 12',
        attendance: '92%',
        progress: 84,
        status: 'Needs review',
        goal: 'Strength cut phase',
        streak: '9 days',
        nextWorkout: 'Lower Body Power',
        note: 'Waiting for squat form feedback and updated load recommendation.',
        progressRequestPending: false,
        lastProgressRequest: 'Apr 12, 2026',
        activity: [
            { title: 'Workout submitted', subtitle: 'Yesterday, 19:40' },
            { title: 'Coach note requested', subtitle: 'Yesterday, 20:10' },
            { title: 'Challenge progress updated', subtitle: '2 days ago' },
        ],
    },
    {
        id: 2,
        name: 'Dias N.',
        level: 'Lv. 10',
        attendance: '88%',
        progress: 68,
        status: 'On track',
        goal: 'Cardio endurance',
        streak: '5 days',
        nextWorkout: 'Cardio Endurance',
        note: 'Responds well to short interval sessions and recovery reminders.',
        progressRequestPending: false,
        lastProgressRequest: 'Apr 11, 2026',
        activity: [
            { title: 'Attendance confirmed', subtitle: 'Today, 09:10' },
            { title: 'Workout submitted', subtitle: 'Yesterday, 18:20' },
            { title: 'Cardio block reviewed', subtitle: '3 days ago' },
        ],
    },
    {
        id: 3,
        name: 'Madi B.',
        level: 'Lv. 8',
        attendance: '95%',
        progress: 91,
        status: 'Top performer',
        goal: 'Mobility and recovery',
        streak: '13 days',
        nextWorkout: 'Mobility Recovery',
        note: 'Ready for challenge boost and leaderboard push this week.',
        progressRequestPending: false,
        lastProgressRequest: 'Apr 10, 2026',
        activity: [
            { title: 'Challenge progress updated', subtitle: 'Today, 08:45' },
            { title: 'Leaderboard synced', subtitle: 'Yesterday, 21:00' },
            { title: 'Mobility session completed', subtitle: '2 days ago' },
        ],
    },
    {
        id: 4,
        name: 'Akerke T.',
        level: 'Lv. 6',
        attendance: '71%',
        progress: 44,
        status: 'At risk',
        goal: 'Consistency rebuild',
        streak: '2 days',
        nextWorkout: 'Core Stability',
        note: 'Needs a softer weekly plan and motivational follow-up.',
        progressRequestPending: true,
        lastProgressRequest: 'Apr 14, 2026',
        activity: [
            { title: 'Progress update requested', subtitle: 'Today, 10:15' },
            { title: 'Missed session flagged', subtitle: 'Yesterday, 17:30' },
            { title: 'Coach note sent', subtitle: '2 days ago' },
        ],
    },
];

export const leaderboardPreview = [
    { place: 1, name: 'Madi B.', points: 1540 },
    { place: 2, name: 'Aruzhan K.', points: 1490 },
    { place: 3, name: 'Dias N.', points: 1315 },
];

export const initialScheduleItems = [
    { id: 1, name: 'Workout Name', client: 'Aruzhan K.', time: '13:00 - 14:00', status: 'present' },
    { id: 2, name: 'Workout Name', client: 'Dias N.', time: '13:00 - 14:00', status: 'missed' },
    { id: 3, name: 'Workout Name', client: 'Madi B.', time: '13:00 - 14:00', status: 'upcoming' },
    { id: 4, name: 'Workout Name', client: 'Akerke T.', time: '13:00 - 14:00', status: 'late' },
    { id: 5, name: 'Workout Name', client: 'Sanzhar A.', time: '13:00 - 14:00', status: 'present' },
];

export const workoutTemplates = [
    {
        name: 'Lower Body Power',
        defaultPoints: 50,
        exercises: [
            { name: 'Barbell Squats', planned: 12 },
            { name: 'Leg Press', planned: 15 },
            { name: 'Lunges', planned: 20 }
        ]
    },
    {
        name: 'Cardio Endurance',
        defaultPoints: 40,
        exercises: [
            { name: 'Running (Intervals)', planned: 600 }, // в секундах
            { name: 'Jump Rope', planned: 120 }
        ]
    },
    {
        name: 'Mobility Recovery',
        defaultPoints: 30,
        exercises: [
            { name: 'Cat-Cow Stretch', planned: 10 },
            { name: 'Childs Pose', planned: 60 },
            { name: 'Hip Openers', planned: 15 }
        ]
    },
    {
        name: 'Core Stability',
        defaultPoints: 45,
        exercises: [
            { name: 'Plank', planned: 60 },
            { name: 'Russian Twists', planned: 30 },
            { name: 'Dead Bug', planned: 12 }
        ]
    },
    {
        name: 'Upper Body Strength',
        defaultPoints: 55,
        exercises: [
            { name: 'Bench Press', planned: 10 },
            { name: 'Pull-ups', planned: 8 },
            { name: 'Dumbbell Rows', planned: 12 }
        ]
    },
];

export const calendarDays = [
    null, 1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14,
];

export const highlightedDays = {
    3: 'text-[#c98bff]',
    10: 'text-[#c98bff]',
    12: 'text-[#ff926d]',
};

export const accentClasses = {
    olive: 'bg-[rgba(108,115,63,0.44)]',
    violet: 'bg-[rgba(84,64,112,0.42)]',
    gold: 'bg-[rgba(122,95,42,0.4)]',
    rose: 'bg-[rgba(120,71,91,0.42)]',
};

export const grainGradient = `
    radial-gradient(circle at 20% 10%, rgba(173, 93, 70, 0.65), transparent 26%),
    radial-gradient(circle at 72% 18%, rgba(58, 63, 73, 0.75), transparent 28%),
    radial-gradient(circle at 18% 60%, rgba(69, 42, 102, 0.55), transparent 35%),
    radial-gradient(circle at 74% 72%, rgba(138, 124, 55, 0.52), transparent 25%),
    linear-gradient(180deg, #111312 0%, #1c1d1b 34%, #232621 62%, #151616 100%)
`;

export const noiseStyle = {
    backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
    backgroundSize: '520px',
};

export const statusTextClass = (status) => {
    if (status === 'present') return 'text-[#d8b3ff]';
    if (status === 'missed') return 'text-[#ff8383]';
    if (status === 'late') return 'text-[#f0dd95]';
    if (status === 'upcoming') return 'text-[#e1cb6d]';
    return 'text-[#f0e7d8]';
};

export const avatarFrame = (index) => {
    const frames = [
        'bg-[radial-gradient(circle_at_30%_30%,#f19add,#704436)]',
        'bg-[radial-gradient(circle_at_30%_30%,#dba0c0,#5f5440)]',
        'bg-[radial-gradient(circle_at_30%_30%,#f5dfe3,#7a5f50)]',
        'bg-[radial-gradient(circle_at_30%_30%,#9fd8ff,#624846)]',
        'bg-[radial-gradient(circle_at_30%_30%,#8fd3ff,#56634f)]',
    ];

    return frames[index % frames.length];
};
