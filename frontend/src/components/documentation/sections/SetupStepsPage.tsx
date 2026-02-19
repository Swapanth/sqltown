import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import type { SubsectionId } from './index';

interface SetupStepsPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const SetupStepsPage: React.FC<SetupStepsPageProps> = ({ initialTheme, onNavigate }) => {
  return (
    <PlaceholderPage
      initialTheme={initialTheme}
      onNavigate={onNavigate}
      title="Five Steps to Setup MySQL"
      description="Get MySQL running in under 10 minutes. We'll do this together, platform by platform."
      section="getting-started"
      subsection="setup-steps"
      currentSection="setup-steps"
      difficulty="beginner"
    />
  );
};

export default SetupStepsPage;