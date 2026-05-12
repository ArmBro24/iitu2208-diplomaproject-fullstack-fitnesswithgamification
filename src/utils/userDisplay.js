export const getUserDisplayName = (user) => {
    const firstName = normalizeText(user?.firstName);
    const lastName = normalizeText(user?.lastName);
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    if (fullName) return fullName;
    if (normalizeText(user?.name)) return normalizeText(user.name);
    if (normalizeText(user?.email)) return user.email.split('@')[0];
    if (user?.id) return `User #${user.id}`;

    return 'Profile';
};

export const getUserNickname = (user) => {
    const nickname = normalizeText(user?.nickname);
    if (nickname) return nickname.startsWith('@') ? nickname : `@${nickname}`;

    return 'Nickname not set';
};

export const getUserInitials = (user) => {
    const displayName = getUserDisplayName(user);
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    return initials || 'HF';
};

const normalizeText = (value) => {
    if (typeof value !== 'string') return '';
    return value.trim();
};
