import type { Quest, UserQuest } from '../models/types';

export const mockQuests: Quest[] = [
    {
        quest_id: 1,
        quest_title: 'The Foundation',
        quest_description: 'Build your first dharamshala table and welcome pilgrims to your city',
        quest_type: 'main',
        difficulty: 'easy',
        related_lesson_id: 6,
        objectives: [
            { id: 1, text: 'Complete Lesson: CREATE TABLE Basics', done: true },
            { id: 2, text: 'Create a table with at least 3 columns', done: true },
            { id: 3, text: 'Insert 5 rows of data', done: false },
        ],
        xp_reward: 500,
        coins_reward: 200,
        special_reward: '🏆 City Founder Achievement',
        is_published: true,
    },
    {
        quest_id: 2,
        quest_title: 'The Temple of Views',
        quest_description: 'Master the art of database views by building your first temple',
        quest_type: 'main',
        difficulty: 'medium',
        objectives: [
            { id: 1, text: 'Reach City Level 3', done: true },
            { id: 2, text: 'Complete Chapter: JOINs and Relationships', done: false },
            { id: 3, text: 'Create your first VIEW', done: false },
        ],
        xp_reward: 800,
        coins_reward: 350,
        special_reward: '🕌 Temple Builder Badge',
        is_published: true,
    },
    {
        quest_id: 3,
        quest_title: 'Daily Practice: SELECT Mastery',
        quest_description: 'Complete 3 SELECT query lessons today',
        quest_type: 'daily',
        difficulty: 'easy',
        objectives: [
            { id: 1, text: 'Complete any 3 lessons', done: true },
            { id: 2, text: 'Execute 10 SELECT queries', done: true },
            { id: 3, text: 'Achieve 100% accuracy', done: true },
        ],
        xp_reward: 200,
        coins_reward: 100,
        is_published: true,
    },
    {
        quest_id: 4,
        quest_title: 'Weekly Challenge: City Expansion',
        quest_description: 'Expand your city with new buildings this week',
        quest_type: 'weekly',
        difficulty: 'medium',
        objectives: [
            { id: 1, text: 'Build 5 new structures', done: true },
            { id: 2, text: 'Upgrade 2 existing buildings', done: false },
            { id: 3, text: 'Reach 500 population', done: false },
        ],
        xp_reward: 1000,
        coins_reward: 500,
        special_reward: '🏗️ Master Builder Badge',
        is_published: true,
    },
    {
        quest_id: 5,
        quest_title: 'The Sacred Ashram',
        quest_description: 'Learn stored procedures and build an ashram',
        quest_type: 'main',
        difficulty: 'hard',
        related_lesson_id: 37,
        objectives: [
            { id: 1, text: 'Reach City Level 5', done: true },
            { id: 2, text: 'Complete Stored Procedures chapter', done: false },
            { id: 3, text: 'Create 3 stored procedures', done: false },
            { id: 4, text: 'Build an Ashram', done: false },
        ],
        xp_reward: 1500,
        coins_reward: 700,
        special_reward: '🏛️ Ashram Master Achievement',
        is_published: true,
    },
    // Generate 45 more quests
    ...Array.from({ length: 45 }, (_, i) => ({
        quest_id: i + 6,
        quest_title: `Quest ${i + 6}`,
        quest_description: `Complete various SQL challenges`,
        quest_type: (['main', 'side', 'daily', 'weekly'] as const)[i % 4],
        difficulty: (['easy', 'medium', 'hard'] as const)[i % 3],
        objectives: [
            { id: 1, text: `Objective 1`, done: Math.random() > 0.5 },
            { id: 2, text: `Objective 2`, done: Math.random() > 0.7 },
        ],
        xp_reward: 100 + (i % 10) * 100,
        coins_reward: 50 + (i % 10) * 50,
        is_published: true,
    })),
];

export const mockUserQuests: UserQuest[] = [
    {
        user_quest_id: 1,
        user_id: 1,
        quest_id: 1,
        quest: mockQuests[0],
        dialect_id: 1,
        status: 'in_progress',
        started_at: '2026-02-10T10:00:00Z',
        attempts: 2,
    },
    {
        user_quest_id: 2,
        user_id: 1,
        quest_id: 3,
        quest: mockQuests[2],
        dialect_id: 1,
        status: 'completed',
        started_at: '2026-02-14T08:00:00Z',
        completed_at: '2026-02-14T16:00:00Z',
        attempts: 1,
    },
    {
        user_quest_id: 3,
        user_id: 1,
        quest_id: 4,
        quest: mockQuests[3],
        dialect_id: 1,
        status: 'in_progress',
        started_at: '2026-02-10T10:00:00Z',
        attempts: 1,
    },
];

export const getQuestById = (questId: number): Quest | undefined => {
    return mockQuests.find(q => q.quest_id === questId);
};

export const getQuestsByType = (type: Quest['quest_type']): Quest[] => {
    return mockQuests.filter(q => q.quest_type === type);
};

export const getUserActiveQuests = (userId: number): UserQuest[] => {
    return mockUserQuests.filter(uq => uq.user_id === userId && uq.status === 'in_progress');
};
