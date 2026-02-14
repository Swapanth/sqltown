import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import { Sidebar } from '../../components/documentation/Sidebar';
import { ContentArea } from '../../components/documentation/ContentArea';
import { Header } from '../../components/documentation/Header';
import { TableOfContents } from '../../components/documentation/TableOfContents';
import documentationData from '../../data/documentationData.json';
import type { DocumentationData, DocumentationProps, DatabaseType } from '../../models/Documentation';

export const Documentation: React.FC<DocumentationProps> = ({
  database: propDatabase
}) => {
  const { database: paramDatabase } = useParams<{ database?: string }>();
  const database = (propDatabase || paramDatabase || 'mysql') as DatabaseType;

  const [activeSection, setActiveSection] = useState<string>('');
  const [activeSubsection, setActiveSubsection] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const currentData = (documentationData as unknown as DocumentationData)[database];

  useEffect(() => {
    if (activeSection === '' && currentData?.sections?.length > 0) {
      setActiveSection(currentData.sections[0].id);
      if (currentData.sections[0].subsections && currentData.sections[0].subsections.length > 0) {
        setActiveSubsection(currentData.sections[0].subsections[0].id);
      }
    }
  }, [database, currentData, activeSection]);

  if (!currentData) {
    return <div className="p-8 text-center">Documentation not found for {database}</div>;
  }

  const handleNavigate = (sectionId: string, subsectionId?: string) => {
    setActiveSection(sectionId);
    if (subsectionId) {
      setActiveSubsection(subsectionId);
    }
  };

  return (
    <div className="documentation-container">
      <Header
        title={currentData.title}
        version={currentData.version}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="documentation-layout">
        <Sidebar
          sections={currentData.sections}
          activeSection={activeSection}
          activeSubsection={activeSubsection}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <ContentArea
          section={currentData.sections.find(s => s.id === activeSection)}
          subsectionId={activeSubsection}
          database={database}
        />

        <TableOfContents
          section={currentData.sections.find(s => s.id === activeSection)}
          activeSubsection={activeSubsection}
          onNavigate={setActiveSubsection}
        />
      </div>
    </div>
  );
};

export default Documentation;
