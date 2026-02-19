import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface WelcomePageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ initialTheme = 'dark', onNavigate }) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}} // No-op since theme is managed by parent
      breadcrumb={{ section: 'welcome', subsection: 'overview' }}
      currentSection="welcome"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>SQL Town Documentation</span>
        </div>
        <h1>Build SQL like a Sacred City</h1>
        <p className="description">
          Learn database design by building Vrindavan — One query at a time. 
          Beautiful, clean, and premium documentation for your SQL journey.
        </p>
        <DifficultyBadge level="absolute-beginner" />
      </div>

      <FunFact text="This documentation uses the same design principles as Next.js docs, with SQL Town's beautiful branding and the 70-20-10 color rule. Orange accents make up exactly 10% of the design." />

      {/* Design Philosophy */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="design-philosophy">Design Philosophy</h2>
          <div className="subtitle">Clean, minimal, and premium — just like the best documentation sites.</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            This documentation follows the <strong>70-20-10 design rule</strong> with SQL Town's 
            beautiful branding. We use neutral grays and whites for 70% of the interface, 
            darker contrasting elements for 20%, and SQL Town's signature orange (#E67350) 
            for 10% as accent colors.
          </p>

          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Typography</span>
              </div>
              <div className="simple">Playfair Display for headings, Syne for body text, JetBrains Mono for code</div>
              <div className="example">font-family: 'Playfair Display', serif;</div>
            </div>
            
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Colors</span>
              </div>
              <div className="simple">70% neutral grays, 20% contrast colors, 10% orange accents</div>
              <div className="example">--accent: #E67350;</div>
            </div>
            
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Themes</span>
              </div>
              <div className="simple">Beautiful dark and light themes with smooth transitions</div>
              <div className="example">data-theme="dark" | "light"</div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="code-blocks">Beautiful Code Blocks</h2>
          <div className="subtitle">Syntax highlighting with copy functionality and clean design.</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Code blocks are designed to be readable and functional, with proper syntax highlighting 
            and easy copy functionality.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Create the sacred city database
CREATE DATABASE Vrindavan;

-- Create your first table
CREATE TABLE dharamshala (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity INTEGER,
  location POINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some residents
INSERT INTO dharamshala (name, capacity, location) VALUES
  ('Swapanth Residence', 50, POINT(77.7064, 27.5806)),
  ('Hemanth Lodge', 30, POINT(77.7094, 27.5836));

-- Query the sacred city
SELECT name, capacity, 
       ST_Distance_Sphere(location, POINT(77.7064, 27.5806)) as distance_meters
FROM dharamshala
ORDER BY distance_meters;`} 
          />
        </div>
      </div>

      {/* Features Showcase */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="documentation-features">Documentation Features</h2>
        </div>
        <div className="doc-card-body">
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>Before</h3>
              <ul>
                <li>Generic blue color scheme</li>
                <li>Basic typography</li>
                <li>No brand identity</li>
                <li>Standard documentation look</li>
                <li>Limited visual hierarchy</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>After</h3>
              <ul>
                <li>SQL Town orange branding</li>
                <li>Premium serif + sans typography</li>
                <li>Strong brand identity</li>
                <li>Next.js-inspired clean design</li>
                <li>Clear visual hierarchy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="interactive-elements">Interactive Elements</h2>
          <div className="subtitle">Hover effects, smooth transitions, and delightful micro-interactions.</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Every element has been carefully crafted with hover states, focus indicators, 
            and smooth transitions. The theme toggle in the header switches between light 
            and dark modes seamlessly.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
            <DifficultyBadge level="absolute-beginner" />
            <DifficultyBadge level="beginner" />
            <DifficultyBadge level="intermediate" />
            <DifficultyBadge level="advanced" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WelcomePage;