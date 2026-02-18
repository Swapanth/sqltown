import React, { useState } from 'react';
import { PageLayout, CodeBlock, DifficultyBadge } from './PageLayout';
import './docs-theme.css';

type Theme = 'dark' | 'light';
type Platform = 'macOS' | 'Windows' | 'Linux (Ubuntu)' | 'Docker';

const platforms: Platform[] = ['macOS', 'Windows', 'Linux (Ubuntu)', 'Docker'];

const steps: Record<Platform, Array<{
  number: number;
  title: string;
  emoji: string;
  description: string;
  code?: string;
  language?: string;
  tip?: string;
  expectedOutput?: string;
}>> = {
  macOS: [
    {
      number: 1,
      title: 'Install Homebrew (Your Mac\'s Best Friend)',
      emoji: '🍺',
      description: 'Homebrew is a package manager for macOS. Think of it as an App Store for developers — but free, and way cooler. If you already have it, skip ahead.',
      code: `# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Verify it worked
brew --version
# Expected: Homebrew 4.x.x`,
      language: 'bash',
      tip: 'The installation takes 2-3 minutes. Go make a tea. ☕',
    },
    {
      number: 2,
      title: 'Install MySQL — One Command!',
      emoji: '📦',
      description: 'This single command downloads and installs MySQL on your Mac.',
      code: `# Update Homebrew first (always a good habit)
brew update

# Install MySQL 8.0
brew install mysql

# Start MySQL right now
brew services start mysql`,
      language: 'bash',
      expectedOutput: '==> Successfully started mysql (label: homebrew.mxcl.mysql)',
    },
    {
      number: 3,
      title: 'Secure Your Installation',
      emoji: '🔒',
      description: 'MySQL ships with some insecure defaults. This command walks you through locking things down.',
      code: `mysql_secure_installation`,
      language: 'bash',
      tip: 'When prompted, set a strong root password and answer Y to all remaining questions.',
    },
    {
      number: 4,
      title: 'Connect to MySQL',
      emoji: '🚀',
      description: 'Time to say hello to your new database!',
      code: `# Connect as root
mysql -u root -p

# You'll be prompted for the password you set above
# Once in, you'll see: mysql>`,
      language: 'bash',
    },
    {
      number: 5,
      title: 'Run Your First Query',
      emoji: '✨',
      description: 'Confirm everything is working.',
      code: `-- Check MySQL version
SELECT VERSION();

-- Show all databases
SHOW DATABASES;`,
      language: 'sql',
      expectedOutput: '+--------------------+\n| Database           |\n+--------------------+\n| information_schema |\n| mysql              |\n| performance_schema |\n| sys                |\n+--------------------+',
    },
  ],
  Windows: [
    {
      number: 1,
      title: 'Download MySQL Installer',
      emoji: '⬇️',
      description: 'Go to dev.mysql.com/downloads/installer/ and download the MySQL Installer for Windows. Choose the larger "mysql-installer-community" file.',
      tip: 'Pick the "Developer Default" setup type — it installs everything you need.',
    },
    {
      number: 2,
      title: 'Run the Installer',
      emoji: '🔧',
      description: 'Double-click the installer. Click through: Execute → Next → Next. When you reach "Authentication Method", select "Use Strong Password Encryption".',
      tip: 'Write down the root password you set. You\'ll need it forever.',
    },
    {
      number: 3,
      title: 'Add MySQL to Your PATH',
      emoji: '🗺️',
      description: 'So you can run mysql commands from any terminal.',
      code: `# In PowerShell (run as Administrator):
$env:Path += ";C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin"

# Make it permanent by adding to system environment variables`,
      language: 'powershell',
    },
    {
      number: 4,
      title: 'Open MySQL Command Line Client',
      emoji: '💻',
      description: 'Search "MySQL Command Line Client" in Start Menu. Enter your root password.',
      code: `-- Confirm it works
SELECT VERSION();
SHOW DATABASES;`,
      language: 'sql',
    },
    {
      number: 5,
      title: '(Optional) Install MySQL Workbench',
      emoji: '🎨',
      description: 'MySQL Workbench is a GUI tool that makes database management visual. The installer likely already installed it — find it in Start Menu.',
      tip: 'Workbench is great for visualizing table structures and running queries with syntax highlighting.',
    },
  ],
  'Linux (Ubuntu)': [
    {
      number: 1,
      title: 'Update Your Package List',
      emoji: '📋',
      description: 'Always update apt before installing anything.',
      code: `sudo apt update && sudo apt upgrade -y`,
      language: 'bash',
    },
    {
      number: 2,
      title: 'Install MySQL Server',
      emoji: '📦',
      description: 'One command installs MySQL and starts it automatically.',
      code: `sudo apt install mysql-server -y

# Check it's running
sudo systemctl status mysql`,
      language: 'bash',
      expectedOutput: '● mysql.service - MySQL Community Server\n   Active: active (running)',
    },
    {
      number: 3,
      title: 'Run the Security Script',
      emoji: '🔒',
      description: 'Ubuntu ships MySQL without a root password. Let\'s fix that.',
      code: `sudo mysql_secure_installation`,
      language: 'bash',
      tip: 'Set VALIDATE PASSWORD to YES, choose a strong password, remove anonymous users, and disallow remote root login.',
    },
    {
      number: 4,
      title: 'Log In as Root',
      emoji: '🚪',
      description: 'On Ubuntu, root MySQL access uses the system sudo method.',
      code: `# Method 1: sudo
sudo mysql

# Method 2: If you set a password
mysql -u root -p`,
      language: 'bash',
    },
    {
      number: 5,
      title: 'Enable Auto-Start',
      emoji: '⚡',
      description: 'Make MySQL start automatically when your server boots.',
      code: `sudo systemctl enable mysql
sudo systemctl start mysql`,
      language: 'bash',
    },
  ],
  Docker: [
    {
      number: 1,
      title: 'Pull the MySQL Image',
      emoji: '🐳',
      description: 'Docker makes MySQL setup instant — no installation, no PATH issues. Just requires Docker Desktop.',
      code: `docker pull mysql:8.0`,
      language: 'bash',
    },
    {
      number: 2,
      title: 'Start a MySQL Container',
      emoji: '🚀',
      description: 'This one command creates a fully configured MySQL server.',
      code: `docker run --name mysql-dev \\
  -e MYSQL_ROOT_PASSWORD=mypassword \\
  -e MYSQL_DATABASE=mydb \\
  -p 3306:3306 \\
  -d mysql:8.0`,
      language: 'bash',
      tip: 'Replace "mypassword" with something real. The -p 3306:3306 exposes MySQL so you can connect from your machine.',
    },
    {
      number: 3,
      title: 'Connect to the Container',
      emoji: '🔗',
      description: 'Drop into the MySQL shell inside your container.',
      code: `docker exec -it mysql-dev mysql -u root -p
# Enter: mypassword`,
      language: 'bash',
    },
    {
      number: 4,
      title: 'Persist Data with Volumes',
      emoji: '💾',
      description: 'By default, Docker data disappears when you remove a container. Use a volume to persist your databases.',
      code: `docker run --name mysql-dev \\
  -e MYSQL_ROOT_PASSWORD=mypassword \\
  -v mysql_data:/var/lib/mysql \\
  -p 3306:3306 \\
  -d mysql:8.0`,
      language: 'bash',
    },
    {
      number: 5,
      title: 'Docker Compose (Recommended)',
      emoji: '📝',
      description: 'For projects, use a docker-compose.yml to manage MySQL alongside your app.',
      code: `# docker-compose.yml
version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: mypassword
      MYSQL_DATABASE: mydb
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:`,
      language: 'yaml',
    },
  ],
};

