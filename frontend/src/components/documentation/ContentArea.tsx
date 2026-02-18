import React, { Suspense, useState, useEffect } from 'react';
import { lazyPages, type SubsectionId } from './sections';
import type { ContentAreaProps } from '../../models/Documentation';

// Loading skeleton
const PageSkeleton: React.FC = () => (
  <div style={{
    padding: '48px 32px',
    maxWidth: 860,
    margin: '0 auto',
    animation: 'pulse 1.5s ease-in-out infinite',
  }}>
    {[...Array(4)].map((_, i) => (
      <div key={i} style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 24,
        marginBottom: 24,
      }}>
        <div style={{ background: 'var(--bg-secondary)', height: 20, width: '40%', borderRadius: 6, marginBottom: 12 }} />
        <div style={{ background: 'var(--bg-secondary)', height: 14, width: '80%', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ background: 'var(--bg-secondary)', height: 14, width: '65%', borderRadius: 4 }} />
      </div>
    ))}
    <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }`}</style>
  </div>
);

export const ContentArea: React.FC<ContentAreaProps> = ({
  section,
  subsectionId,
  database
}) => {
  // Sync theme from localStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('docs-theme') as 'dark' | 'light') || 'dark';
  });

  // Listen for theme changes from page components
  useEffect(() => {
    const handler = () => {
      const newTheme = (localStorage.getItem('docs-theme') as 'dark' | 'light') || 'dark';
      setTheme(newTheme);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  if (!section) {
    return (
      <main className="content-area">
        <div className="empty-state">
          <h2>Welcome to {database.toUpperCase()} Documentation</h2>
          <p>Select a topic from the sidebar to get started</p>
        </div>
      </main>
    );
  }

  // Check if this subsection has a lazy page component
  const PageComponent = subsectionId ? lazyPages[subsectionId as SubsectionId] : null;

  if (!PageComponent) {
    return (
      <main className="content-area">
        <div className="empty-state">
          <h2>{section.title}</h2>
          <p>Select a subsection from the sidebar</p>
        </div>
      </main>
    );
  }

  return (
    <main className="content-area">
      <Suspense fallback={<PageSkeleton />}>
        <PageComponent initialTheme={theme} />
      </Suspense>
    </main>
  );
};
