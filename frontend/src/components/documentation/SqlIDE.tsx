import React, { useState, useEffect } from 'react';
import { TerminalEditor } from '../learning/TerminalEditor';
import type { SQLDialect } from '../../models/types';

interface SqlIDEProps {
    initialCode?: string;
    dialect: SQLDialect;
    onClose?: () => void;
}

export const SqlIDE: React.FC<SqlIDEProps> = ({
    initialCode = '-- Write your SQL query here\nSELECT * FROM users;',
    dialect,
    onClose
}) => {
    const [sqlCode, setSqlCode] = useState(initialCode);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [showResults, setShowResults] = useState(false);

    // Sync with initialCode if it changes from parent
    useEffect(() => {
        if (initialCode) {
            setSqlCode(initialCode);
        }
    }, [initialCode]);

    const handleRunQuery = () => {
        setIsRunning(true);
        setShowResults(true);

        // Simulate query execution
        // In a real app, this would call a backend API or sql.js
        setTimeout(() => {
            // Logic to provide some relevant-ish data if it's a known query
            let rows: any[] = [
                { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99 },
                { id: 2, title: '1984', author: 'George Orwell', price: 12.99 },
                { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.99 },
            ];

            // If the query mentions 'users', show users
            if (sqlCode.toLowerCase().includes('from users')) {
                rows = [
                    { id: 1, name: 'Swapanth', email: 'swapanth@sqltown.dev', role: 'Admin' },
                    { id: 2, name: 'Arjun', email: 'arjun@sqltown.dev', role: 'User' },
                    { id: 3, name: 'Priya', email: 'priya@sqltown.dev', role: 'User' },
                ];
            }

            setResults({
                success: true,
                rows: rows,
                rowCount: rows.length,
                executionTime: (Math.random() * 0.05 + 0.01).toFixed(3) + 's',
            });
            setIsRunning(false);
        }, 800);
    };

    const handleReset = () => {
        setSqlCode(initialCode || '-- Write your SQL query here\nSELECT * FROM users;');
        setResults(null);
        setShowResults(false);
    };

    return (
        <div className="sql-ide-container flex flex-col h-full bg-white border-l border-gray-200  shadow-none">
            <div className="sql-ide-header flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold font-heading">SQL Playground</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                        Reset
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 ">
                <div className="editor-section" >
                    <TerminalEditor
                        value={sqlCode}
                        onChange={setSqlCode}
                        dialect={dialect}
                        onRun={handleRunQuery}
                        isRunning={isRunning}
                        height="300px"
                    />
                </div>

                {showResults && (
                    <div className="results-section animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h4 className="text-md font-bold mb-3 flex items-center gap-2">
                            {results?.success ? (
                                <>
                                    <span className="text-success">✅</span> Result
                                </>
                            ) : (
                                <>
                                    <span className="text-error">❌</span> Error
                                </>
                            )}
                        </h4>

                        {results?.success ? (
                            <div className="space-y-4">
                                <div className="text-sm text-gray-500">
                                    {results.rowCount} rows returned in {results.executionTime}
                                </div>
                                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {Object.keys(results.rows[0] || {}).map((key) => (
                                                    <th
                                                        key={key}
                                                        className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                    >
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {results.rows.map((row: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    {Object.values(row).map((value: any, vidx: number) => (
                                                        <td key={vidx} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
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
                            <div className="p-4 bg-error-light text-error rounded-lg border border-error/20">
                                {results?.error || 'An unexpected error occurred while executing the query.'}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
