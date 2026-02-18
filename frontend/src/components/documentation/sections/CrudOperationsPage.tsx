import React, { useState } from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import './docs-theme.css';

type Theme = 'dark' | 'light';
type ActiveOp = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';

const operations = [
  {
    sql: 'SELECT',
    crud: 'Read',
    emoji: '👁️',
    color: '#22d3ee',
    colorSoft: 'rgba(34,211,238,0.12)',
    example: 'Show me all users from India',
    tagline: 'The Art of Asking Questions',
    description: 'SELECT is the most important SQL command. It retrieves data from one or more tables. You\'ll write SELECT in literally 80% of all your queries.',
    basicSyntax: `SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column ASC|DESC
LIMIT number;`,
    examples: [
      {
        label: 'Select all columns',
        code: `-- The asterisk (*) means "all columns"
SELECT * FROM users;`,
      },
      {
        label: 'Select specific columns',
        code: `SELECT name, email, created_at
FROM users;`,
      },
      {
        label: 'With filtering',
        code: `SELECT name, email
FROM users
WHERE country = 'India'
ORDER BY name ASC
LIMIT 25;`,
      },
      {
        label: 'Alias columns',
        code: `SELECT
  name AS full_name,
  email AS contact,
  YEAR(created_at) AS join_year
FROM users;`,
      },
    ],
  },
  {
    sql: 'INSERT',
    crud: 'Create',
    emoji: '➕',
    color: '#4ade80',
    colorSoft: 'rgba(74,222,128,0.12)',
    example: 'Add a new user to the database',
    tagline: 'Adding New Records',
    description: 'INSERT adds new rows to a table. You can insert one row or many rows in a single statement.',
    basicSyntax: `INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);`,
    examples: [
      {
        label: 'Insert one row',
        code: `INSERT INTO users (name, email, country, created_at)
VALUES ('Alice Johnson', 'alice@example.com', 'India', NOW());`,
      },
      {
        label: 'Insert multiple rows',
        code: `INSERT INTO users (name, email, country)
VALUES
  ('Bob Smith', 'bob@example.com', 'US'),
  ('Carol White', 'carol@example.com', 'UK'),
  ('Dave Brown', 'dave@example.com', 'Australia');`,
      },
      {
        label: 'Insert from another table',
        code: `-- Copy active users to an archive table
INSERT INTO users_archive
SELECT * FROM users
WHERE status = 'inactive'
  AND last_login < DATE_SUB(NOW(), INTERVAL 1 YEAR);`,
      },
    ],
  },
  {
    sql: 'UPDATE',
    crud: 'Update',
    emoji: '✏️',
    color: '#fbbf24',
    colorSoft: 'rgba(251,191,36,0.12)',
    example: "Change Alice's email address",
    tagline: 'Modifying Existing Data',
    description: "UPDATE modifies existing rows. ALWAYS use a WHERE clause — without it, you'll update EVERY row in the table.",
    basicSyntax: `UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;`,
    examples: [
      {
        label: 'Update one record',
        code: `UPDATE users
SET email = 'alice.new@example.com'
WHERE id = 1;`,
      },
      {
        label: 'Update multiple columns',
        code: `UPDATE users
SET
  email = 'alice@newdomain.com',
  country = 'Canada',
  updated_at = NOW()
WHERE id = 1;`,
      },
      {
        label: 'Update multiple rows',
        code: `-- Deactivate users who haven't logged in for 2 years
UPDATE users
SET status = 'inactive'
WHERE last_login < DATE_SUB(NOW(), INTERVAL 2 YEAR)
  AND status = 'active';`,
      },
      {
        label: '⚠️ The Dangerous Version (no WHERE)',
        code: `-- THIS UPDATES EVERY ROW. NEVER DO THIS ACCIDENTALLY.
UPDATE users SET status = 'inactive';

-- Always confirm with SELECT first:
SELECT COUNT(*) FROM users WHERE last_login < '2022-01-01';
-- Then update with the same WHERE clause.`,
      },
    ],
  },
  {
    sql: 'DELETE',
    crud: 'Delete',
    emoji: '🗑️',
    color: '#f87171',
    colorSoft: 'rgba(248,113,113,0.12)',
    example: 'Remove all cancelled orders',
    tagline: 'Removing Records',
    description: 'DELETE removes rows from a table. Like UPDATE, always use WHERE. Unlike dropping a table, DELETE is row-by-row and can be rolled back inside a transaction.',
    basicSyntax: `DELETE FROM table_name
WHERE condition;`,
    examples: [
      {
        label: 'Delete one record',
        code: `DELETE FROM users WHERE id = 42;`,
      },
      {
        label: 'Delete with conditions',
        code: `-- Remove cancelled orders older than 6 months
DELETE FROM orders
WHERE status = 'cancelled'
  AND created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);`,
      },
      {
        label: 'Safe delete pattern',
        code: `-- Step 1: See what you're about to delete
SELECT * FROM orders
WHERE status = 'cancelled'
  AND created_at < '2023-01-01';

-- Step 2: If it looks right, delete
DELETE FROM orders
WHERE status = 'cancelled'
  AND created_at < '2023-01-01';`,
      },
      {
        label: 'Truncate vs Delete',
        code: `-- DELETE: slow, row-by-row, can rollback
DELETE FROM logs;

-- TRUNCATE: fast, drops all rows instantly, can't rollback
TRUNCATE TABLE logs;

-- Use TRUNCATE only when you're SURE you want everything gone.`,
      },
    ],
  },
];

