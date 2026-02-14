// ============================================
// USER TYPES
// ============================================

export interface User {
    user_id: number;
    username: string;
    email: string;
    full_name: string;
    avatar_url: string;
    preferred_language?: string;
    account_status: 'active' | 'suspended' | 'deleted';
    email_verified: boolean;
    created_at: string;
    last_login_at?: string;
    last_active_at?: string;
}

export interface UserProfile {
    profile_id: number;
    user_id: number;
    bio?: string;
    country?: string;
    occupation?: string;
    experience_level: 'beginner' | 'intermediate' | 'advanced';
    github_url?: string;
    linkedin_url?: string;
    website_url?: string;
    is_public: boolean;
}

// ============================================
// SQL DIALECT TYPES
// ============================================

export type SQLDialect = 'mysql' | 'postgresql' | 'sqlite' | 'oracle' | 'mssql' | 'mariadb';

export interface Dialect {
    dialect_id: number;
    dialect_name: SQLDialect;
    display_name: string;
    logo_url: string;
    description: string;
    documentation_url: string;
    is_active: boolean;
}

// ============================================
// LEARNING CONTENT TYPES
// ============================================

export interface LearningPath {
    path_id: number;
    path_name: string;
    display_title: string;
    description: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    estimated_hours: number;
    thumbnail_url: string;
    is_published: boolean;
    chapters: Chapter[];
}

export interface Chapter {
    chapter_id: number;
    path_id: number;
    chapter_number: number;
    chapter_title: string;
    description: string;
    estimated_minutes: number;
    is_published: boolean;
    lessons: Lesson[];
}

export interface Lesson {
    lesson_id: number;
    chapter_id: number;
    lesson_number: number;
    lesson_title: string;
    lesson_type: 'tutorial' | 'challenge' | 'quiz' | 'project' | 'documentation';
    description: string;
    estimated_minutes: number;
    xp_reward: number;
    coins_reward: number;
    is_published: boolean;
    content?: LessonContent;
}

export interface LessonContent {
    content_id: number;
    lesson_id: number;
    dialect_id?: number;
    content_type: 'markdown' | 'html' | 'video' | 'interactive';
    content_text: string;
    content_url?: string;
    code_examples: CodeExample[];
}

export interface CodeExample {
    example_id: number;
    lesson_id: number;
    dialect: SQLDialect;
    example_title: string;
    sql_code: string;
    explanation: string;
    expected_output?: string;
    animation_config?: any;
}

// ============================================
// CITY & GAME TYPES
// ============================================

export interface City {
    city_id: number;
    user_id: number;
    dialect_id: number;
    dialect: SQLDialect;
    city_name: string;
    city_description?: string;
    city_level: number;
    total_xp: number;
    total_coins: number;
    population: number;
    city_theme: 'vrindavan' | 'mathura' | 'ayodhya' | 'kashi' | 'modern';
    is_public: boolean;
    created_at: string;
    last_updated_at: string;
    buildings: CityBuilding[];
}

export interface BuildingType {
    building_type_id: number;
    building_name: string;
    display_name: string;
    description: string;
    category: 'residential' | 'religious' | 'commercial' | 'infrastructure' | 'special';
    unlock_level: number;
    base_cost_coins: number;
    base_population: number;
    animation_class?: string;
    icon_url: string;
    emoji: string;
}

export interface CityBuilding {
    building_id: number;
    city_id: number;
    building_type_id: number;
    building_type: BuildingType;
    position_x: number;
    position_y: number;
    building_level: number;
    capacity: number;
    current_occupancy: number;
    is_active: boolean;
    built_at: string;
    upgraded_at?: string;
}

// ============================================
// QUEST TYPES
// ============================================

export interface Quest {
    quest_id: number;
    quest_title: string;
    quest_description: string;
    quest_type: 'main' | 'side' | 'daily' | 'weekly' | 'special';
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    related_lesson_id?: number;
    objectives: QuestObjective[];
    xp_reward: number;
    coins_reward: number;
    special_reward?: string;
    is_published: boolean;
}

export interface QuestObjective {
    id: number;
    text: string;
    done: boolean;
}

export interface UserQuest {
    user_quest_id: number;
    user_id: number;
    quest_id: number;
    quest: Quest;
    dialect_id: number;
    status: 'available' | 'in_progress' | 'completed' | 'failed';
    progress_data?: any;
    started_at?: string;
    completed_at?: string;
    attempts: number;
}

// ============================================
// PROGRESS TYPES
// ============================================

export interface UserProgress {
    progress_id: number;
    user_id: number;
    lesson_id: number;
    dialect_id: number;
    status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
    completion_percentage: number;
    time_spent_seconds: number;
    attempts: number;
    best_score?: number;
    started_at?: string;
    completed_at?: string;
    last_activity_at: string;
}

// ============================================
// ACHIEVEMENT TYPES
// ============================================

export interface Achievement {
    achievement_id: number;
    achievement_name: string;
    display_title: string;
    description: string;
    icon_url: string;
    emoji: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xp_reward: number;
}

export interface UserAchievement {
    unlock_id: number;
    user_id: number;
    achievement_id: number;
    achievement: Achievement;
    unlocked_at: string;
}

// ============================================
// LEADERBOARD TYPES
// ============================================

export interface LeaderboardEntry {
    entry_id: number;
    rank_position: number;
    user: {
        user_id: number;
        username: string;
        avatar_url: string;
        level: number;
    };
    score: number;
    dialect?: SQLDialect;
}

// ============================================
// SOCIAL TYPES
// ============================================

export interface Comment {
    comment_id: number;
    user_id: number;
    user: User;
    target_type: 'city' | 'lesson' | 'documentation' | 'quest';
    target_id: number;
    comment_text: string;
    parent_comment_id?: number;
    like_count: number;
    is_edited: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    replies?: Comment[];
}

// ============================================
// DOCUMENTATION TYPES
// ============================================

export interface DocCategory {
    category_id: number;
    category_name: string;
    parent_category_id?: number;
    description: string;
    icon: string;
    topics?: DocTopic[];
}

export interface DocTopic {
    topic_id: number;
    category_id: number;
    dialect?: SQLDialect;
    topic_slug: string;
    topic_title: string;
    short_description: string;
    content: string;
    code_examples?: string;
    related_lessons?: number[];
    tags?: string[];
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
    notification_id: number;
    user_id: number;
    notification_type: 'achievement' | 'quest' | 'leaderboard' | 'social' | 'system' | 'payment';
    title: string;
    message: string;
    action_url?: string;
    icon?: string;
    is_read: boolean;
    is_archived: boolean;
    created_at: string;
    read_at?: string;
}
