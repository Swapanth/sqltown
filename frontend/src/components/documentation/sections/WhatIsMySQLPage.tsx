import React, { useState } from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import './docs-theme.css';

type Theme = 'dark' | 'light';

interface WhatIsMySQLPageProps {
  initialTheme?: Theme;
}

const concepts = [
  {
    term: 'Database',
    emoji: '🏢',
    simple: 'A named container that holds all your tables. Like a folder.',
    example: "Your app might have one database called 'shopify_store'",
  },
  {
    term: 'Table',
    emoji: '📋',
    simple: 'A grid of rows and columns, like one sheet in Excel.',
    example: 'users, orders, products are all tables',
  },
  {
    term: 'Row',
    emoji: '↔️',
    simple: 'One record/entry in a table.',
    example: 'One specific user: id=1, name="Alice"',
  },
  {
    term: 'Column',
    emoji: '↕️',
    simple: 'A field/attribute that every row has.',
    example: 'id, name, email, created_at',
  },
  {
    term: 'Query',
    emoji: '❓',
    simple: 'A question/command you send to the database.',
    example: 'SELECT * FROM users WHERE active = 1',
  },
];

const WhatIsMySQLPage: React.FC<WhatIsMySQLPageProps> = ({ initialTheme = 'dark' }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('docs-theme') as Theme) || initialTheme
  );

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('docs-theme', next);
  };

  return (
    <PageLayout
      theme={theme}
      onToggleTheme={toggleTheme}
      breadcrumb={{ section: 'getting-started', subsection: 'what-is-mysql' }}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>🤔</span> Getting Started
        </div>
        <h1>What Even IS MySQL?</h1>
        <p className="description">
          Understand databases before you touch a single line of SQL.
        </p>
        <DifficultyBadge level="absolute-beginner" />
      </div>

      <FunFact text="MySQL powers Facebook, Twitter, YouTube, and Wikipedia. Yes, the same MySQL you're about to learn. You're basically becoming a tech giant." />

      {/* Analogy Card */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>Think of MySQL Like This…</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Imagine a massive Excel spreadsheet — but instead of crashing when you add row 10,001,
            it handles billions of rows without breaking a sweat. That's a database. MySQL is the
            software that manages those spreadsheets (called "tables"), lets you search them in
            milliseconds, and keeps your data safe. It's Excel's jacked, professional older sibling.
          </p>

          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>Excel 😐</h3>
              <ul>
                <li>Crashes at ~1 million rows</li>
                <li>One user at a time</li>
                <li>No access control</li>
                <li>Manual saves</li>
                <li>Formulas get messy fast</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>MySQL 💪</h3>
              <ul>
                <li>Handles billions of rows</li>
                <li>Thousands of simultaneous users</li>
                <li>Granular permissions per user</li>
                <li>Automatic ACID transactions</li>
                <li>SQL is clean and powerful</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Key Vocabulary */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>Key Vocabulary (Learn These 5 Words)</h2>
          <div className="subtitle">Before you write any SQL, get comfortable with this vocabulary.</div>
        </div>
        <div className="doc-card-body">
          <div className="concept-grid">
            {concepts.map(c => (
              <div className="concept-card" key={c.term}>
                <div className="term-header">
                  <span className="term-emoji">{c.emoji}</span>
                  <span className="term-name">{c.term}</span>
                </div>
                <div className="simple">{c.simple}</div>
                <div className="example">{c.example}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* First Query Preview */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>Your First Taste of SQL</h2>
          <div className="subtitle">Don't worry about understanding this yet — just notice how readable it is.</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SQL (Structured Query Language) is the language you use to talk to MySQL. The beautiful
            thing? It reads almost like English.
          </p>
          <CodeBlock language="sql" code={`-- Get all users from India who signed up in 2024
SELECT name, email, created_at
FROM users
WHERE country = 'India'
  AND YEAR(created_at) = 2024
ORDER BY created_at DESC
LIMIT 10;`} />
          <p className="prose" style={{ marginTop: 0 }}>
            Even if you've never seen SQL before, you can roughly read that: "Give me the name,
            email, and join date of users from India who signed up in 2024, newest first, show me
            10." That's the beauty of SQL.
          </p>
        </div>
      </div>

      {/* Why MySQL over alternatives */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>Why MySQL and Not Something Else?</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            There are dozens of database systems. MySQL wins for beginners because it's free,
            runs on everything, has massive community support, and the skills transfer directly
            to PostgreSQL, MariaDB, SQLite, and others. Once you learn MySQL, you can pick up
            any relational database in days.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Free & Open Source', icon: '✅', note: 'Zero cost, forever.' },
              { label: 'Runs Everywhere', icon: '✅', note: 'Mac, Windows, Linux, Docker, cloud.' },
              { label: 'Huge Community', icon: '✅', note: 'Stack Overflow answers for every error you\'ll hit.' },
              { label: 'Industry Standard', icon: '✅', note: 'Used by FAANG, startups, and everyone between.' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: 'var(--bg-secondary)',
                borderRadius: 8,
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WhatIsMySQLPage;
