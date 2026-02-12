-- ============================================
-- SQLTOWN DATABASE SCHEMA
-- Scalable for 100K users, 10K parallel users
-- Multi-SQL dialect support (MySQL, PostgreSQL, SQLite, Oracle, MS SQL)
-- ============================================

-- ============================================
-- 1. USER MANAGEMENT
-- ============================================

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(500),
    preferred_language VARCHAR(10) DEFAULT 'en', -- en, hi, te, ta, etc.
    timezone VARCHAR(50) DEFAULT 'UTC',
    account_status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    last_active_at TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
);

CREATE TABLE user_profiles (
    profile_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    bio TEXT,
    country VARCHAR(100),
    occupation VARCHAR(100),
    experience_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    website_url VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE user_sessions (
    session_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- ============================================
-- 2. SQL DIALECTS & VERSIONS
-- ============================================

CREATE TABLE sql_dialects (
    dialect_id SERIAL PRIMARY KEY,
    dialect_name VARCHAR(50) UNIQUE NOT NULL, -- MySQL, PostgreSQL, SQLite, Oracle, MS SQL
    display_name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    documentation_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    INDEX idx_dialect_name (dialect_name)
);

CREATE TABLE sql_versions (
    version_id SERIAL PRIMARY KEY,
    dialect_id INT NOT NULL,
    version_number VARCHAR(20) NOT NULL, -- e.g., "8.0", "15.2", "3.40.0"
    display_name VARCHAR(100), -- "MySQL 8.0", "PostgreSQL 15.2"
    release_date DATE,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    UNIQUE KEY unique_dialect_version (dialect_id, version_number),
    INDEX idx_dialect_id (dialect_id)
);

-- User's chosen SQL dialect preference
CREATE TABLE user_dialect_preferences (
    preference_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    dialect_id INT NOT NULL,
    version_id INT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    FOREIGN KEY (version_id) REFERENCES sql_versions(version_id),
    INDEX idx_user_dialect (user_id, dialect_id)
);

-- ============================================
-- 3. LEARNING CONTENT STRUCTURE
-- ============================================

CREATE TABLE learning_paths (
    path_id SERIAL PRIMARY KEY,
    path_name VARCHAR(100) NOT NULL,
    display_title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    estimated_hours INT, -- Total hours to complete
    thumbnail_url VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_published (is_published)
);

CREATE TABLE chapters (
    chapter_id SERIAL PRIMARY KEY,
    path_id INT NOT NULL,
    chapter_number INT NOT NULL,
    chapter_title VARCHAR(200) NOT NULL,
    description TEXT,
    estimated_minutes INT,
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (path_id) REFERENCES learning_paths(path_id) ON DELETE CASCADE,
    UNIQUE KEY unique_path_chapter (path_id, chapter_number),
    INDEX idx_path_id (path_id)
);

CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    chapter_id INT NOT NULL,
    lesson_number INT NOT NULL,
    lesson_title VARCHAR(200) NOT NULL,
    lesson_type ENUM('tutorial', 'challenge', 'quiz', 'project', 'documentation'),
    description TEXT,
    estimated_minutes INT,
    xp_reward INT DEFAULT 0, -- Experience points
    coins_reward INT DEFAULT 0, -- In-game currency
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (chapter_id) REFERENCES chapters(chapter_id) ON DELETE CASCADE,
    UNIQUE KEY unique_chapter_lesson (chapter_id, lesson_number),
    INDEX idx_chapter_id (chapter_id),
    INDEX idx_lesson_type (lesson_type)
);

-- ============================================
-- 4. MULTI-DIALECT LESSON CONTENT
-- ============================================

CREATE TABLE lesson_contents (
    content_id BIGSERIAL PRIMARY KEY,
    lesson_id INT NOT NULL,
    dialect_id INT, -- NULL means common to all dialects
    version_id INT, -- NULL means common to all versions
    content_type ENUM('markdown', 'html', 'video', 'interactive') DEFAULT 'markdown',
    content_text TEXT, -- Main lesson content
    content_url VARCHAR(500), -- For video/external content
    video_duration_seconds INT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    FOREIGN KEY (version_id) REFERENCES sql_versions(version_id),
    INDEX idx_lesson_dialect (lesson_id, dialect_id),
    INDEX idx_content_type (content_type)
);

-- SQL Code examples for each dialect
CREATE TABLE code_examples (
    example_id BIGSERIAL PRIMARY KEY,
    lesson_id INT NOT NULL,
    dialect_id INT NOT NULL,
    version_id INT,
    example_title VARCHAR(200),
    sql_code TEXT NOT NULL,
    explanation TEXT,
    expected_output TEXT,
    animation_config JSON, -- Configuration for city animation
    sort_order INT DEFAULT 0,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    FOREIGN KEY (version_id) REFERENCES sql_versions(version_id),
    INDEX idx_lesson_dialect_example (lesson_id, dialect_id)
);

-- ============================================
-- 5. DOCUMENTATION SYSTEM
-- ============================================

CREATE TABLE documentation_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INT,
    description TEXT,
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    FOREIGN KEY (parent_category_id) REFERENCES documentation_categories(category_id),
    INDEX idx_parent_category (parent_category_id)
);

