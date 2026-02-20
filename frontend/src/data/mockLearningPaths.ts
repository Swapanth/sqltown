import type { LearningPath, Lesson, CodeExample } from '../models/types';

// Helper function to generate code examples for different dialects
const generateCodeExamples = (lessonId: number, baseCode: string, explanation: string): CodeExample[] => {
    return [
        {
            example_id: lessonId * 10 + 1,
            lesson_id: lessonId,
            dialect: 'mysql',
            example_title: 'MySQL Example',
            sql_code: baseCode,
            explanation,
            expected_output: '3 rows returned',
        },
        {
            example_id: lessonId * 10 + 2,
            lesson_id: lessonId,
            dialect: 'postgresql',
            example_title: 'PostgreSQL Example',
            sql_code: baseCode,
            explanation,
            expected_output: '3 rows returned',
        },
    ];
};

// Beginner MySQL Path
const beginnerMySQLPath: LearningPath = {
    path_id: 1,
    path_name: 'beginner_mysql',
    display_title: 'MySQL Fundamentals',
    description: 'Learn the basics of MySQL database management',
    difficulty_level: 'beginner',
    estimated_hours: 20,
    thumbnail_url: '/paths/mysql-beginner.jpg',
    is_published: true,
    chapters: [
        {
            chapter_id: 1,
            path_id: 1,
            chapter_number: 1,
            chapter_title: 'Database Basics',
            description: 'Introduction to databases and SQL',
            estimated_minutes: 120,
            is_published: true,
            lessons: [
                {
                    lesson_id: 1,
                    chapter_id: 1,
                    lesson_number: 1,
                    lesson_title: 'What is a Database?',
                    lesson_type: 'tutorial',
                    description: 'Learn what databases are and why they matter',
                    estimated_minutes: 15,
                    xp_reward: 50,
                    coins_reward: 20,
                    is_published: true,
                    content: {
                        content_id: 1,
                        lesson_id: 1,
                        content_type: 'markdown',
                        content_text: `# What is a Database?

A database is an organized collection of data stored and accessed electronically. Think of it as a digital filing cabinet where you can store, retrieve, and manage information efficiently.

## Why Use Databases?

- **Organization**: Keep data structured and easy to find
- **Efficiency**: Quick access to large amounts of data
- **Security**: Control who can access what data
- **Scalability**: Handle growing amounts of data

## Your First City Building

In SQLTown, databases are represented as cities! Each table you create becomes a building in your sacred city.`,
                        code_examples: [],
                    },
                },
                {
                    lesson_id: 2,
                    chapter_id: 1,
                    lesson_number: 2,
                    lesson_title: 'Your First SELECT Query',
                    lesson_type: 'tutorial',
                    description: 'Learn to retrieve data from tables',
                    estimated_minutes: 20,
                    xp_reward: 100,
                    coins_reward: 40,
                    is_published: true,
                    content: {
                        content_id: 2,
                        lesson_id: 2,
                        content_type: 'markdown',
                        content_text: `# Your First SELECT Query

The SELECT statement is used to retrieve data from database tables. It's the most commonly used SQL command!

## Basic Syntax

\`\`\`sql
SELECT column1, column2
FROM table_name;
\`\`\`

## Select All Columns

Use the asterisk (*) to select all columns:

\`\`\`sql
SELECT * FROM users;
\`\`\`

## Try It Yourself!

Run the query below to see all pilgrims in your dharamshala:`,
                        code_examples: generateCodeExamples(
                            2,
                            'SELECT * FROM pilgrims;',
                            'This query retrieves all rows and columns from the pilgrims table'
                        ),
                    },
                },
                {
                    lesson_id: 3,
                    chapter_id: 1,
                    lesson_number: 3,
                    lesson_title: 'Filtering with WHERE',
                    lesson_type: 'tutorial',
                    description: 'Learn to filter data using WHERE clause',
                    estimated_minutes: 25,
                    xp_reward: 120,
                    coins_reward: 50,
                    is_published: true,
                },
                {
                    lesson_id: 4,
                    chapter_id: 1,
                    lesson_number: 4,
                    lesson_title: 'Sorting with ORDER BY',
                    lesson_type: 'tutorial',
                    description: 'Learn to sort query results',
                    estimated_minutes: 20,
                    xp_reward: 100,
                    coins_reward: 40,
                    is_published: true,
                },
                {
                    lesson_id: 5,
                    chapter_id: 1,
                    lesson_number: 5,
                    lesson_title: 'Challenge: Query the City',
                    lesson_type: 'challenge',
                    description: 'Test your SELECT skills',
                    estimated_minutes: 30,
                    xp_reward: 200,
                    coins_reward: 100,
                    is_published: true,
                },
            ],
        },
        {
            chapter_id: 2,
            path_id: 1,
            chapter_number: 2,
            chapter_title: 'Creating Tables',
            description: 'Learn to create and modify database tables',
            estimated_minutes: 180,
            is_published: true,
            lessons: [
                {
                    lesson_id: 6,
                    chapter_id: 2,
                    lesson_number: 1,
                    lesson_title: 'CREATE TABLE Basics',
                    lesson_type: 'tutorial',
                    description: 'Build your first dharamshala',
                    estimated_minutes: 30,
                    xp_reward: 150,
                    coins_reward: 60,
                    is_published: true,
                },
                {
                    lesson_id: 7,
                    chapter_id: 2,
                    lesson_number: 2,
                    lesson_title: 'Data Types',
                    lesson_type: 'tutorial',
                    description: 'Understanding MySQL data types',
                    estimated_minutes: 25,
                    xp_reward: 120,
                    coins_reward: 50,
                    is_published: true,
                },
                {
                    lesson_id: 8,
                    chapter_id: 2,
                    lesson_number: 3,
                    lesson_title: 'Primary Keys',
                    lesson_type: 'tutorial',
                    description: 'Learn about unique identifiers',
                    estimated_minutes: 20,
                    xp_reward: 100,
                    coins_reward: 40,
                    is_published: true,
                },
                {
                    lesson_id: 9,
                    chapter_id: 2,
                    lesson_number: 4,
                    lesson_title: 'ALTER TABLE',
                    lesson_type: 'tutorial',
                    description: 'Modify existing tables',
                    estimated_minutes: 25,
                    xp_reward: 120,
                    coins_reward: 50,
                    is_published: true,
                },
                {
                    lesson_id: 10,
                    chapter_id: 2,
                    lesson_number: 5,
                    lesson_title: 'Challenge: Build a Dharamshala',
                    lesson_type: 'challenge',
                    description: 'Create a complete table structure',
                    estimated_minutes: 40,
                    xp_reward: 250,
                    coins_reward: 120,
                    is_published: true,
                },
            ],
        },
        {
            chapter_id: 3,
            path_id: 1,
            chapter_number: 3,
            chapter_title: 'Inserting Data',
            description: 'Learn to add data to your tables',
            estimated_minutes: 150,
            is_published: true,
            lessons: [
                {
                    lesson_id: 11,
                    chapter_id: 3,
                    lesson_number: 1,
                    lesson_title: 'INSERT INTO Basics',
                    lesson_type: 'tutorial',
                    description: 'Add pilgrims to your city',
                    estimated_minutes: 25,
                    xp_reward: 120,
                    coins_reward: 50,
                    is_published: true,
                },
                {
                    lesson_id: 12,
                    chapter_id: 3,
                    lesson_number: 2,
                    lesson_title: 'Multiple Row Inserts',
                    lesson_type: 'tutorial',
                    description: 'Insert multiple rows at once',
                    estimated_minutes: 20,
                    xp_reward: 100,
                    coins_reward: 40,
                    is_published: true,
                },
                {
                    lesson_id: 13,
                    chapter_id: 3,
                    lesson_number: 3,
                    lesson_title: 'UPDATE Statements',
                    lesson_type: 'tutorial',
                    description: 'Modify existing data',
                    estimated_minutes: 25,
                    xp_reward: 120,
                    coins_reward: 50,
                    is_published: true,
                },
                {
                    lesson_id: 14,
                    chapter_id: 3,
                    lesson_number: 4,
                    lesson_title: 'DELETE Statements',
                    lesson_type: 'tutorial',
                    description: 'Remove data from tables',
                    estimated_minutes: 20,
                    xp_reward: 100,
                    coins_reward: 40,
                    is_published: true,
                },
                {
                    lesson_id: 15,
                    chapter_id: 3,
                    lesson_number: 5,
                    lesson_title: 'Challenge: Populate Your City',
                    lesson_type: 'challenge',
                    description: 'Add and manage city data',
                    estimated_minutes: 35,
                    xp_reward: 200,
                    coins_reward: 100,
                    is_published: true,
                },
            ],
        },
    ],
};

