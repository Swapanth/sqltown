import React, { useState, useCallback } from 'react';
import './docs-theme.css';

interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumb: { section: string; subsection: string };
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  breadcrumb,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="page-wrapper" data-theme={theme}>
      <header className="page-header">
        <div className="breadcrumb">
          <span>mysql</span>
          <span className="sep">/</span>
          <span>{breadcrumb.section}</span>
          <span className="sep">/</span>
          <span className="active">{breadcrumb.subsection}</span>
        </div>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
      </header>
      <main className="page-content">
        {children}
      </main>
    </div>
  );
};

// ─── Shared sub-components ───────────────────────────────────────────────────

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'sql' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="lang-badge">{language}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
};

interface FunFactProps {
  text: string;
}

export const FunFact: React.FC<FunFactProps> = ({ text }) => (
  <div className="fun-fact-card">
    <span className="icon">⚡</span>
    <div className="text">
      <div className="label">Fun Fact</div>
      {text}
    </div>
  </div>
);

interface DifficultyBadgeProps {
  level: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ level }) => {
  const labels: Record<string, string> = {
    'absolute-beginner': '● Absolute Beginner',
    'beginner': '● Beginner',
    'intermediate': '● Intermediate',
    'advanced': '● Advanced',
  };
  return (
    <div className={`difficulty-badge ${level}`}>
      {labels[level] || level}
    </div>
  );
};
