import React, { useState } from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import './docs-theme.css';

type Theme = 'dark' | 'light';

const whereOperators = [
  { op: '=', name: 'Equals', example: "WHERE country = 'India'", note: 'Case-insensitive for strings in MySQL by default' },
  { op: '!= or <>', name: 'Not Equals', example: "WHERE status != 'cancelled'", note: 'Both work. != is more common in modern SQL.' },
  { op: '> < >= <=', name: 'Comparisons', example: 'WHERE price > 100 AND price <= 500', note: 'Works on numbers, dates, strings.' },
  { op: 'BETWEEN', name: 'Range Check', example: 'WHERE price BETWEEN 50 AND 200', note: 'Inclusive! BETWEEN 50 AND 200 includes 50 and 200.' },
  { op: 'IN', name: 'Match One of a List', example: "WHERE country IN ('India', 'US', 'UK')", note: 'Cleaner than writing multiple OR conditions.' },
  { op: 'NOT IN', name: 'Exclude a List', example: "WHERE status NOT IN ('cancelled', 'refunded')", note: 'Watch out for NULLs — they behave unexpectedly with NOT IN.' },
  { op: 'LIKE', name: 'Pattern Match', example: "WHERE name LIKE 'Ali%'", note: '% matches any sequence, _ matches one character.' },
  { op: 'IS NULL', name: 'Check for Null', example: 'WHERE deleted_at IS NULL', note: 'Never use = NULL. It always returns false.' },
  { op: 'IS NOT NULL', name: 'Check Not Null', example: 'WHERE email IS NOT NULL', note: 'Standard way to filter out missing data.' },
];

const advancedExamples = [
  {
    title: 'Combine multiple conditions',
    code: `SELECT * FROM orders
WHERE status = 'active'
  AND amount > 500
  AND created_at >= '2024-01-01';`,
  },
  {
    title: 'OR with parentheses (order matters!)',
    code: `-- Find premium users OR enterprise accounts from India
SELECT * FROM users
WHERE (plan = 'premium' OR account_type = 'enterprise')
  AND country = 'India';`,
  },
  {
    title: 'ORDER BY — multiple columns',
    code: `SELECT name, country, plan, created_at
FROM users
ORDER BY
  country ASC,    -- Sort by country first
  plan DESC,      -- Then by plan tier
  created_at DESC -- Newest within each group
LIMIT 50;`,
  },
  {
    title: 'DISTINCT — remove duplicates',
    code: `-- List every unique country in your user base
SELECT DISTINCT country
FROM users
ORDER BY country;

-- Count unique countries
SELECT COUNT(DISTINCT country) AS country_count
FROM users;`,
  },
  {
    title: 'LIMIT + OFFSET — pagination',
    code: `-- Page 1: rows 1-10
SELECT * FROM products
ORDER BY name
LIMIT 10 OFFSET 0;

-- Page 2: rows 11-20
SELECT * FROM products
ORDER BY name
LIMIT 10 OFFSET 10;

-- Page N: OFFSET = (page - 1) * pageSize`,
  },
];

const likePatterns = [
  { pattern: "LIKE 'Ali%'", matches: 'Alice, Ali, Alibaba', doesntMatch: 'ali (case-sensitive on some configs)' },
  { pattern: "LIKE '%smith'", matches: 'Smith, Goldsmith, Blacksmith', doesntMatch: 'smithy' },
  { pattern: "LIKE '%ali%'", matches: 'Alice, Ali, California', doesntMatch: 'nothing with ali in it' },
  { pattern: "LIKE 'A__'", matches: 'Ali, Abe (3 chars starting with A)', doesntMatch: 'Alice, Al' },
];

