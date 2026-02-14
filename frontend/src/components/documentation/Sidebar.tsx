import React from 'react';
import type { SidebarProps } from '../../models/Documentation';

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSection,
  activeSubsection,
  onNavigate,
  isOpen,
  onToggle
}) => {

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;

    const icons: Record<string, React.ReactNode> = {
      info: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 7v4M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      rocket: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1l5 5-3 3-2-2-2 2-3-3 5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M3 13l2-2M11 13l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      bulb: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1a5 5 0 0 0-5 5c0 2 1 3 1 4v1h8V10c0-1 1-2 1-4a5 5 0 0 0-5-5zM6 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      map: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 3l5-2v12l-5 2V3zM6 1l4 2v12l-4-2V1zM10 3l5 2v12l-5-2V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ),
      users: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M1 14a5 5 0 0 1 10 0M11 5a3 3 0 0 1 0 6M13 14a5 5 0 0 0-2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      settings: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1v2M8 13v2M15 8h-2M3 8H1M13.5 2.5l-1.4 1.4M3.9 12.1l-1.4 1.4M13.5 13.5l-1.4-1.4M3.9 3.9L2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      customize: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    };

    return icons[iconName] || null;
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 10h14M3 5h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.id} className="sidebar-section">
            <button
              className={`section-header ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => onNavigate(section.id)}
            >
              <div className="section-header-content">
                {renderIcon(section.icon)}
                <span className="section-title">{section.title}</span>
              </div>
            </button>

            {section.subsections && (
              <div className="subsections">
                {section.subsections.map((subsection) => (
                  <button
                    key={subsection.id}
                    className={`subsection-link ${
                      activeSection === section.id &&
                      activeSubsection === subsection.id
                        ? 'active'
                        : ''
                    }`}
                    onClick={() => onNavigate(section.id, subsection.id)}
                  >
                    {subsection.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};
