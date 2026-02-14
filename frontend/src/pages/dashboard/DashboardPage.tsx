import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressBar } from '../../components/common';
import { CityVisualization } from '../../components/game/CityVisualization';
import { currentUser } from '../../data/mockUsers';
import { currentUserCity } from '../../data/mockCities';
import { mockUserQuests } from '../../data/mockQuests';
import { mockUserAchievements } from '../../data/mockAchievements';

export const DashboardPage: React.FC = () => {
    const activeQuests = mockUserQuests.filter(q => q.status === 'in_progress');
    const recentAchievements = mockUserAchievements.slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-heading font-bold">
                        Welcome back, {currentUser.full_name}! 👋
                    </h1>
                    <p className="text-gray-600 mt-1">Continue building your sacred SQL city</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats & Progress */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Level & XP Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <div className="text-5xl font-bold text-primary mb-2">
                                        {currentUserCity.city_level}
                                    </div>
                                    <div className="text-gray-600">City Level</div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>XP to Next Level</span>
                                            <span>{currentUserCity.total_xp % 1000} / 1000</span>
                                        </div>
                                        <ProgressBar
                                            value={currentUserCity.total_xp % 1000}
                                            max={1000}
                                            color="primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-warning">🪙 {currentUserCity.total_coins}</div>
                                            <div className="text-sm text-gray-600">Coins</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">⭐ {currentUserCity.total_xp}</div>
                                            <div className="text-sm text-gray-600">Total XP</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Quests */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Quests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activeQuests.length > 0 ? (
                                    <div className="space-y-3">
                                        {activeQuests.map((userQuest) => (
                                            <div key={userQuest.user_quest_id} className="p-3 bg-gray-50 rounded-lg">
                                                <div className="font-medium mb-1">{userQuest.quest.quest_title}</div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    {userQuest.quest.objectives.filter(o => o.done).length} / {userQuest.quest.objectives.length} objectives
                                                </div>
                                                <ProgressBar
                                                    value={userQuest.quest.objectives.filter(o => o.done).length}
                                                    max={userQuest.quest.objectives.length}
                                                    color="success"
                                                />
                                            </div>
                                        ))}
                                        <Link to="/quests">
                                            <Button variant="outline" className="w-full">
                                                View All Quests
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        No active quests
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Achievements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Achievements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {recentAchievements.map((ua) => (
                                        <div key={ua.unlock_id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                            <div className="text-3xl">{ua.achievement.emoji}</div>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{ua.achievement.display_title}</div>
                                                <div className="text-xs text-gray-600">{ua.achievement.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - City & Quick Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* City Visualization */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Your City: {currentUserCity.city_name}</CardTitle>
                                    <Link to="/city">
                                        <Button variant="outline" size="sm">
                                            Manage City
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CityVisualization
                                    city={currentUserCity}
                                    animated={true}
                                    interactive={false}
                                    compact={false}
                                />
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link to="/learning">
                                <Card hover className="h-full">
                                    <CardContent className="flex items-center gap-4">
                                        <div className="text-5xl">📚</div>
                                        <div>
                                            <h3 className="font-heading font-bold text-lg">Continue Learning</h3>
                                            <p className="text-sm text-gray-600">Resume your SQL journey</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link to="/quests">
                                <Card hover className="h-full">
                                    <CardContent className="flex items-center gap-4">
                                        <div className="text-5xl">🎯</div>
                                        <div>
                                            <h3 className="font-heading font-bold text-lg">View Quests</h3>
                                            <p className="text-sm text-gray-600">{activeQuests.length} active quests</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link to="/leaderboard">
                                <Card hover className="h-full">
                                    <CardContent className="flex items-center gap-4">
                                        <div className="text-5xl">🏆</div>
                                        <div>
                                            <h3 className="font-heading font-bold text-lg">Leaderboard</h3>
                                            <p className="text-sm text-gray-600">See top players</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link to="/explore">
                                <Card hover className="h-full">
                                    <CardContent className="flex items-center gap-4">
                                        <div className="text-5xl">🌍</div>
                                        <div>
                                            <h3 className="font-heading font-bold text-lg">Explore Cities</h3>
                                            <p className="text-sm text-gray-600">Visit other players' cities</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
