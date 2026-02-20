import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import { Sidebar } from '../../components/documentation/Sidebar';
import { ContentArea } from '../../components/documentation/ContentArea';
import { Header } from '../../components/documentation/Header';
import { TableOfContents } from '../../components/documentation/TableOfContents';
import { documentationStructure, type Section } from '../../data/documentationStructure';
import type { DocumentationProps, DatabaseType } from '../../models/Documentation';

export const Documentation: React.FC<DocumentationProps> = ({
  database: propDatabase
}) => {
  const { database: paramDatabase } = useParams<{ database?: string }>();
  const database = (propDatabase || paramDatabase || 'mysql') as DatabaseType;

  const [activeSection, setActiveSection] = useState<string>('');
  const [activeSubsection, setActiveSubsection] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Theme management
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('docs-theme') as 'dark' | 'light') || 'dark';
  });

  const currentData = documentationStructure[database as keyof typeof documentationStructure];

  // Initialize first section and subsection
  useEffect(() => {
    if (activeSection === '' && currentData?.sections?.length > 0) {
      setActiveSection(currentData.sections[0].id);
      if (currentData.sections[0].subsections && currentData.sections[0].subsections.length > 0) {
        setActiveSubsection(currentData.sections[0].subsections[0].id);
      }
    }
  }, [database, currentData, activeSection]);

  // Listen for theme changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'docs-theme') {
        const newTheme = (e.newValue as 'dark' | 'light') || 'dark';
        setTheme(newTheme);
      }
    };

    const handleCustomThemeChange = () => {
      const newTheme = (localStorage.getItem('docs-theme') as 'dark' | 'light') || 'dark';
      setTheme(newTheme);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomThemeChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomThemeChange);
    };
  }, []);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!currentData) {
    return (
      <div className="documentation-container" data-theme={theme}>
        <div className="p-8 text-center">
          <h2>Documentation not found for {database}</h2>
          <p>Please check the database parameter and try again.</p>
        </div>
      </div>
    );
  }

  const handleNavigate = (sectionId: string, subsectionId?: string) => {
    setActiveSection(sectionId);
    if (subsectionId) {
      setActiveSubsection(subsectionId);
    } else {
      // Reset subsection when navigating to a new section
      const section = currentData.sections.find(s => s.id === sectionId);
      if (section?.subsections && section.subsections.length > 0) {
        setActiveSubsection(section.subsections[0].id);
      } else {
        setActiveSubsection('');
      }
    }
  };

  return (
    <div className="documentation-container" data-theme={theme}>
      <div className="documentation-layout">
        <Sidebar
          sections={currentData.sections as any}
          activeSection={activeSection}
          activeSubsection={activeSubsection}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <ContentArea
          section={currentData.sections.find((s: Section) => s.id === activeSection) as any}
          subsectionId={activeSubsection}
          database={database}
          onNavigate={handleNavigate}
        />

        <TableOfContents
          section={currentData.sections.find((s: Section) => s.id === activeSection) as any}
          activeSubsection={activeSubsection}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
};

export default Documentation;
