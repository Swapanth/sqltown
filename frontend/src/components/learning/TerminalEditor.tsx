import React from 'react';
import Editor from '@monaco-editor/react';
import type { SQLDialect } from '../../models/types';
import { Button } from '../common';

interface TerminalEditorProps {
    value: string;
    onChange: (value: string) => void;
    dialect: SQLDialect;
    onRun: () => void;
    readOnly?: boolean;
    height?: string;
    isRunning?: boolean;
}

export const TerminalEditor: React.FC<TerminalEditorProps> = ({
    value,
    onChange,
    dialect,
    onRun,
    readOnly = false,
    height = '300px',
    isRunning = false,
}) => {
    const handleEditorChange = (value: string | undefined) => {
        onChange(value || '');
    };

    const handleEditorMount = () => {
        // Editor is ready - can be used for future functionality
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+Enter or Cmd+Enter to run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            onRun();
        }
    };

    return (
        <div className="terminal rounded-lg overflow-hidden  shadow-none" >
            {/* Terminal Header */}
            <div className="terminal-header">
                <div className="flex items-center gap-2">
                    <div className="terminal-button terminal-button-red"></div>
                    <div className="terminal-button terminal-button-yellow"></div>
                    <div className="terminal-button terminal-button-green"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-400">
                    {dialect.toUpperCase()} Terminal
                </div>
                <Button
                    size="sm"
                    onClick={onRun}
                    disabled={readOnly || isRunning}
                    isLoading={isRunning}
                    className="!bg-success hover:!bg-green-600"
                >
                    ▶ Run
                </Button>
            </div>

            {/* Editor */}
            <div onKeyDown={handleKeyDown}>
                <Editor
                    height={height}
                    defaultLanguage="sql"
                    value={value}
                    onChange={handleEditorChange}
                    onMount={handleEditorMount}
                    theme="vs-dark"
                    options={{
                        readOnly,
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, monospace',
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                    }}
                />
            </div>

            {/* Hint */}
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-terminal-border">
                💡 Press <kbd className="px-2 py-1 bg-gray-800 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-800 rounded">Enter</kbd> to run
            </div>
        </div>
    );
};
