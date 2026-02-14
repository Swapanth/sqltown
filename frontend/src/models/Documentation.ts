// Type definitions for the documentation system

export type DatabaseType = 'mysql' | 'postgresql' | 'oracle';

export type IconType =
  | 'info'
  | 'rocket'
  | 'bulb'
  | 'map'
  | 'users'
  | 'settings'
  | 'customize';

export type ContentBlockType =
  | 'text'
  | 'code'
  | 'example'
  | 'note'
  | 'image'
  | 'table'
  | 'output';

export interface ContentBlock {
  type: ContentBlockType;
  content: string;
  language?: string;
  caption?: string;
  // For 'table' type
  headers?: string[];
  rows?: string[][];
}

export interface Subsection {
  id: string;
  title: string;
  description?: string;
  content?: ContentBlock[];
}

export interface Section {
  id: string;
  title: string;
  icon?: IconType;
  subsections?: Subsection[];
}

export interface DatabaseDocumentation {
  title: string;
  version: string;
  sections: Section[];
}

export interface DocumentationData {
  [key: string]: DatabaseDocumentation;
}

export interface NavigationState {
  activeSection: string;
  activeSubsection: string;
  searchQuery: string;
  sidebarOpen: boolean;
}

export interface SearchResult {
  sectionId: string;
  subsectionId?: string;
  title: string;
  description?: string;
  matchType: 'title' | 'content' | 'description';
}

// Component Props Types

export interface HeaderProps {
  title: string;
  version: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface SidebarProps {
  sections: Section[];
  activeSection: string;
  activeSubsection: string;
  onNavigate: (sectionId: string, subsectionId?: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface ContentAreaProps {
  section?: Section;
  subsectionId?: string;
  database: DatabaseType;
}

export interface TableOfContentsProps {
  section?: Section;
  activeSubsection?: string;
  onNavigate: (subsectionId: string) => void;
}

export interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
}

export interface DocumentationProps {
  database?: DatabaseType;
}

// Utility Types

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Helper function types

export type NavigationHandler = (sectionId: string, subsectionId?: string) => void;
export type SearchHandler = (query: string) => SearchResult[];
export type ThemeToggleHandler = () => void;

// Constants

export const SUPPORTED_LANGUAGES = [
  'sql',
  'javascript',
  'typescript',
  'python',
  'bash',
  'json',
  'html',
  'css',
  'php',
  'java',
  'cpp',
  'csharp',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const ICON_NAMES = [
  'info',
  'rocket',
  'bulb',
  'map',
  'users',
  'settings',
  'customize',
] as const;

export const DATABASE_NAMES = [
  'mysql',
  'postgresql',
  'oracle',
] as const;

// Validation helpers

export const isValidDatabase = (db: string): db is DatabaseType => {
  return DATABASE_NAMES.includes(db as DatabaseType);
};

export const isValidIcon = (icon: string): icon is IconType => {
  return ICON_NAMES.includes(icon as IconType);
};

export const isValidContentType = (type: string): type is ContentBlockType => {
  return ['text', 'code', 'example', 'note', 'image', 'table', 'output'].includes(type);
};

export const isValidLanguage = (lang: string): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
};