CREATE TABLE documentation_topics (
    topic_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    dialect_id INT, -- NULL for general topics
    topic_slug VARCHAR(100) UNIQUE NOT NULL,
    topic_title VARCHAR(200) NOT NULL,
    short_description TEXT,
    content TEXT NOT NULL,
    code_examples TEXT,
    related_lessons JSON, -- Array of lesson_ids
    tags JSON, -- Array of tags
    view_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES documentation_categories(category_id),
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    INDEX idx_topic_slug (topic_slug),
    INDEX idx_category_dialect (category_id, dialect_id),
    FULLTEXT INDEX idx_search (topic_title, short_description, content)
);

CREATE TABLE documentation_search_history (
    search_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    search_query VARCHAR(500) NOT NULL,
    results_count INT DEFAULT 0,
    clicked_topic_id INT,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (clicked_topic_id) REFERENCES documentation_topics(topic_id),
    INDEX idx_user_search (user_id, searched_at),
    INDEX idx_search_query (search_query)
);

-- ============================================
-- 6. GAME MECHANICS & CITY BUILDING
-- ============================================

CREATE TABLE cities (
    city_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    dialect_id INT NOT NULL, -- Each city is for specific SQL dialect
    city_name VARCHAR(100) NOT NULL,
    city_description TEXT,
    city_level INT DEFAULT 1,
    total_xp BIGINT DEFAULT 0,
    total_coins BIGINT DEFAULT 0,
    population INT DEFAULT 0,
    city_theme ENUM('vrindavan', 'mathura', 'ayodhya', 'kashi', 'modern') DEFAULT 'vrindavan',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    INDEX idx_user_city (user_id, dialect_id),
    INDEX idx_public_cities (is_public, city_level)
);

CREATE TABLE building_types (
    building_type_id SERIAL PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL, -- dharamshala, temples, ashrams, etc.
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM('residential', 'religious', 'commercial', 'infrastructure', 'special'),
    unlock_level INT DEFAULT 1,
    base_cost_coins INT DEFAULT 0,
    base_population INT DEFAULT 0,
    animation_class VARCHAR(100), -- CSS class for animation
    icon_url VARCHAR(500),
    INDEX idx_unlock_level (unlock_level)
);

CREATE TABLE city_buildings (
    building_id BIGSERIAL PRIMARY KEY,
    city_id BIGINT NOT NULL,
    building_type_id INT NOT NULL,
    position_x INT, -- Grid position in city
    position_y INT,
    building_level INT DEFAULT 1,
    capacity INT DEFAULT 0,
    current_occupancy INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    built_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upgraded_at TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE,
    FOREIGN KEY (building_type_id) REFERENCES building_types(building_type_id),
    INDEX idx_city_buildings (city_id),
    INDEX idx_building_position (city_id, position_x, position_y)
);

