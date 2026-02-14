import React from 'react';
import type { HeaderProps } from '../../models/Documentation';

export const Header: React.FC<HeaderProps> = ({
  title,
  version,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="doc-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="doc-title">{title}</h1>
          <span className="version-badge">Version {version}</span>
        </div>

        <div className="header-center">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            <kbd className="search-kbd">⌘ K</kbd>
          </div>
        </div>

        <div className="header-right">


          <nav className="header-nav">
            <a href="#overview" className="nav-link">Overview</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#faqs" className="nav-link">FAQs</a>
            <a href="#api" className="nav-link">API</a>
            <a href="#blogs" className="nav-link">Blogs</a>
            <a href="#contribute" className="nav-link">Contribute</a>
            <a href="#support" className="nav-link">Support</a>
          </nav>
        </div>
      </div>
    </header>
  );
};