// Generate additional lessons for intermediate and advanced paths
const generateLessons = (startId: number, chapterId: number, count: number): Lesson[] => {
    return Array.from({ length: count }, (_, i) => ({
        lesson_id: startId + i,
        chapter_id: chapterId,
        lesson_number: i + 1,
        lesson_title: `Lesson ${i + 1}`,
        lesson_type: i % 5 === 4 ? 'challenge' : 'tutorial' as const,
        description: `Learn advanced SQL concepts`,
        estimated_minutes: 20 + (i % 3) * 10,
        xp_reward: 100 + (i % 3) * 50,
        coins_reward: 40 + (i % 3) * 20,
        is_published: true,
    }));
};

// Intermediate MySQL Path
const intermediateMySQLPath: LearningPath = {
    path_id: 2,
    path_name: 'intermediate_mysql',
    display_title: 'MySQL Advanced Queries',
    description: 'Master JOINs, subqueries, and aggregations',
    difficulty_level: 'intermediate',
    estimated_hours: 30,
    thumbnail_url: '/paths/mysql-intermediate.jpg',
    is_published: true,
    chapters: [
        {
            chapter_id: 4,
            path_id: 2,
            chapter_number: 1,
            chapter_title: 'JOINs and Relationships',
            description: 'Connect your city buildings',
            estimated_minutes: 200,
            is_published: true,
            lessons: generateLessons(16, 4, 8),
        },
        {
            chapter_id: 5,
            path_id: 2,
            chapter_number: 2,
            chapter_title: 'Aggregate Functions',
            description: 'Count, sum, and analyze your data',
            estimated_minutes: 180,
            is_published: true,
            lessons: generateLessons(24, 5, 7),
        },
        {
            chapter_id: 6,
            path_id: 2,
            chapter_number: 3,
            chapter_title: 'Subqueries',
            description: 'Queries within queries',
            estimated_minutes: 150,
            is_published: true,
            lessons: generateLessons(31, 6, 6),
        },
    ],
};