-- Quests/Missions system
CREATE TABLE quests (
    quest_id SERIAL PRIMARY KEY,
    quest_title VARCHAR(200) NOT NULL,
    quest_description TEXT,
    quest_type ENUM('main', 'side', 'daily', 'weekly', 'special'),
    difficulty ENUM('easy', 'medium', 'hard', 'expert'),
    related_lesson_id INT,
    prerequisites JSON, -- Array of quest_ids that must be completed first
    objectives JSON, -- Array of objectives to complete quest
    xp_reward INT DEFAULT 0,
    coins_reward INT DEFAULT 0,
    special_reward TEXT,
    unlock_conditions JSON,
    is_published BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (related_lesson_id) REFERENCES lessons(lesson_id),
    INDEX idx_quest_type (quest_type)
);

CREATE TABLE user_quests (
    user_quest_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    quest_id INT NOT NULL,
    dialect_id INT NOT NULL,
    status ENUM('available', 'in_progress', 'completed', 'failed') DEFAULT 'available',
    progress_data JSON, -- Track objectives completion
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    attempts INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id),
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    INDEX idx_user_quest_status (user_id, status),
    INDEX idx_quest_completion (quest_id, completed_at)
);

-- ============================================
-- 7. USER PROGRESS TRACKING
-- ============================================

CREATE TABLE user_progress (
    progress_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id INT NOT NULL,
    dialect_id INT NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed', 'skipped') DEFAULT 'not_started',
    completion_percentage INT DEFAULT 0,
    time_spent_seconds INT DEFAULT 0,
    attempts INT DEFAULT 0,
    best_score INT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id),
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    UNIQUE KEY unique_user_lesson_dialect (user_id, lesson_id, dialect_id),
    INDEX idx_user_progress (user_id, status),
    INDEX idx_lesson_completion (lesson_id, completed_at)
);

CREATE TABLE user_sql_submissions (
    submission_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id INT,
    quest_id INT,
    dialect_id INT NOT NULL,
    sql_query TEXT NOT NULL,
    execution_status ENUM('success', 'error', 'timeout', 'pending') DEFAULT 'pending',
    execution_time_ms INT,
    result_data JSON, -- Query results
    error_message TEXT,
    is_correct BOOLEAN,
    score INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id),
    FOREIGN KEY (quest_id) REFERENCES quests(quest_id),
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    INDEX idx_user_submissions (user_id, submitted_at),
    INDEX idx_lesson_submissions (lesson_id, is_correct)
);

