import type { LeaderboardEntry } from '../models/types';
import { mockUsers } from './mockUsers';

// Generate 1000+ leaderboard entries
export const mockLeaderboard: LeaderboardEntry[] = mockUsers.map((user, index) => {
    const level = Math.max(1, 42 - Math.floor(index / 2));
    const score = 125340 - (index * 1000) - Math.floor(Math.random() * 500);

    return {
        entry_id: index + 1,
        rank_position: index + 1,
        user: {
            user_id: user.user_id,
            username: user.username,
            avatar_url: user.avatar_url,
            level,
        },
        score,
        dialect: (['mysql', 'postgresql', 'sqlite'] as const)[index % 3],
    };
});

// Add more entries to reach 1000+
const additionalEntries: LeaderboardEntry[] = Array.from({ length: 950 }, (_, i) => {
    const index = i + 50;
    return {
        entry_id: index + 1,
        rank_position: index + 1,
        user: {
            user_id: (i % 50) + 1,
            username: `player${index + 1}`,
            avatar_url: `/avatars/user${(i % 10) + 1}.png`,
            level: Math.max(1, Math.floor(Math.random() * 30)),
        },
        score: Math.max(100, 50000 - (index * 50) - Math.floor(Math.random() * 100)),
        dialect: (['mysql', 'postgresql', 'sqlite'] as const)[i % 3],
    };
});

export const fullLeaderboard = [...mockLeaderboard, ...additionalEntries];

export const getLeaderboardByDialect = (dialect: 'mysql' | 'postgresql' | 'sqlite'): LeaderboardEntry[] => {
    return fullLeaderboard.filter(entry => entry.dialect === dialect);
};

export const getUserRank = (userId: number): number | undefined => {
    const entry = fullLeaderboard.find(e => e.user.user_id === userId);
    return entry?.rank_position;
};

export const getTopPlayers = (limit: number = 10): LeaderboardEntry[] => {
    return fullLeaderboard.slice(0, limit);
};
