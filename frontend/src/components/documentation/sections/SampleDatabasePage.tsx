import React, { useState } from 'react';
import { PageLayout, CodeBlock, DifficultyBadge } from './PageLayout';
import './docs-theme.css';

type Theme = 'dark' | 'light';

const databases = [
  {
    name: 'Sakila',
    emoji: '🎬',
    theme: 'DVD rental store (think: Blockbuster)',
    tables: 16,
    rows: '~47,000 total',
    bestFor: 'JOINs, aggregations, subqueries',
    description: 'A DVD rental store database with films, actors, customers, rentals, payments, stores, and staff. Super realistic. Tons of relationships. Great for practicing everything from basic SELECTs to complex multi-table JOINs.',
    tableList: ['actor', 'film', 'film_actor', 'category', 'film_category', 'inventory', 'rental', 'payment', 'customer', 'address', 'city', 'country', 'staff', 'store', 'language', 'film_text'],
    installCode: `# Step 1: Download
wget https://downloads.mysql.com/docs/sakila-db.tar.gz

# Step 2: Extract
tar -xzf sakila-db.tar.gz
cd sakila-db

# Step 3: Load into MySQL
mysql -u root -p

-- Inside MySQL:
SOURCE sakila-schema.sql;
SOURCE sakila-data.sql;

-- Verify
USE sakila;
SHOW TABLES;`,
    sampleQuery: `-- Top 10 most rented films
SELECT f.title, COUNT(r.rental_id) AS rental_count
FROM film f
JOIN inventory i ON f.film_id = i.film_id
JOIN rental r ON i.inventory_id = r.inventory_id
GROUP BY f.film_id, f.title
ORDER BY rental_count DESC
LIMIT 10;`,
    color: 'var(--accent)',
    colorSoft: 'var(--accent-soft)',
  },
  {
    name: 'World',
    emoji: '🌍',
    theme: 'Countries, cities, and languages',
    tables: 3,
    rows: '~5,000 cities',
    bestFor: 'Basic queries, filtering, sorting',
    description: 'A simple 3-table database containing info about every country, city, and language on Earth. Perfect for absolute beginners — simple structure, real data, immediately understandable.',
    tableList: ['country', 'city', 'countrylanguage'],
    installCode: `# Download
wget https://downloads.mysql.com/docs/world-db.tar.gz
tar -xzf world-db.tar.gz

# Load
mysql -u root -p < world.sql

# Verify
USE world;
SELECT Name, Population FROM country
ORDER BY Population DESC LIMIT 5;`,
    sampleQuery: `-- Most populous cities in each continent
SELECT co.Continent, ci.Name AS city, ci.Population
FROM city ci
JOIN country co ON ci.CountryCode = co.Code
WHERE ci.Population = (
  SELECT MAX(ci2.Population)
  FROM city ci2
  JOIN country co2 ON ci2.CountryCode = co2.Code
  WHERE co2.Continent = co.Continent
)
ORDER BY ci.Population DESC;`,
    color: 'var(--green)',
    colorSoft: 'var(--green-soft)',
  },
  {
    name: 'Employees',
    emoji: '👥',
    theme: 'Corporate HR data',
    tables: 6,
    rows: '~4 million rows',
    bestFor: 'Performance testing, window functions',
    description: 'A large-scale database with employee records, salaries, titles, and departments. Used to test MySQL performance. Great once you\'re comfortable with basics and want to try window functions or optimize slow queries.',
    tableList: ['employees', 'departments', 'dept_emp', 'dept_manager', 'titles', 'salaries'],
    installCode: `# Clone from GitHub
git clone https://github.com/datacharmer/test_db.git
cd test_db

# Load (takes ~30 seconds — it's big)
mysql -u root -p < employees.sql

# Verify
USE employees;
SELECT COUNT(*) FROM employees;
-- Expected: 300,024`,
    sampleQuery: `-- Average salary by department with rank
SELECT d.dept_name,
       AVG(s.salary) AS avg_salary,
       RANK() OVER (ORDER BY AVG(s.salary) DESC) AS salary_rank
FROM departments d
JOIN dept_emp de ON d.dept_no = de.dept_no
JOIN salaries s ON de.emp_no = s.emp_no
WHERE de.to_date = '9999-01-01'
  AND s.to_date = '9999-01-01'
GROUP BY d.dept_name;`,
    color: 'var(--yellow)',
    colorSoft: 'var(--yellow-soft)',
  },
];

