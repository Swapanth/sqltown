import React from 'react';
import { PageLayout, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface PlaceholderPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
  title: string;
  description: string;
  section: string;
  subsection: string;
  currentSection: SubsectionId;
  difficulty?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  initialTheme = 'light', 
  onNavigate,
  title,
  description,
  section,
  subsection,
  currentSection,
  difficulty = 'beginner'
}) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}}
      breadcrumb={{ section, subsection }}
      currentSection={currentSection}
      onNavigate={onNavigate}
    >
      <div className="section-hero">
        <div className="emoji-badge">
          <span>Coming Soon</span>
        </div>
        <h1>{title}</h1>
        <p className="description">
          {description}
        </p>
        <DifficultyBadge level={difficulty} />
      </div>

      <div className="doc-card">
        <div className="doc-card-header">
          <h2>Content Coming Soon</h2>
          <div className="subtitle">This section is currently being developed.</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            We're working hard to bring you comprehensive, high-quality content for this section. 
            In the meantime, you can explore other sections of the documentation or check back soon 
            for updates.
          </p>
          
          <div className="doc-card" style={{ marginTop: '24px', background: 'var(--accent-soft)' }}>
            <div className="doc-card-body" style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: 'var(--accent)' }}>
                What to Expect
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                This section will include detailed explanations, practical examples, 
                interactive code blocks, and real-world use cases to help you master this topic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PlaceholderPage;