import React from 'react';
import { getPrevNext, subsectionMeta, type SubsectionId } from './index';

interface SectionNavigatorProps {
  currentSection: SubsectionId;
  onNavigate: (sectionId: SubsectionId) => void;
}

export const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  currentSection,
  onNavigate
}) => {
  const { prev, next } = getPrevNext(currentSection);

  return (
    <nav className="section-navigator">
      <div className="nav-container">
        {prev ? (
          <button 
            className="nav-button nav-prev"
            onClick={() => onNavigate(prev)}
          >
            <div className="nav-direction">Previous</div>
            <div className="nav-title">
              <svg className="nav-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {subsectionMeta[prev].title}
            </div>
          </button>
        ) : (
          <div></div>
        )}

        {next ? (
          <button 
            className="nav-button nav-next"
            onClick={() => onNavigate(next)}
          >
            <div className="nav-direction">Next</div>
            <div className="nav-title">
              {subsectionMeta[next].title}
              <svg className="nav-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
};