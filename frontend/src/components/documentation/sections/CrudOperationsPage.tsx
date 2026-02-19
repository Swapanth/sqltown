import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import type { SubsectionId } from './index';

interface CrudOperationsPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const CrudOperationsPage: React.FC<CrudOperationsPageProps> = ({ initialTheme, onNavigate }) => {
  return (
    <PlaceholderPage
      initialTheme={initialTheme}
      onNavigate={onNavigate}
      title="CRUD Operations"
      description="The four fundamental database operations: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). Master these and you can build literally anything."
      section="basics"
      subsection="sql-statements"
      currentSection="sql-statements"
      difficulty="beginner"
    />
  );
};

export default CrudOperationsPage;