CREATE TABLE user_achievements (
    achievement_id SERIAL PRIMARY KEY,
    achievement_name VARCHAR(100) UNIQUE NOT NULL,
    display_title VARCHAR(200) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    rarity ENUM('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
    criteria JSON, -- Conditions to unlock
    xp_reward INT DEFAULT 0,
    INDEX idx_achievement_name (achievement_name)
);

CREATE TABLE user_unlocked_achievements (
    unlock_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES user_achievements(achievement_id),
    UNIQUE KEY unique_user_achievement (user_id, achievement_id),
    INDEX idx_user_achievements (user_id, unlocked_at)
);

-- ============================================
-- 8. LEADERBOARDS & SOCIAL
-- ============================================

CREATE TABLE leaderboards (
    leaderboard_id SERIAL PRIMARY KEY,
    leaderboard_type ENUM('global_xp', 'dialect_xp', 'weekly_xp', 'city_level', 'quest_completion') NOT NULL,
    dialect_id INT, -- NULL for global
    time_period ENUM('all_time', 'monthly', 'weekly', 'daily') DEFAULT 'all_time',
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    UNIQUE KEY unique_leaderboard (leaderboard_type, dialect_id, time_period)
);

CREATE TABLE leaderboard_entries (
    entry_id BIGSERIAL PRIMARY KEY,
    leaderboard_id INT NOT NULL,
    user_id BIGINT NOT NULL,
    rank_position INT NOT NULL,
    score BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (leaderboard_id) REFERENCES leaderboards(leaderboard_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_leaderboard_user (leaderboard_id, user_id),
    INDEX idx_leaderboard_rank (leaderboard_id, rank_position),
    INDEX idx_leaderboard_score (leaderboard_id, score DESC)
);

CREATE TABLE user_followers (
    follow_id BIGSERIAL PRIMARY KEY,
    follower_user_id BIGINT NOT NULL,
    following_user_id BIGINT NOT NULL,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (follower_user_id, following_user_id),
    INDEX idx_follower (follower_user_id),
    INDEX idx_following (following_user_id)
);

CREATE TABLE city_shares (
    share_id BIGSERIAL PRIMARY KEY,
    city_id BIGINT NOT NULL,
    share_url VARCHAR(255) UNIQUE NOT NULL,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE,
    INDEX idx_share_url (share_url),
    INDEX idx_share_popularity (like_count DESC, view_count DESC)
);

CREATE TABLE city_likes (
    like_id BIGSERIAL PRIMARY KEY,
    city_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_city_like (city_id, user_id),
    INDEX idx_city_likes (city_id),
    INDEX idx_user_likes (user_id)
);

CREATE TABLE user_comments (
    comment_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_type ENUM('city', 'lesson', 'documentation', 'quest'),
    target_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    parent_comment_id BIGINT, -- For nested replies
    like_count INT DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES user_comments(comment_id) ON DELETE CASCADE,
    INDEX idx_target_comments (target_type, target_id, created_at),
    INDEX idx_user_comments (user_id, created_at)
);

-- ============================================
-- 9. SUBSCRIPTION & PAYMENTS
-- ============================================

CREATE TABLE subscription_plans (
    plan_id SERIAL PRIMARY KEY,
    plan_name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    price_usd DECIMAL(10, 2) NOT NULL,
    price_inr DECIMAL(10, 2),
    billing_cycle ENUM('monthly', 'yearly', 'lifetime') NOT NULL,
    features JSON, -- List of features included
    max_dialects INT DEFAULT 1, -- Number of SQL dialects accessible
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    INDEX idx_plan_name (plan_name)
);

CREATE TABLE user_subscriptions (
    subscription_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id INT NOT NULL,
    status ENUM('active', 'cancelled', 'expired', 'paused') DEFAULT 'active',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id),
    INDEX idx_user_subscription (user_id, status),
    INDEX idx_subscription_expiry (end_date)
);

CREATE TABLE payment_transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subscription_id BIGINT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_gateway VARCHAR(50), -- stripe, razorpay, paypal
    transaction_reference VARCHAR(255) UNIQUE,
    transaction_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(subscription_id),
    INDEX idx_user_transactions (user_id, created_at),
    INDEX idx_transaction_status (transaction_status)
);

-- ============================================
-- 10. ANALYTICS & MONITORING
-- ============================================

CREATE TABLE user_activity_logs (
    log_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    activity_type ENUM('login', 'logout', 'lesson_start', 'lesson_complete', 'query_run', 'page_view', 'city_edit', 'quest_complete'),
    activity_details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_activity (user_id, created_at),
    INDEX idx_activity_type (activity_type, created_at)
) PARTITION BY RANGE (YEAR(created_at)); -- Partition by year for performance

CREATE TABLE error_logs (
    error_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    error_type VARCHAR(100),
    error_message TEXT,
    stack_trace TEXT,
    request_url TEXT,
    request_method VARCHAR(10),
    user_agent TEXT,
    ip_address VARCHAR(45),
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_error_type (error_type, created_at),
    INDEX idx_severity (severity, is_resolved)
);

