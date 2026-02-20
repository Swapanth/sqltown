import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardContent, Badge, ProgressBar } from '../../components/common';
import { mockLearningPaths } from '../../data/mockLearningPaths';

export const LearningPathsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-heading font-bold">Learning Paths</h1>
                    <p className="text-gray-600 mt-1">Choose your SQL learning journey</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockLearningPaths.map((path) => {
                        const totalLessons = path.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
                        const completedLessons = Math.floor(totalLessons * Math.random() * 0.5); // Mock progress

                        return (
                            <Link key={path.path_id} to={`/learning/${path.path_id}`}>
                                <Card hover className="h-full">
                                    {/* Thumbnail */}
                                    <div className="h-40 bg-gradient-to-br from-primary to-primary-hover rounded-t-lg flex items-center justify-center text-white text-6xl">
                                        {path.difficulty_level === 'beginner' ? '🌱' : path.difficulty_level === 'intermediate' ? '🌿' : '🌳'}
                                    </div>

                                    <CardContent className="pt-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <CardTitle className="text-lg">{path.display_title}</CardTitle>
                                            <Badge variant={
                                                path.difficulty_level === 'beginner' ? 'success' :
                                                    path.difficulty_level === 'intermediate' ? 'warning' : 'error'
                                            }>
                                                {path.difficulty_level}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4">
                                            {path.description}
                                        </p>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">📖 {path.chapters.length} chapters</span>
                                                <span className="text-gray-600">⏱️ {path.estimated_hours}h</span>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className="font-medium">{completedLessons} / {totalLessons} lessons</span>
                                                </div>
                                                <ProgressBar
                                                    value={completedLessons}
                                                    max={totalLessons}
                                                    color="success"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
