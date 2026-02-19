import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import type { SubsectionId } from './index';

interface JoinsPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const JoinsPage: React.FC<JoinsPageProps> = ({ initialTheme, onNavigate }) => {
  return (
    <PlaceholderPage
      initialTheme={initialTheme}
      onNavigate={onNavigate}
      title="JOINs: Connecting Tables"
      description="INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN — with Venn diagram visuals and 20+ real examples"
      section="advanced"
      subsection="joins"
      currentSection="joins"
      difficulty="intermediate"
    />
  );
};

export default JoinsPage;