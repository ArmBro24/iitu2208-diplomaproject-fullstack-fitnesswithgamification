import avatarMe from '../../assets/avatars/avatar-me.png';

export const getClientAvatar = (client) => client?.avatarUrl || avatarMe;
