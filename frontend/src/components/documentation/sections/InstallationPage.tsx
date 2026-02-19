import React from 'react';
import PlaceholderPage from './PlaceholderPage';
import type { SubsectionId } from './index';

interface InstallationPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const InstallationPage: React.FC<InstallationPageProps> = ({ initialTheme, onNavigate }) => {
  return (
    <PlaceholderPage
      initialTheme={initialTheme}
      onNavigate={onNavigate}
      title="Deep Dive: Installation Details"
      description="Everything you need to know about MySQL installation, with troubleshooting for when things go sideways."
      section="getting-started"
      subsection="installation"
      currentSection="installation"
      difficulty="beginner"
    />
  );
};

export default InstallationPage;