const SetupStepsPage: React.FC<{ initialTheme?: Theme }> = ({ initialTheme = 'dark' }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('docs-theme') as Theme) || initialTheme
  );
  const [platform, setPlatform] = useState<Platform>('macOS');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('docs-theme', next);
  };

  const currentSteps = steps[platform];

  return (
    <PageLayout
      theme={theme}
      onToggleTheme={toggleTheme}
      breadcrumb={{ section: 'getting-started', subsection: 'setup-steps' }}
    >
      <div className="section-hero">
        <div className="emoji-badge">
          <span>⚙️</span> Getting Started
        </div>
        <h1>Five Steps to Setup MySQL</h1>
        <p className="description">
          Get MySQL running in under 10 minutes. We'll do this together, platform by platform.
        </p>
        <DifficultyBadge level="beginner" />
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 12,
          padding: '4px 14px',
          background: 'var(--cyan-soft)',
          border: '1px solid rgba(34,211,238,0.2)',
          borderRadius: 100,
          fontSize: 13,
          color: 'var(--cyan)',
        }}>
          ⏱ 10–15 minutes
        </div>
      </div>

      {/* Platform Selector */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>Pick Your Platform</h2>
          <div className="subtitle">The steps differ slightly depending on your OS.</div>
        </div>
        <div className="doc-card-body">
          <div className="platform-tabs">
            {platforms.map(p => (
              <button
                key={p}
                className={`platform-tab ${platform === p ? 'active' : ''}`}
                onClick={() => setPlatform(p)}
              >
                {p === 'macOS' && '🍎 '}
                {p === 'Windows' && '🪟 '}
                {p === 'Linux (Ubuntu)' && '🐧 '}
                {p === 'Docker' && '🐳 '}
                {p}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {currentSteps.map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">0{step.number}</div>
                <div className="step-content" style={{ flex: 1 }}>
                  <h3>
                    <span>{step.emoji}</span>
                    {step.title}
                  </h3>
                  <p>{step.description}</p>
                  {step.code && (
                    <CodeBlock code={step.code} language={step.language || 'bash'} />
                  )}
                  {step.expectedOutput && (
                    <div style={{
                      background: 'var(--green-soft)',
                      border: '1px solid rgba(74,222,128,0.2)',
                      borderRadius: 8,
                      padding: '12px 16px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: 'var(--green)',
                      whiteSpace: 'pre',
                      overflowX: 'auto',
                    }}>
                      {step.expectedOutput}
                    </div>
                  )}
                  {step.tip && (
                    <div className="tip-callout">
                      <span>💡</span>
                      <span>{step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success check */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2>✅ Success Checklist</h2>
        </div>
        <div className="doc-card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'MySQL is installed and running',
              'You can connect with: mysql -u root -p',
              'SHOW DATABASES; returns a list',
              'You have a root password set',
            ].map((item, i) => (
              <label key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: 'var(--bg-secondary)',
                borderRadius: 8,
                border: '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--text-secondary)',
              }}>
                <input type="checkbox" style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SetupStepsPage;
