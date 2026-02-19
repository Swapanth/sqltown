import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import type { SubsectionId } from './index';

interface FilteringSortingPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const FilteringSortingPage: React.FC<FilteringSortingPageProps> = ({ initialTheme, onNavigate }) => {
  return (
    <PlaceholderPage
      initialTheme={initialTheme}
      onNavigate={onNavigate}
      title="Filtering & Sorting"
      description="Learn to slice, dice, sort, and filter your data. This is where SQL starts to feel like a superpower."
      section="basics"
      subsection="filtering-sorting"
      currentSection="filtering-sorting"
      difficulty="beginner"
    />
  );
};

export default FilteringSortingPage;