CREATE TABLE performance_metrics (
    metric_id BIGSERIAL PRIMARY KEY,
    metric_type VARCHAR(100) NOT NULL, -- page_load, query_execution, api_response
    metric_value DECIMAL(10, 2) NOT NULL,
    dialect_id INT,
    endpoint VARCHAR(255),
    user_id BIGINT,
    metadata JSON,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dialect_id) REFERENCES sql_dialects(dialect_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_metric_type (metric_type, recorded_at),
    INDEX idx_performance_tracking (endpoint, recorded_at)
) PARTITION BY RANGE (YEAR(recorded_at));

CREATE TABLE daily_active_users (
    date DATE PRIMARY KEY,
    total_users INT DEFAULT 0,
    new_users INT DEFAULT 0,
    returning_users INT DEFAULT 0,
    peak_concurrent_users INT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    avg_session_duration_seconds INT DEFAULT 0,
    total_lessons_completed INT DEFAULT 0,
    total_queries_executed INT DEFAULT 0,
    INDEX idx_date (date DESC)
);

-- ============================================
-- 11. NOTIFICATIONS & MESSAGING
-- ============================================

CREATE TABLE notification_templates (
    template_id SERIAL PRIMARY KEY,
    template_name VARCHAR(100) UNIQUE NOT NULL,
    notification_type ENUM('email', 'in_app', 'push', 'sms'),
    subject_template VARCHAR(255),
    body_template TEXT NOT NULL,
    variables JSON, -- Template variables
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_template_name (template_name)
);

CREATE TABLE user_notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_type ENUM('achievement', 'quest', 'leaderboard', 'social', 'system', 'payment'),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    action_url VARCHAR(500),
    icon VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_notifications (user_id, is_read, created_at),
    INDEX idx_notification_type (notification_type, created_at)
);

CREATE TABLE email_queue (
    email_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    recipient_email VARCHAR(255) NOT NULL,
    template_id INT,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    status ENUM('pending', 'sent', 'failed', 'bounced') DEFAULT 'pending',
    attempts INT DEFAULT 0,
    last_error TEXT,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (template_id) REFERENCES notification_templates(template_id),
    INDEX idx_email_status (status, scheduled_at),
    INDEX idx_recipient_email (recipient_email)
);

-- ============================================
-- 12. ADMIN & MODERATION
-- ============================================

CREATE TABLE admin_users (
    admin_id SERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator', 'content_creator') DEFAULT 'moderator',
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_admin_role (role)
);

CREATE TABLE moderation_reports (
    report_id BIGSERIAL PRIMARY KEY,
    reporter_user_id BIGINT NOT NULL,
    reported_content_type ENUM('city', 'comment', 'profile', 'submission'),
    reported_content_id BIGINT NOT NULL,
    reported_user_id BIGINT,
    reason ENUM('spam', 'inappropriate', 'offensive', 'plagiarism', 'other'),
    description TEXT,
    status ENUM('pending', 'reviewing', 'resolved', 'dismissed') DEFAULT 'pending',
    reviewed_by_admin_id INT,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (reporter_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by_admin_id) REFERENCES admin_users(admin_id),
    INDEX idx_moderation_status (status, created_at),
    INDEX idx_reported_user (reported_user_id)
);

-- ============================================
-- 13. RESUME/JOB MANAGEMENT (For recruitment)
-- ============================================

CREATE TABLE job_applications (
    application_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    resume_filename VARCHAR(255),
    resume_url VARCHAR(500),
    resume_file_size INT,
    position_applied VARCHAR(100),
    cover_letter TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    years_of_experience DECIMAL(3, 1),
    skills JSON,
    status ENUM('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired') DEFAULT 'submitted',
    screening_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_application_status (status, submitted_at),
    INDEX idx_email (email)
);

-- ============================================
-- 14. WAITLIST MANAGEMENT
-- ============================================