const SampleDatabasePage: React.FC<{ initialTheme?: Theme }> = ({ initialTheme = 'dark' }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('docs-theme') as Theme) || initialTheme
  );
  const [activeDb, setActiveDb] = useState(0);
  const [activeTab, setActiveTab] = useState<'install' | 'sample'>('install');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('docs-theme', next);
  };

  const db = databases[activeDb];

  return (
    <PageLayout
      theme={theme}
      onToggleTheme={toggleTheme}
      breadcrumb={{ section: 'getting-started', subsection: 'sample-database' }}
    >
      <div className="section-hero">
        <div className="emoji-badge">
          <span>🎬</span> Getting Started
        </div>
        <h1>Sample Databases</h1>
        <p className="description">
          Practice with real-world data. Learning SQL with actual data is 10× better than dry examples.
        </p>
        <DifficultyBadge level="beginner" />
      </div>

      {/* Why real data */}
      <div className="fun-fact-card">
        <span className="icon">💡</span>
        <div className="text">
          <div className="label">Why This Matters</div>
          There's a huge difference between <code style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>SELECT 1+1</code> and <em>"Find the top 5 customers who rented the most action movies in 2005"</em>. The second query teaches you 10× more — and that's exactly the kind of practice these sample databases give you.
        </div>
      </div>

      {/* Database Selector */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>Choose a Sample Database</h2>
          <div className="subtitle">Pick the one that matches your current skill level.</div>
        </div>
        <div className="doc-card-body" style={{ paddingTop: 0 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', paddingTop: 20 }}>
            {databases.map((d, i) => (
              <button
                key={d.name}
                onClick={() => { setActiveDb(i); setActiveTab('install'); }}
                style={{
                  flex: 1,
                  minWidth: 140,
                  background: activeDb === i ? d.colorSoft : 'var(--bg-secondary)',
                  border: `1px solid ${activeDb === i ? d.color : 'var(--border)'}`,
                  borderRadius: 10,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{d.emoji}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: activeDb === i ? d.color : 'var(--text-primary)' }}>
                  {d.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{d.theme}</div>
              </button>
            ))}
          </div>

          {/* DB Details */}
          <div className="db-showcase-card">
            <div className="db-header">
              <span className="db-icon">{db.emoji}</span>
              <div>
                <div className="db-name">{db.name}</div>
                <div className="db-theme">{db.theme}</div>
              </div>
            </div>

            <div className="db-meta">
              <div className="db-meta-item">
                <span className="meta-label">Tables</span>
                <span className="meta-value">{db.tables}</span>
              </div>
              <div className="db-meta-item">
                <span className="meta-label">Rows</span>
                <span className="meta-value">{db.rows}</span>
              </div>
              <div className="db-meta-item">
                <span className="meta-label">Best For</span>
                <span className="meta-value" style={{ fontSize: 13 }}>{db.bestFor}</span>
              </div>
            </div>

            <p className="db-description">{db.description}</p>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Tables</div>
              <div className="table-pills">
                {db.tableList.map(t => (
                  <span key={t} className="table-pill">{t}</span>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['install', 'sample'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? db.colorSoft : 'var(--bg-secondary)',
                    border: `1px solid ${activeTab === tab ? db.color : 'var(--border)'}`,
                    borderRadius: 6,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: activeTab === tab ? db.color : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab === 'install' ? '📦 Install' : '🔍 Sample Query'}
                </button>
              ))}
            </div>

            <CodeBlock
              language={activeTab === 'install' ? 'bash' : 'sql'}
              code={activeTab === 'install' ? db.installCode : db.sampleQuery}
            />
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="doc-card" style={{ borderColor: 'var(--accent-glow)', background: 'var(--accent-soft)' }}>
        <div className="doc-card-header" style={{ borderColor: 'var(--accent-glow)' }}>
          <h2 style={{ color: 'var(--accent)' }}>🎯 Our Recommendation</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Start with <strong style={{ color: 'var(--text-primary)' }}>World</strong> (it's tiny and easy to understand), then move to <strong style={{ color: 'var(--text-primary)' }}>Sakila</strong> once you know SELECT, WHERE, and ORDER BY. Sakila will be your main practice ground for the next several sections. The <strong style={{ color: 'var(--text-primary)' }}>Employees</strong> database is for when you want to learn window functions and query optimization.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default SampleDatabasePage;