const FilteringSortingPage: React.FC<{ initialTheme?: Theme }> = ({ initialTheme = 'dark' }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('docs-theme') as Theme) || initialTheme
  );
  const [activeExample, setActiveExample] = useState(0);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('docs-theme', next);
  };

  return (
    <PageLayout
      theme={theme}
      onToggleTheme={toggleTheme}
      breadcrumb={{ section: 'mysql-basics', subsection: 'filtering-sorting' }}
    >
      <div className="section-hero">
        <div className="emoji-badge">
          <span>🔍</span> MySQL Basics
        </div>
        <h1>Filtering & Sorting</h1>
        <p className="description">
          Learn to slice, dice, sort, and filter your data. This is where SQL starts to feel like a superpower.
        </p>
        <DifficultyBadge level="beginner" />
      </div>

      <FunFact text="The WHERE clause is older than the internet. SQL was invented in 1974. The internet became public in 1993. SQL has been filtering data since before most of us were born." />

      {/* Intro */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>The Art of Finding Exactly What You Need</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            A database with no filtering is like a library with no catalog — technically everything is there, but good luck finding anything. WHERE, ORDER BY, LIMIT, and DISTINCT are how you transform "give me all 10 million rows" into "give me exactly the 15 rows I care about, in the order I want them."
          </p>
        </div>
      </div>

      {/* WHERE Operators */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>WHERE Clause — The Filter Master</h2>
          <div className="subtitle">WHERE lets you ask: "But only give me rows that match THIS condition."</div>
        </div>
        <div className="doc-card-body" style={{ padding: 0 }}>
          {whereOperators.map((op, i) => (
            <div
              key={op.op}
              className="operator-row"
              style={{ borderBottom: i < whereOperators.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <div className="op-badge">{op.op}</div>
              <div className="op-details">
                <div className="op-name">{op.name}</div>
                <div className="op-example-code">{op.example}</div>
                <div className="op-note">{op.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIKE Patterns */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>LIKE — Pattern Matching Deep Dive</h2>
          <div className="subtitle">Two wildcards. Infinite possibilities.</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            LIKE searches for a pattern rather than an exact match. Two wildcards: <code style={{ fontFamily: 'JetBrains Mono', fontSize: 12, background: 'var(--code-bg)', padding: '2px 6px', borderRadius: 4 }}>%</code> (any sequence of characters) and <code style={{ fontFamily: 'JetBrains Mono', fontSize: 12, background: 'var(--code-bg)', padding: '2px 6px', borderRadius: 4 }}>_</code> (exactly one character).
          </p>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pattern</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Matches</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Doesn't Match</th>
                </tr>
              </thead>
              <tbody>
                {likePatterns.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: 12 }}>{row.pattern}</td>
                    <td style={{ padding: '12px', color: 'var(--green)' }}>{row.matches}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{row.doesntMatch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Advanced Examples */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>Advanced Filtering Patterns</h2>
          <div className="subtitle">Combining multiple clauses for powerful queries.</div>
        </div>
        <div className="doc-card-body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {advancedExamples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                style={{
                  background: activeExample === i ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                  border: `1px solid ${activeExample === i ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: activeExample === i ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
              >
                {ex.title}
              </button>
            ))}
          </div>
          <CodeBlock language="sql" code={advancedExamples[activeExample].code} />
        </div>
      </div>

      {/* NULL Gotchas */}
      <div className="doc-card" style={{ borderColor: 'rgba(248,113,113,0.3)' }}>
        <div className="doc-card-header" style={{ borderColor: 'rgba(248,113,113,0.2)' }}>
          <h2>⚠️ NULL Gotchas</h2>
          <div className="subtitle">NULL is not zero. NULL is not empty string. NULL is "unknown."</div>
        </div>
        <div className="doc-card-body">
          <CodeBlock language="sql" code={`-- ❌ WRONG: This always returns 0 rows (NULL != NULL)
SELECT * FROM users WHERE email = NULL;

-- ✅ RIGHT: Use IS NULL
SELECT * FROM users WHERE email IS NULL;

-- ❌ WRONG: NOT IN with NULLs breaks everything
SELECT * FROM users WHERE country NOT IN ('US', NULL);
-- Returns 0 rows! MySQL can't compare anything to NULL.

-- ✅ RIGHT: Filter out NULLs explicitly
SELECT * FROM users
WHERE country NOT IN ('US')
  AND country IS NOT NULL;`} />
        </div>
      </div>

      {/* ORDER BY reference */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>ORDER BY Cheatsheet</h2>
        </div>
        <div className="doc-card-body" style={{ padding: 0 }}>
          {[
            { code: 'ORDER BY name ASC', note: 'A → Z (default, ASC is optional)' },
            { code: 'ORDER BY name DESC', note: 'Z → A' },
            { code: 'ORDER BY created_at DESC', note: 'Newest first' },
            { code: 'ORDER BY price ASC, name ASC', note: 'Sort by price, then name within same price' },
            { code: 'ORDER BY 2', note: 'Sort by 2nd column in SELECT (bad practice, avoid)' },
            { code: 'ORDER BY RAND()', note: 'Random order (slow on big tables)' },
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              padding: '14px 24px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <code style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                color: 'var(--cyan)',
                whiteSpace: 'nowrap',
                minWidth: 200,
              }}>
                {item.code}
              </code>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.note}</span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default FilteringSortingPage;