CREATE TABLE waitlist (
    waitlist_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    referral_source VARCHAR(100),
    preferred_dialect VARCHAR(50),
    interest_level ENUM('casual', 'serious', 'professional') DEFAULT 'casual',
    status ENUM('pending', 'invited', 'registered') DEFAULT 'pending',
    invite_code VARCHAR(50) UNIQUE,
    invited_at TIMESTAMP,
    registered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_invite_code (invite_code)
);

-- ============================================
-- INDEXES FOR SCALABILITY (100K users, 10K concurrent)
-- ============================================

-- Composite indexes for common queries
CREATE INDEX idx_user_progress_tracking ON user_progress(user_id, dialect_id, status, last_activity_at);
CREATE INDEX idx_city_public_display ON cities(is_public, city_level DESC, total_xp DESC);
CREATE INDEX idx_leaderboard_performance ON leaderboard_entries(leaderboard_id, score DESC, rank_position);
CREATE INDEX idx_submissions_recent ON user_sql_submissions(user_id, dialect_id, submitted_at DESC);
CREATE INDEX idx_active_sessions ON user_sessions(user_id, expires_at) WHERE session_token IS NOT NULL;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

CREATE VIEW v_user_dashboard AS
SELECT 
    u.user_id,
    u.username,
    u.email,
    COUNT(DISTINCT c.city_id) as total_cities,
    COALESCE(SUM(c.total_xp), 0) as total_xp,
    COALESCE(SUM(c.total_coins), 0) as total_coins,
    COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.status = 'completed') as lessons_completed,
    COUNT(DISTINCT uq.quest_id) FILTER (WHERE uq.status = 'completed') as quests_completed,
    COUNT(DISTINCT ua.achievement_id) as achievements_unlocked,
    u.last_active_at
FROM users u
LEFT JOIN cities c ON u.user_id = c.user_id
LEFT JOIN user_progress up ON u.user_id = up.user_id
LEFT JOIN user_quests uq ON u.user_id = uq.user_id
LEFT JOIN user_unlocked_achievements ua ON u.user_id = ua.user_id
GROUP BY u.user_id;

CREATE VIEW v_dialect_popularity AS
SELECT 
    sd.dialect_id,
    sd.dialect_name,
    sd.display_name,
    COUNT(DISTINCT udp.user_id) as total_users,
    COUNT(DISTINCT c.city_id) as total_cities,
    COUNT(DISTINCT up.progress_id) FILTER (WHERE up.status = 'completed') as lessons_completed,
    AVG(up.completion_percentage) as avg_completion_rate
FROM sql_dialects sd
LEFT JOIN user_dialect_preferences udp ON sd.dialect_id = udp.dialect_id
LEFT JOIN cities c ON sd.dialect_id = c.dialect_id
LEFT JOIN user_progress up ON sd.dialect_id = up.dialect_id
GROUP BY sd.dialect_id;

CREATE VIEW v_lesson_analytics AS
SELECT 
    l.lesson_id,
    l.lesson_title,
    l.lesson_type,
    c.chapter_title,
    lp.path_name,
    COUNT(DISTINCT up.user_id) as total_attempts,
    COUNT(DISTINCT up.user_id) FILTER (WHERE up.status = 'completed') as completions,
    ROUND(COUNT(DISTINCT up.user_id) FILTER (WHERE up.status = 'completed')::DECIMAL / 
          NULLIF(COUNT(DISTINCT up.user_id), 0) * 100, 2) as completion_rate,
    AVG(up.time_spent_seconds) as avg_time_spent,
    AVG(up.attempts) as avg_attempts
FROM lessons l
JOIN chapters c ON l.chapter_id = c.chapter_id
JOIN learning_paths lp ON c.path_id = lp.path_id
LEFT JOIN user_progress up ON l.lesson_id = up.lesson_id
GROUP BY l.lesson_id, c.chapter_id, lp.path_id;

-- ============================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- ============================================

-- // DELIMITER //

