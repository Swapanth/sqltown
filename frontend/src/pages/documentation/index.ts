// Main exports for the documentation system

export { Documentation } from './documentation';

// Component exports
export { Header } from '../../components/documentation/Header';
export { Sidebar } from '../../components/documentation/Sidebar';
export { ContentArea } from '../../components/documentation/ContentArea';
export { TableOfContents } from '../../components/documentation/TableOfContents';
export { CodeBlock } from '../../components/documentation/CodeBlock';

// Type exports
export type {
  DatabaseType,
  IconType,
  ContentBlockType,
  ContentBlock,
  Subsection,
  Section,
  DatabaseDocumentation,
  DocumentationData,
  NavigationState,
  SearchResult,
  HeaderProps,
  SidebarProps,
  ContentAreaProps,
  TableOfContentsProps,
  CodeBlockProps,
  DocumentationProps,
  NavigationHandler,
  SearchHandler,
  ThemeToggleHandler,
  SupportedLanguage,
} from '../../models/Documentation';

// Constants
export {
  SUPPORTED_LANGUAGES,
  ICON_NAMES,
  DATABASE_NAMES,
  isValidDatabase,
  isValidIcon,
  isValidContentType,
  isValidLanguage,
} from '../../models/Documentation';

// Default export
export { Documentation as default } from './documentation';
