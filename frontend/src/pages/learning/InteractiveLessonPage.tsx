import React, { useState } from 'react';
import type { Lesson, SQLDialect } from '../../models/types';
import { TerminalEditor } from '../../components/learning/TerminalEditor';
import { Button, Card, Badge } from '../../components/common';

interface InteractiveLessonPageProps {
    lesson: Lesson;
    dialect: SQLDialect;
    onComplete?: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
}

export const InteractiveLessonPage: React.FC<InteractiveLessonPageProps> = ({
    lesson,
    dialect,
    onComplete,
    onNext,
    onPrevious,
}) => {
    const [sqlCode, setSqlCode] = useState('-- Write your SQL query here\nSELECT * FROM users;');
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [showResults, setShowResults] = useState(false);

    const handleRunQuery = () => {
        setIsRunning(true);
        setShowResults(true);

        // Simulate query execution
        setTimeout(() => {
            setResults({
                success: true,
                rows: [
                    { id: 1, name: 'Swapanth', email: 'swapanth@sqltown.dev' },
                    { id: 2, name: 'Arjun', email: 'arjun@sqltown.dev' },
                    { id: 3, name: 'Priya', email: 'priya@sqltown.dev' },
                ],
                rowCount: 3,
                executionTime: '0.023s',
            });
            setIsRunning(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-heading font-bold">{lesson.lesson_title}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <Badge variant="info">{lesson.lesson_type}</Badge>
                            <span className="text-sm text-gray-600">⏱️ {lesson.estimated_minutes} min</span>
                            <span className="text-sm text-gray-600">⭐ {lesson.xp_reward} XP</span>
                            <span className="text-sm text-gray-600">🪙 {lesson.coins_reward} coins</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {onPrevious && (
                            <Button variant="outline" onClick={onPrevious}>
                                ← Previous
                            </Button>
                        )}
                        {onNext && (
                            <Button onClick={onNext}>
                                Next →
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="max-w-7xl mx-auto p-6">
                <Card>
                    <div className="prose max-w-none">
                        {lesson.content ? (
                            <div dangerouslySetInnerHTML={{ __html: lesson.content.content_text.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <div>
                                <h2>Lesson Content</h2>
                                <p>{lesson.description}</p>
                                <p>This is where the lesson content would be displayed with markdown rendering, code examples, and interactive elements.</p>
                            </div>
                        )}
                    </div>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
                    {/* Left Side: Lesson Content + Terminal */}
                    <div className="space-y-6">
                        {/* Lesson Content */}


                        {/* Terminal Editor */}
                        <div>
                            <TerminalEditor
                                value={sqlCode}
                                onChange={setSqlCode}
                                dialect={dialect}
                                onRun={handleRunQuery}
                                isRunning={isRunning}
                                height="250px"
                            />
                        </div>


                    </div>
                    {/* Results Display */}
                    {showResults && results && (
                        <Card className='space-y-6'>
                            <h3 className="text-lg font-heading font-bold mb-3">
                                {results.success ? '✅ Query Results' : '❌ Error'}
                            </h3>
                            {results.success ? (
                                <div>
                                    <div className="mb-3 text-sm text-gray-600">
                                        {results.rowCount} rows returned in {results.executionTime}
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {Object.keys(results.rows[0] || {}).map((key) => (
                                                        <th
                                                            key={key}
                                                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            {key}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {results.rows.map((row: any, idx: number) => (
                                                    <tr key={idx}>
                                                        {Object.values(row).map((value: any, vidx: number) => (
                                                            <td key={vidx} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                                {String(value)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-error">{results.error}</div>
                            )}
                        </Card>
                    )}

                    {/* Complete Lesson Button */}
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={onComplete}
                    >
                        🎉 Complete Lesson (+{lesson.xp_reward} XP, +{lesson.coins_reward} coins)
                    </Button>
                </div>
            </div>
        </div>
    );
};