-- Update user XP and level
CREATE PROCEDURE sp_update_user_xp(
    IN p_user_id BIGINT,
    IN p_dialect_id INT,
    IN p_xp_gained INT
)
BEGIN
    DECLARE v_city_id BIGINT;
    DECLARE v_current_xp BIGINT;
    DECLARE v_new_level INT;
    
    -- Get city and current XP
    SELECT city_id, total_xp INTO v_city_id, v_current_xp
    FROM cities
    WHERE user_id = p_user_id AND dialect_id = p_dialect_id
    LIMIT 1;
    
    -- Calculate new level (example: level = floor(sqrt(total_xp / 100)))
    SET v_new_level = FLOOR(SQRT((v_current_xp + p_xp_gained) / 100)) + 1;
    
    -- Update city
    UPDATE cities
    SET total_xp = total_xp + p_xp_gained,
        city_level = v_new_level,
        last_updated_at = CURRENT_TIMESTAMP
    WHERE city_id = v_city_id;
END //

-- Complete lesson and update progress
CREATE PROCEDURE sp_complete_lesson(
    IN p_user_id BIGINT,
    IN p_lesson_id INT,
    IN p_dialect_id INT,
    IN p_time_spent INT,
    IN p_score INT
)
BEGIN
    -- Update or insert progress
    INSERT INTO user_progress (user_id, lesson_id, dialect_id, status, completion_percentage, time_spent_seconds, best_score, started_at, completed_at, last_activity_at)
    VALUES (p_user_id, p_lesson_id, p_dialect_id, 'completed', 100, p_time_spent, p_score, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON DUPLICATE KEY UPDATE
        status = 'completed',
        completion_percentage = 100,
        time_spent_seconds = time_spent_seconds + p_time_spent,
        best_score = GREATEST(COALESCE(best_score, 0), p_score),
        completed_at = CURRENT_TIMESTAMP,
        last_activity_at = CURRENT_TIMESTAMP;
    
    -- Award XP and coins
    DECLARE v_xp_reward INT;
    DECLARE v_coins_reward INT;
    
    SELECT xp_reward, coins_reward INTO v_xp_reward, v_coins_reward
    FROM lessons
    WHERE lesson_id = p_lesson_id;
    
    CALL sp_update_user_xp(p_user_id, p_dialect_id, v_xp_reward);
    
    UPDATE cities
    SET total_coins = total_coins + v_coins_reward
    WHERE user_id = p_user_id AND dialect_id = p_dialect_id;
END //

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update leaderboards when city XP changes
DELIMITER //
CREATE TRIGGER tr_update_leaderboard_after_xp_change
AFTER UPDATE ON cities
FOR EACH ROW
BEGIN
    IF NEW.total_xp != OLD.total_xp THEN
        -- Update global XP leaderboard
        INSERT INTO leaderboard_entries (leaderboard_id, user_id, rank_position, score)
        SELECT l.leaderboard_id, NEW.user_id, 0, NEW.total_xp
        FROM leaderboards l
        WHERE l.leaderboard_type = 'global_xp' AND l.time_period = 'all_time'
        ON DUPLICATE KEY UPDATE score = NEW.total_xp, updated_at = CURRENT_TIMESTAMP;
    END IF;
END //
DELIMITER ;

-- Log user activity
DELIMITER //
CREATE TRIGGER tr_log_lesson_completion
AFTER UPDATE ON user_progress
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO user_activity_logs (user_id, activity_type, activity_details, created_at)
        VALUES (NEW.user_id, 'lesson_complete', JSON_OBJECT('lesson_id', NEW.lesson_id, 'dialect_id', NEW.dialect_id), CURRENT_TIMESTAMP);
    END IF;
END //
DELIMITER ;

-- ============================================
-- INITIALIZATION DATA
-- ============================================

-- Insert default SQL dialects
INSERT INTO sql_dialects (dialect_name, display_name, description, logo_url, sort_order) VALUES
('mysql', 'MySQL', 'Most popular open-source relational database', '/assets/logos/mysql.svg', 1),
('postgresql', 'PostgreSQL', 'Advanced open-source relational database', '/assets/logos/postgresql.svg', 2),
('sqlite', 'SQLite', 'Lightweight embedded database', '/assets/logos/sqlite.svg', 3),
('oracle', 'Oracle Database', 'Enterprise-grade relational database', '/assets/logos/oracle.svg', 4),
('mssql', 'Microsoft SQL Server', 'Microsoft enterprise database', '/assets/logos/mssql.svg', 5),
('mariadb', 'MariaDB', 'MySQL fork with additional features', '/assets/logos/mariadb.svg', 6);

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_name, display_name, description, price_usd, price_inr, billing_cycle, features, max_dialects) VALUES
('free', 'Free Explorer', 'Perfect for beginners', 0.00, 0.00, 'monthly', '["1 SQL dialect", "Basic lessons", "Community support"]', 1),
('basic', 'City Builder', 'Learn at your pace', 9.99, 799.00, 'monthly', '["All SQL dialects", "Full lesson access", "Priority support", "Progress tracking"]', 999),
('pro', 'Master Builder', 'Become SQL expert', 19.99, 1499.00, 'monthly', '["All features", "Advanced quests", "Certificates", "1-on-1 mentoring", "Job board access"]', 999),
('lifetime', 'Eternal Architect', 'One-time payment, lifetime access', 199.99, 14999.00, 'lifetime', '["Everything in Pro", "Lifetime updates", "Exclusive community", "Early feature access"]', 999);