const CrudOperationsPage: React.FC<{ initialTheme?: Theme }> = ({ initialTheme = 'dark' }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('docs-theme') as Theme) || initialTheme
  );
  const [activeOp, setActiveOp] = useState<ActiveOp>('SELECT');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('docs-theme', next);
  };

  const op = operations.find(o => o.sql === activeOp)!;

  return (
    <PageLayout
      theme={theme}
      onToggleTheme={toggleTheme}
      breadcrumb={{ section: 'mysql-basics', subsection: 'sql-statements' }}
    >
      <div className="section-hero">
        <div className="emoji-badge">
          <span>✍️</span> MySQL Basics
        </div>
        <h1>CRUD Operations</h1>
        <p className="description">
          The four fundamental database operations: Create, Read, Update, Delete. Master these and you can build literally anything.
        </p>
        <DifficultyBadge level="beginner" />
      </div>

      <FunFact text="80% of all SQL queries in production applications are SELECT statements. You'll spend most of your life reading data, not writing it." />

      {/* CRUD Map */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>What is CRUD?</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Every app you've ever used does four things with data: creates it, reads it, updates it, and deletes it. Instagram lets you post (CREATE), scroll (READ), edit captions (UPDATE), and delete photos (DELETE). In SQL, these operations are INSERT, SELECT, UPDATE, and DELETE.
          </p>
          <div className="crud-ops-grid">
            {operations.map(o => (
              <button
                key={o.sql}
                className="crud-op-card"
                onClick={() => setActiveOp(o.sql as ActiveOp)}
                style={{
                  background: activeOp === o.sql ? o.colorSoft : 'var(--bg-card)',
                  borderColor: activeOp === o.sql ? o.color : 'var(--border)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span className="op-emoji">{o.emoji}</span>
                <span className="op-sql" style={{ color: o.color }}>{o.sql}</span>
                <span className="op-crud" style={{ color: o.color }}>{o.crud}</span>
                <span className="op-example">{o.example}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Operation Deep Dive */}
      <div className="doc-card" style={{ borderColor: op.colorSoft }}>
        <div className="doc-card-header" style={{ borderColor: `${op.color}30` }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{op.emoji}</span>
            <span>{op.sql} — {op.tagline}</span>
          </h2>
          <div className="subtitle">{op.description}</div>
        </div>
        <div className="doc-card-body">
          <div style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            marginBottom: 8,
          }}>
            Basic Syntax
          </div>
          <CodeBlock language="sql" code={op.basicSyntax} />

          <div className="section-divider" style={{ margin: '24px 0' }} />

          <div style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            marginBottom: 16,
          }}>
            Examples
          </div>

          {op.examples.map((ex, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: op.colorSoft,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: op.color,
                }}>
                  {i + 1}
                </span>
                {ex.label}
              </div>
              <CodeBlock language="sql" code={ex.code} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>⚡ Quick Reference</h2>
        </div>
        <div className="doc-card-body" style={{ padding: 0 }}>
          {operations.map((o, i) => (
            <div key={o.sql} style={{
              display: 'flex',
              gap: 16,
              padding: '14px 24px',
              borderBottom: i < operations.length - 1 ? '1px solid var(--border)' : 'none',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
                fontSize: 13,
                padding: '4px 10px',
                borderRadius: 6,
                background: o.colorSoft,
                color: o.color,
                minWidth: 70,
                textAlign: 'center',
              }}>
                {o.sql}
              </span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                {o.example}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default CrudOperationsPage;
