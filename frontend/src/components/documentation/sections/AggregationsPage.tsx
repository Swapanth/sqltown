import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import type { SubsectionId } from './index';

interface AggregationsPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const AggregationsPage: React.FC<AggregationsPageProps> = ({ initialTheme, onNavigate }) => {
  return (
    <PlaceholderPage
      initialTheme={initialTheme}
      onNavigate={onNavigate}
      title="Aggregations & GROUP BY"
      description="COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING — turn raw rows into business insights"
      section="advanced"
      subsection="aggregations"
      currentSection="aggregations"
      difficulty="intermediate"
    />
  );
};

export default AggregationsPage;