// Advanced MySQL Path
const advancedMySQLPath: LearningPath = {
    path_id: 3,
    path_name: 'advanced_mysql',
    display_title: 'MySQL Expert Level',
    description: 'Stored procedures, triggers, and optimization',
    difficulty_level: 'advanced',
    estimated_hours: 40,
    thumbnail_url: '/paths/mysql-advanced.jpg',
    is_published: true,
    chapters: [
        {
            chapter_id: 7,
            path_id: 3,
            chapter_number: 1,
            chapter_title: 'Stored Procedures',
            description: 'Build ashrams with reusable logic',
            estimated_minutes: 240,
            is_published: true,
            lessons: generateLessons(37, 7, 10),
        },
        {
            chapter_id: 8,
            path_id: 3,
            chapter_number: 2,
            chapter_title: 'Triggers and Events',
            description: 'Automate your city',
            estimated_minutes: 200,
            is_published: true,
            lessons: generateLessons(47, 8, 8),
        },
        {
            chapter_id: 9,
            path_id: 3,
            chapter_number: 3,
            chapter_title: 'Performance Optimization',
            description: 'Make your city efficient',
            estimated_minutes: 180,
            is_published: true,
            lessons: generateLessons(55, 9, 7),
        },
    ],
};

// PostgreSQL Beginner Path
const beginnerPostgreSQLPath: LearningPath = {
    path_id: 4,
    path_name: 'beginner_postgresql',
    display_title: 'PostgreSQL Fundamentals',
    description: 'Learn the basics of PostgreSQL',
    difficulty_level: 'beginner',
    estimated_hours: 22,
    thumbnail_url: '/paths/postgresql-beginner.jpg',
    is_published: true,
    chapters: [
        {
            chapter_id: 10,
            path_id: 4,
            chapter_number: 1,
            chapter_title: 'PostgreSQL Basics',
            description: 'Introduction to PostgreSQL',
            estimated_minutes: 180,
            is_published: true,
            lessons: generateLessons(62, 10, 8),
        },
        {
            chapter_id: 11,
            path_id: 4,
            chapter_number: 2,
            chapter_title: 'Data Types in PostgreSQL',
            description: 'PostgreSQL-specific data types',
            estimated_minutes: 150,
            is_published: true,
            lessons: generateLessons(70, 11, 6),
        },
    ],
};

export const mockLearningPaths: LearningPath[] = [
    beginnerMySQLPath,
    intermediateMySQLPath,
    advancedMySQLPath,
    beginnerPostgreSQLPath,
];

// Helper functions
export const getLearningPathById = (pathId: number): LearningPath | undefined => {
    return mockLearningPaths.find(p => p.path_id === pathId);
};

export const getLessonById = (lessonId: number): Lesson | undefined => {
    for (const path of mockLearningPaths) {
        for (const chapter of path.chapters) {
            const lesson = chapter.lessons.find(l => l.lesson_id === lessonId);
            if (lesson) return lesson;
        }
    }
    return undefined;
};

export const getTotalLessonsCount = (): number => {
    return mockLearningPaths.reduce((total, path) => {
        return total + path.chapters.reduce((chapterTotal, chapter) => {
            return chapterTotal + chapter.lessons.length;
        }, 0);
    }, 0);
};

// Total: 76 lessons across 4 paths