-- Insert default building types
INSERT INTO building_types (building_name, display_name, description, category, unlock_level, base_cost_coins, base_population) VALUES
('dharamshala', 'Dharamshala', 'Guest houses for pilgrims', 'residential', 1, 0, 2),
('temples', 'Temple', 'Sacred places of worship', 'religious', 2, 100, 0),
('ashrams', 'Ashram', 'Spiritual retreats', 'religious', 3, 200, 5),
('pilgrims', 'Pilgrim House', 'Small dwelling for visitors', 'residential', 1, 50, 1),
('marketplace', 'Bazaar', 'Trade and commerce center', 'commercial', 5, 500, 10),
('library', 'Shastra Library', 'Knowledge center', 'infrastructure', 4, 300, 0),
('garden', 'Sacred Garden', 'Peaceful green space', 'infrastructure', 6, 400, 0);

-- ============================================
-- PERFORMANCE OPTIMIZATION NOTES
-- ============================================
/*
For 100K users and 10K parallel users:

1. DATABASE CONFIGURATION:
   - Use connection pooling (min: 20, max: 100 connections)
   - Configure max_connections = 500
   - Set innodb_buffer_pool_size = 70% of RAM
   - Enable query cache for read-heavy operations

2. CACHING STRATEGY:
   - Redis for session management
   - Memcached for query result caching
   - CDN for static assets (images, videos)
   - Cache user progress, leaderboards (TTL: 5-10 minutes)

3. READ REPLICAS:
   - Master-Slave replication for read scaling
   - Route analytics queries to read replicas
   - Use read replicas for leaderboards, documentation

4. PARTITIONING:
   - Partition user_activity_logs by date (monthly)
   - Partition performance_metrics by date (monthly)
   - Consider sharding users table by user_id ranges if > 1M users

5. INDEXING:
   - All foreign keys are indexed
   - Composite indexes for common WHERE clauses
   - Avoid over-indexing (balance reads vs writes)

6. ARCHIVING:
   - Move old activity logs to archive tables (> 6 months)
   - Compress old submission data
   - Purge expired sessions daily

7. MONITORING:
   - Monitor slow queries (> 100ms)
   - Track connection pool usage
   - Set up alerts for high CPU/memory usage
   - Monitor replication lag

8. BACKUP STRATEGY:
   - Daily full backups
   - Hourly incremental backups
   - Point-in-time recovery enabled
   - Test restore procedures monthly
*/
