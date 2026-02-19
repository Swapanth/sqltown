import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import type { SubsectionId } from './index';

interface SampleDatabasePageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const SampleDatabasePage: React.FC<SampleDatabasePageProps> = ({ initialTheme, onNavigate }) => {
  return (
    <PlaceholderPage
      initialTheme={initialTheme}
      onNavigate={onNavigate}
      title="Sample Databases"
      description="Practice with real-world data. We'll use the Sakila DVD rental database — because learning SQL with actual data is 10x better than dry examples."
      section="getting-started"
      subsection="sample-database"
      currentSection="sample-database"
      difficulty="beginner"
    />
  );
};

export default SampleDatabasePage;