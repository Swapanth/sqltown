import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import type { SubsectionId } from './index';

interface IndexesPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const IndexesPage: React.FC<IndexesPageProps> = ({ initialTheme, onNavigate }) => {
  return (
    <PlaceholderPage
      initialTheme={initialTheme}
      onNavigate={onNavigate}
      title="Indexes & Performance"
      description="Why your queries are slow and exactly how to fix them. EXPLAIN plans. B-tree indexes."
      section="advanced"
      subsection="indexes"
      currentSection="indexes"
      difficulty="advanced"
    />
  );
};

export default IndexesPage;