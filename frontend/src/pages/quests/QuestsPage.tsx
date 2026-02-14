import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, ProgressBar } from '../../components/common';
import { mockQuests, mockUserQuests } from '../../data/mockQuests';
import type { Quest } from '../../models/types';

export const QuestsPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'main' | 'side' | 'daily' | 'weekly'>('all');

    const filteredQuests = filter === 'all'
        ? mockQuests
        : mockQuests.filter(q => q.quest_type === filter);

    const getUserQuestStatus = (questId: number) => {
        return mockUserQuests.find(uq => uq.quest_id === questId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-heading font-bold">Quests</h1>
                    <p className="text-gray-600 mt-1">Complete quests to earn rewards and build your city</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex gap-2">
                    {(['all', 'main', 'side', 'daily', 'weekly'] as const).map((type) => (
                        <Button
                            key={type}
                            variant={filter === type ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(type)}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuests.slice(0, 12).map((quest) => {
                        const userQuest = getUserQuestStatus(quest.quest_id);
                        const isActive = userQuest?.status === 'in_progress';
                        const isCompleted = userQuest?.status === 'completed';
                        const completedObjectives = quest.objectives.filter(o => o.done).length;

                        return (
                            <Card key={quest.quest_id} hover className="h-full">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <CardTitle className="text-lg">{quest.quest_title}</CardTitle>
                                        <Badge variant={
                                            quest.quest_type === 'main' ? 'error' :
                                                quest.quest_type === 'daily' ? 'success' :
                                                    quest.quest_type === 'weekly' ? 'warning' : 'info'
                                        }>
                                            {quest.quest_type}
                                        </Badge>
                                    </div>
                                    <Badge variant={
                                        quest.difficulty === 'easy' ? 'success' :
                                            quest.difficulty === 'medium' ? 'warning' : 'error'
                                    }>
                                        {quest.difficulty}
                                    </Badge>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {quest.quest_description}
                                    </p>

                                    {/* Objectives */}
                                    <div className="mb-4">
                                        <div className="text-sm font-medium mb-2">Objectives:</div>
                                        <div className="space-y-1">
                                            {quest.objectives.map((obj) => (
                                                <div key={obj.id} className="flex items-start gap-2 text-sm">
                                                    <span>{obj.done ? '✅' : '⬜'}</span>
                                                    <span className={obj.done ? 'line-through text-gray-500' : ''}>
                                                        {obj.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    {isActive && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Progress</span>
                                                <span>{completedObjectives} / {quest.objectives.length}</span>
                                            </div>
                                            <ProgressBar
                                                value={completedObjectives}
                                                max={quest.objectives.length}
                                                color="success"
                                            />
                                        </div>
                                    )}

                                    {/* Rewards */}
                                    <div className="flex items-center gap-3 text-sm mb-4 p-2 bg-gray-50 rounded">
                                        <span>⭐ {quest.xp_reward} XP</span>
                                        <span>🪙 {quest.coins_reward} coins</span>
                                    </div>

                                    {/* Action Button */}
                                    {isCompleted ? (
                                        <Button variant="secondary" className="w-full" disabled>
                                            ✅ Completed
                                        </Button>
                                    ) : isActive ? (
                                        <Button variant="primary" className="w-full">
                                            Continue Quest
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="w-full">
                                            Start Quest
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
