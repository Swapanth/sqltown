import React, { useState } from 'react';
import { PageLayout, CodeBlock, DifficultyBadge } from './PageLayout';
import './docs-theme.css';

type Theme = 'dark' | 'light';

const issues = [
  {
    problem: "ERROR 2002 (HY000): Can't connect to local MySQL server through socket",
    cause: "MySQL isn't running",
    fixes: [
      { platform: 'macOS', code: 'brew services start mysql', lang: 'bash' },
      { platform: 'Linux', code: 'sudo systemctl start mysql', lang: 'bash' },
      { platform: 'Windows', code: 'Open Services → Find MySQL80 → Start it', lang: 'text' },
    ],
  },
  {
    problem: "ERROR 1045 (28000): Access denied for user 'root'@'localhost'",
    cause: "Wrong password",
    fixes: [
      {
        platform: 'All platforms',
        code: `-- 1. Stop MySQL
-- 2. Start with: mysqld --skip-grant-tables
-- 3. Login: mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
-- 4. Restart normally`,
        lang: 'sql',
      },
    ],
  },
  {
    problem: "Port 3306 already in use",
    cause: "Another MySQL instance (or other app) is running on 3306",
    fixes: [
      {
        platform: 'macOS/Linux',
        code: `lsof -i :3306
# Find the PID, then:
kill -9 <PID>`,
        lang: 'bash',
      },
      {
        platform: 'Windows',
        code: `netstat -ano | findstr 3306
# Note the PID, then in Task Manager: End Task`,
        lang: 'powershell',
      },
    ],
  },
  {
    problem: "'mysql' command not found",
    cause: "MySQL binaries aren't in your PATH",
    fixes: [
      {
        platform: 'macOS',
        code: `echo 'export PATH="/usr/local/mysql/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc`,
        lang: 'bash',
      },
      {
        platform: 'Linux',
        code: `sudo ln -s /usr/bin/mysql /usr/local/bin/mysql`,
        lang: 'bash',
      },
      {
        platform: 'Windows',
        code: `# Add to System PATH:
C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin`,
        lang: 'text',
      },
    ],
  },
];

const mysqlFiles = [
  {
    path: '/var/lib/mysql (Linux) or /usr/local/var/mysql (macOS)',
    label: 'Data Directory',
    note: 'Where all your databases live as files on disk.',
    icon: '🗄️',
  },
  {
    path: '/etc/mysql/my.cnf (Linux) or /usr/local/etc/my.cnf (macOS)',
    label: 'Config File',
    note: 'MySQL configuration: port, buffer sizes, logging, etc.',
    icon: '⚙️',
  },
  {
    path: '/var/log/mysql/error.log (Linux)',
    label: 'Error Log',
    note: 'First place to look when something breaks.',
    icon: '📋',
  },
  {
    path: '/tmp/mysql.sock (macOS/Linux)',
    label: 'Socket File',
    note: 'How local connections talk to MySQL. If missing → ERROR 2002.',
    icon: '🔌',
  },
];

const InstallationPage: React.FC<{ initialTheme?: Theme }> = ({ initialTheme = 'dark' }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('docs-theme') as Theme) || initialTheme
  );
  const [openIssue, setOpenIssue] = useState<number | null>(null);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('docs-theme', next);
  };

  return (
    <PageLayout
      theme={theme}
      onToggleTheme={toggleTheme}
      breadcrumb={{ section: 'getting-started', subsection: 'installation' }}
    >
      <div className="section-hero">
        <div className="emoji-badge">
          <span>🔬</span> Getting Started
        </div>
        <h1>Deep Dive: Installation Details</h1>
        <p className="description">
          Everything you need to know about MySQL installation, with troubleshooting for when things go sideways.
        </p>
        <DifficultyBadge level="beginner" />
      </div>

      {/* Troubleshooting */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>🚨 When Things Go Wrong</h2>
          <div className="subtitle">The most common installation problems and exactly how to fix them. Click to expand.</div>
        </div>
        <div className="doc-card-body" style={{ padding: 0 }}>
          {issues.map((issue, i) => (
            <div
              key={i}
              style={{
                borderBottom: i < issues.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <button
                onClick={() => setOpenIssue(openIssue === i ? null : i)}
                style={{
                  width: '100%',
                  background: openIssue === i ? 'var(--red-soft)' : 'transparent',
                  border: 'none',
                  padding: '18px 24px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 16,
                  transition: 'background 0.15s',
                }}
              >
                <div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: 'var(--red)',
                    fontWeight: 700,
                    marginBottom: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>Error</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {issue.problem}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                    Cause: {issue.cause}
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }}>
                  {openIssue === i ? '▲' : '▼'}
                </span>
              </button>

              {openIssue === i && (
                <div style={{ padding: '0 24px 20px' }}>
                  {issue.fixes.map((fix, j) => (
                    <div key={j} style={{ marginBottom: j < issue.fixes.length - 1 ? 16 : 0 }}>
                      <div style={{
                        fontSize: 11,
                        color: 'var(--green)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 6,
                      }}>
                        Fix — {fix.platform}
                      </div>
                      <CodeBlock code={fix.code} language={fix.lang} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MySQL File Locations */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>🗂️ Where Does MySQL Store Your Data?</h2>
          <div className="subtitle">Good to know — especially for backups and debugging.</div>
        </div>
        <div className="doc-card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mysqlFiles.map((file, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 14,
                padding: '16px',
                background: 'var(--bg-secondary)',
                borderRadius: 10,
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{file.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {file.label}
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: 'var(--accent)',
                    marginBottom: 6,
                  }}>
                    {file.path}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{file.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verify your install */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>🔍 Verify Your Installation</h2>
          <div className="subtitle">Run these commands to confirm MySQL is healthy.</div>
        </div>
        <div className="doc-card-body">
          <CodeBlock language="sql" code={`-- Check version
SELECT VERSION();
-- Expected: 8.x.x

-- Check what's running
SHOW STATUS LIKE 'Uptime';

-- Check all databases exist
SHOW DATABASES;

-- Check the default character set (should be utf8mb4)
SHOW VARIABLES LIKE 'character_set_server';`} />

          <div className="tip-callout" style={{ marginTop: 16 }}>
            <span>💡</span>
            <span>If <code style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>character_set_server</code> is not <strong>utf8mb4</strong>, add <code style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>character-set-server=utf8mb4</code> to your my.cnf and restart MySQL. This prevents emoji and multilingual data issues.</span>
          </div>
        </div>
      </div>

      {/* Configuration basics */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>⚙️ Essential Configuration</h2>
          <div className="subtitle">The must-have settings for a development MySQL setup.</div>
        </div>
        <div className="doc-card-body">
          <CodeBlock language="ini" code={`# my.cnf / my.ini — Development Settings
[mysqld]
# Character encoding (ALWAYS set this)
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Timezone
default-time-zone = '+00:00'

# Logging (helpful while learning)
general_log = 1
general_log_file = /var/log/mysql/general.log

# Performance (for dev machines)
innodb_buffer_pool_size = 256M

[client]
default-character-set = utf8mb4`} />
        </div>
      </div>
    </PageLayout>
  );
};

export default InstallationPage;
