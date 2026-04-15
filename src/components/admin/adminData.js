export const adminStats = [
    { label: 'Active clients', value: '248', tone: 'rose' },
    { label: 'Trainers', value: '18', tone: 'violet' },
    { label: 'Plans sold', value: '124', tone: 'gold' },
    { label: 'Open tickets', value: '9', tone: 'olive' },
];

export const adminMenuItems = [
    { id: 'users', label: 'Users' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'support', label: 'Support' },
];

export const adminUsers = [
    { id: 1, name: 'Aruzhan K.', role: 'Client', status: 'Active', note: 'Last login today' },
    { id: 2, name: 'Dias N.', role: 'Client', status: 'Pending review', note: 'Attendance issue flagged' },
    { id: 3, name: 'Aigerim S.', role: 'Trainer', status: 'Active', note: '12 clients assigned' },
    { id: 4, name: 'Madi B.', role: 'Client', status: 'Top performer', note: 'Subscription renewed' },
];

export const adminSubscriptions = [
    { id: 1, title: 'Start Pass', price: '15 000 KZT', visits: '8 visits', validity: '1 month', tone: 'rose' },
    { id: 2, title: 'Hero Pass', price: '28 000 KZT', visits: '16 visits', validity: '1 month', tone: 'gold' },
    { id: 3, title: 'Pro Pass', price: '48 000 KZT', visits: 'Unlimited', validity: '1 month', tone: 'violet' },
    { id: 4, title: 'Recovery Pack', price: '18 000 KZT', visits: '8 visits', validity: '1 month', tone: 'olive' },
];

export const adminSupportContacts = [
    { id: 1, phone: '+7 (777) 777 77 77', note: 'General support line' },
    { id: 2, phone: '+7 (701) 550 12 88', note: 'Subscription issues' },
    { id: 3, phone: '+7 (705) 222 44 11', note: 'Trainer support' },
    { id: 4, phone: '+7 (747) 808 90 90', note: 'Emergency admin contact' },
];

export const adminCalendarDays = [
    1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28,
];

export const adminHighlightDays = {
    10: 'text-[#c98bff]',
    17: 'text-[#ff9f7a]',
    21: 'bg-white/35 text-white rounded-full',
};

export const adminToneClass = {
    rose: 'bg-[rgba(121,76,89,0.34)]',
    violet: 'bg-[rgba(84,64,112,0.34)]',
    gold: 'bg-[rgba(122,95,42,0.3)]',
    olive: 'bg-[rgba(79,102,69,0.28)]',
};
