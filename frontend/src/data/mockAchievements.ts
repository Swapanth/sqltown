import type { Achievement, UserAchievement } from '../models/types';

export const mockAchievements: Achievement[] = [
    {
        achievement_id: 1,
        achievement_name: 'city_founder',
        display_title: 'City Founder',
        description: 'Built your first sacred city',
        icon_url: '/achievements/city-founder.svg',
        emoji: '🏆',
        rarity: 'common',
        xp_reward: 100,
    },
    {
        achievement_id: 2,
        achievement_name: 'first_query',
        display_title: 'First Query',
        description: 'Executed your first SELECT query',
        icon_url: '/achievements/first-query.svg',
        emoji: '🎯',
        rarity: 'common',
        xp_reward: 50,
    },
    {
        achievement_id: 3,
        achievement_name: 'speed_runner',
        display_title: 'Speed Runner',
        description: 'Completed 10 lessons in one day',
        icon_url: '/achievements/speed-runner.svg',
        emoji: '⚡',
        rarity: 'rare',
        xp_reward: 300,
    },
    {
        achievement_id: 4,
        achievement_name: 'temple_builder',
        display_title: 'Temple Builder',
        description: 'Created your first database view',
        icon_url: '/achievements/temple-builder.svg',
        emoji: '🕌',
        rarity: 'common',
        xp_reward: 150,
    },
    {
        achievement_id: 5,
        achievement_name: 'ashram_master',
        display_title: 'Ashram Master',
        description: 'Mastered stored procedures',
        icon_url: '/achievements/ashram-master.svg',
        emoji: '🏛️',
        rarity: 'epic',
        xp_reward: 500,
    },
    {
        achievement_id: 6,
        achievement_name: 'sql_scholar',
        display_title: 'SQL Scholar',
        description: 'Completed 50 lessons',
        icon_url: '/achievements/sql-scholar.svg',
        emoji: '🎓',
        rarity: 'rare',
        xp_reward: 400,
    },
    {
        achievement_id: 7,
        achievement_name: 'join_master',
        display_title: 'JOIN Master',
        description: 'Mastered all types of JOINs',
        icon_url: '/achievements/join-master.svg',
        emoji: '🔗',
        rarity: 'rare',
        xp_reward: 350,
    },
    {
        achievement_id: 8,
        achievement_name: 'perfect_score',
        display_title: 'Perfect Score',
        description: 'Achieved 100% on 10 challenges',
        icon_url: '/achievements/perfect-score.svg',
        emoji: '💯',
        rarity: 'epic',
        xp_reward: 600,
    },
    {
        achievement_id: 9,
        achievement_name: 'city_level_10',
        display_title: 'City Level 10',
        description: 'Reached city level 10',
        icon_url: '/achievements/city-level-10.svg',
        emoji: '🌟',
        rarity: 'rare',
        xp_reward: 500,
    },
    {
        achievement_id: 10,
        achievement_name: 'legendary_builder',
        display_title: 'Legendary Builder',
        description: 'Built all types of buildings',
        icon_url: '/achievements/legendary-builder.svg',
        emoji: '👑',
        rarity: 'legendary',
        xp_reward: 1000,
    },
    // Generate 20 more achievements
    ...Array.from({ length: 20 }, (_, i) => ({
        achievement_id: i + 11,
        achievement_name: `achievement_${i + 11}`,
        display_title: `Achievement ${i + 11}`,
        description: `Unlock special milestone ${i + 11}`,
        icon_url: `/achievements/achievement-${i + 11}.svg`,
        emoji: ['🎖️', '🏅', '🥇', '🥈', '🥉'][i % 5],
        rarity: (['common', 'rare', 'epic', 'legendary'] as const)[i % 4],
        xp_reward: 100 + (i % 5) * 100,
    })),
];

export const mockUserAchievements: UserAchievement[] = [
    {
        unlock_id: 1,
        user_id: 1,
        achievement_id: 1,
        achievement: mockAchievements[0],
        unlocked_at: '2026-01-15T12:00:00Z',
    },
    {
        unlock_id: 2,
        user_id: 1,
        achievement_id: 2,
        achievement: mockAchievements[1],
        unlocked_at: '2026-01-15T14:00:00Z',
    },
    {
        unlock_id: 3,
        user_id: 1,
        achievement_id: 3,
        achievement: mockAchievements[2],
        unlocked_at: '2026-02-10T18:00:00Z',
    },
    {
        unlock_id: 4,
        user_id: 1,
        achievement_id: 4,
        achievement: mockAchievements[3],
        unlocked_at: '2026-02-12T10:00:00Z',
    },
    {
        unlock_id: 5,
        user_id: 1,
        achievement_id: 6,
        achievement: mockAchievements[5],
        unlocked_at: '2026-02-14T15:00:00Z',
    },
];

export const getAchievementById = (achievementId: number): Achievement | undefined => {
    return mockAchievements.find(a => a.achievement_id === achievementId);
};

export const getUserAchievements = (userId: number): UserAchievement[] => {
    return mockUserAchievements.filter(ua => ua.user_id === userId);
};
