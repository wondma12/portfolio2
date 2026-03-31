export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const APP_NAME = 'Portfolio';
export const APP_DESCRIPTION = 'Personal portfolio website showcasing projects and skills';

export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    PROJECTS: '/projects',
    BLOG: '/blog',
    CONTACT: '/contact',
    RESUME: '/resume',
    ADMIN: '/admin',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin',
    ADMIN_PROJECTS: '/admin/projects',
    ADMIN_BLOG: '/admin/blog',
    ADMIN_MESSAGES: '/admin/messages',
    ADMIN_USERS: '/admin/users',
    ADMIN_PROFILE: '/admin/profile'
};

export const SOCIAL_LINKS = {
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    twitter: 'https://twitter.com/username',
    email: 'mailto:hello@johndoe.com'
};

export const SKILL_CATEGORIES = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Mobile',
    'Testing'
];