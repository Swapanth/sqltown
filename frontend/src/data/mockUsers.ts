import type { User, UserProfile } from '../models/types';

// Current logged-in user
export const currentUser: User = {
    user_id: 1,
    username: "swapanth",
    email: "swapanth@sqltown.dev",
    full_name: "Swapanth Mukesh",
    avatar_url: "/avatars/user1.png",
    preferred_language: "en",
    account_status: "active",
    email_verified: true,
    created_at: "2026-01-15T10:00:00Z",
    last_login_at: "2026-02-14T12:00:00Z",
    last_active_at: "2026-02-14T17:30:00Z",
};

export const currentUserProfile: UserProfile = {
    profile_id: 1,
    user_id: 1,
    bio: "Learning SQL through city building! 🏙️",
    country: "India",
    occupation: "Software Developer",
    experience_level: "intermediate",
    github_url: "https://github.com/swapanth",
    linkedin_url: "https://linkedin.com/in/swapanth",
    is_public: true,
};

// Mock users for leaderboard and social features
export const mockUsers: User[] = [
    currentUser,
    {
        user_id: 2,
        username: "bhardwaj",
        email: "bhardwaj@sqltown.dev",
        full_name: "Arjun Bhardwaj",
        avatar_url: "/avatars/user2.png",
        account_status: "active",
        email_verified: true,
        created_at: "2025-12-01T10:00:00Z",
        last_active_at: "2026-02-14T16:00:00Z",
    },
    {
        user_id: 3,
        username: "priya_sql",
        email: "priya@sqltown.dev",
        full_name: "Priya Sharma",
        avatar_url: "/avatars/user3.png",
        account_status: "active",
        email_verified: true,
        created_at: "2025-11-15T10:00:00Z",
        last_active_at: "2026-02-14T15:30:00Z",
    },
    {
        user_id: 4,
        username: "codeguru",
        email: "guru@sqltown.dev",
        full_name: "Rajesh Kumar",
        avatar_url: "/avatars/user4.png",
        account_status: "active",
        email_verified: true,
        created_at: "2025-10-20T10:00:00Z",
        last_active_at: "2026-02-14T14:00:00Z",
    },
    {
        user_id: 5,
        username: "ramdev",
        email: "ram@sqltown.dev",
        full_name: "Ram Dev",
        avatar_url: "/avatars/user5.png",
        account_status: "active",
        email_verified: true,
        created_at: "2025-12-10T10:00:00Z",
        last_active_at: "2026-02-14T13:00:00Z",
    },
    {
        user_id: 6,
        username: "dataqueen",
        email: "queen@sqltown.dev",
        full_name: "Ananya Patel",
        avatar_url: "/avatars/user6.png",
        account_status: "active",
        email_verified: true,
        created_at: "2026-01-05T10:00:00Z",
        last_active_at: "2026-02-14T12:30:00Z",
    },
    // Add 44 more users
    ...Array.from({ length: 44 }, (_, i) => ({
        user_id: i + 7,
        username: `user${i + 7}`,
        email: `user${i + 7}@sqltown.dev`,
        full_name: `User ${i + 7}`,
        avatar_url: `/avatars/user${(i % 10) + 1}.png`,
        account_status: "active" as const,
        email_verified: true,
        created_at: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        last_active_at: new Date(2026, 1, Math.floor(Math.random() * 14) + 1).toISOString(),
    })),
];

export const getUserById = (userId: number): User | undefined => {
    return mockUsers.find(u => u.user_id === userId);
};

export const getUserByUsername = (username: string): User | undefined => {
    return mockUsers.find(u => u.username === username);
};
