import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/common';
import { fullLeaderboard } from '../../data/mockLeaderboard';

export const LeaderboardPage: React.FC = () => {
    const topPlayers = fullLeaderboard.slice(0, 100);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-heading font-bold">🏆 Leaderboard</h1>
                    <p className="text-gray-600 mt-1">Top SQL learners in SQLTown</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-6">
                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {topPlayers.slice(0, 3).map((entry, idx) => {
                        const heights = ['h-48', 'h-56', 'h-40'];
                        const medals = ['🥈', '🥇', '🥉'];
                        const colors = ['bg-gray-200', 'bg-yellow-200', 'bg-orange-200'];

                        return (
                            <div key={entry.entry_id} className={`flex flex-col items-center ${idx === 1 ? 'order-first md:order-none' : ''}`}>
                                <div className="text-6xl mb-2">{medals[idx]}</div>
                                <div className="text-center mb-3">
                                    <div className="font-bold text-lg">{entry.user.username}</div>
                                    <div className="text-sm text-gray-600">Level {entry.user.level}</div>
                                    <div className="text-sm font-bold text-primary">{entry.score.toLocaleString()} XP</div>
                                </div>
                                <div className={`${heights[idx]} ${colors[idx]} w-full rounded-t-lg flex items-center justify-center text-4xl font-bold`}>
                                    #{entry.rank_position}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Leaderboard Table */}
                <Card>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rank</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Player</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Level</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Score</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Dialect</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {topPlayers.slice(3, 50).map((entry) => (
                                        <tr key={entry.entry_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="font-bold text-gray-700">#{entry.rank_position}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                                        {entry.user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{entry.user.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-primary font-bold">{entry.user.level}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-bold">{entry.score.toLocaleString()}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-600 uppercase">{entry.dialect}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
