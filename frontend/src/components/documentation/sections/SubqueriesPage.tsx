import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import type { SubsectionId } from './index';

interface SubqueriesPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const SubqueriesPage: React.FC<SubqueriesPageProps> = ({ initialTheme, onNavigate }) => {
  return (
    <PlaceholderPage
      initialTheme={initialTheme}
      onNavigate={onNavigate}
      title="Subqueries & CTEs"
      description="Queries inside queries. Correlated subqueries. WITH clause. Window functions."
      section="advanced"
      subsection="subqueries"
      currentSection="subqueries"
      difficulty="advanced"
    />
  );
};

export default SubqueriesPage;