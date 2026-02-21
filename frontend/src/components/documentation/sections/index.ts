import { lazy, type ComponentType } from 'react';

export type SubsectionId =
  | 'welcome'
  | 'what-is-mysql'
  | 'setup-steps'
  | 'installation'
  | 'sample-database'
  | 'introduction-to-sql'
  | 'select-query'
  | 'data-definition-ddl'
  | 'data-manipulation-dml'
  | 'filtering-data'
  | 'sql-joins'
  | 'sql-set-operators'
  | 'string-functions'
  | 'date-time-functions'
  | 'null-functions'
  | 'case-when-statement'
  | 'sql-statements'
  | 'filtering-sorting'
  | 'joins'
  | 'aggregations'
  | 'subqueries'
  | 'indexes';

export interface SubsectionPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

export const lazyPages: Record<SubsectionId, ComponentType<SubsectionPageProps>> = {
  'welcome': lazy(() => import('./WelcomePage')),
  'what-is-mysql': lazy(() => import('./WhatIsMySQLPage')),
  'setup-steps': lazy(() => import('./SetupStepsPage')),
  'installation': lazy(() => import('./InstallationPage')),
  'sample-database': lazy(() => import('./SampleDatabasePage')),
  'introduction-to-sql': lazy(() => import('./IntroductionToSQLPage')),
  'select-query': lazy(() => import('./SelectQueryPage')),
  'data-definition-ddl': lazy(() => import('./DataDefinitionDDLPage')),
  'data-manipulation-dml': lazy(() => import('./DataManipulationDMLPage')),
  'filtering-data': lazy(() => import('./FilteringDataPage')),
  'sql-joins': lazy(() => import('./SQLJoinsPage')),
  'sql-set-operators': lazy(() => import('./SQLSetOperatorsPage')),
  'string-functions': lazy(() => import('./StringFunctionsPage')),
  'date-time-functions': lazy(() => import('./DateTimeFunctionsPage')),
  'null-functions': lazy(() => import('./NullFunctionsPage')),
  'case-when-statement': lazy(() => import('./CaseWhenPage')),
  'sql-statements': lazy(() => import('./CrudOperationsPage')),
  'filtering-sorting': lazy(() => import('./FilteringSortingPage')),
  'joins': lazy(() => import('./JoinsPage')),
  'aggregations': lazy(() => import('./AggregationsPage')),
  'subqueries': lazy(() => import('./SubqueriesPage')),
  'indexes': lazy(() => import('./IndexesPage')),
};

export const subsectionMeta: Record<SubsectionId, {
  title: string;
  section: string;
  sectionTitle: string;
  difficulty: string;
}> = {
  'welcome': {
    title: 'Welcome to SQL Town',
    section: 'overview',
    sectionTitle: 'Overview',
    difficulty: 'absolute-beginner',
  },
  'what-is-mysql': {
    title: 'What Even IS MySQL?',
    section: 'getting-started',
    sectionTitle: 'Getting Started',
    difficulty: 'absolute-beginner',
  },
  'setup-steps': {
    title: 'Five Steps to Setup MySQL',
    section: 'getting-started',
    sectionTitle: 'Getting Started',
    difficulty: 'beginner',
  },
  'installation': {
    title: 'Deep Dive: Installation Details',
    section: 'getting-started',
    sectionTitle: 'Getting Started',
    difficulty: 'beginner',
  },
  'sample-database': {
    title: 'Sample Databases',
    section: 'getting-started',
    sectionTitle: 'Getting Started',
    difficulty: 'beginner',
  },
  'introduction-to-sql': {
    title: 'Introduction to SQL',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'beginner',
  },
  'select-query': {
    title: 'SELECT Query',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'beginner',
  },
  'data-definition-ddl': {
    title: 'Data Definition (DDL)',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'beginner',
  },
  'data-manipulation-dml': {
    title: 'Data Manipulation (DML)',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'beginner',
  },
  'filtering-data': {
    title: 'Filtering Data',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'beginner',
  },
  'sql-joins': {
    title: 'SQL Joins',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'intermediate',
  },
  'sql-set-operators': {
    title: 'SQL SET Operators',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'intermediate',
  },
  'string-functions': {
    title: 'String Functions',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'intermediate',
  },
  'date-time-functions': {
    title: 'Date & Time Functions',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'intermediate',
  },
  'null-functions': {
    title: 'NULL Functions',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'intermediate',
  },
  'case-when-statement': {
    title: 'CASE WHEN Statement',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'intermediate',
  },
  'sql-statements': {
    title: 'CRUD Operations',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'beginner',
  },
  'filtering-sorting': {
    title: 'Filtering & Sorting',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'beginner',
  },
  'joins': {
    title: 'JOINs: Connecting Tables',
    section: 'advanced',
    sectionTitle: 'Advanced Topics',
    difficulty: 'intermediate',
  },
  'aggregations': {
    title: 'Aggregations & GROUP BY',
    section: 'advanced',
    sectionTitle: 'Advanced Topics',
    difficulty: 'intermediate',
  },
  'subqueries': {
    title: 'Subqueries & CTEs',
    section: 'advanced',
    sectionTitle: 'Advanced Topics',
    difficulty: 'advanced',
  },
  'indexes': {
    title: 'Indexes & Performance',
    section: 'advanced',
    sectionTitle: 'Advanced Topics',
    difficulty: 'advanced',
  },
};

// ─── Ordered list (for prev/next navigation) ──────────────────────────────────

export const subsectionOrder: SubsectionId[] = [
  'welcome',
  'what-is-mysql',
  'setup-steps',
  'installation',
  'sample-database',
  'introduction-to-sql',
  'select-query',
  'data-definition-ddl',
  'data-manipulation-dml',
  'filtering-data',
  'sql-joins',
  'sql-set-operators',
  'string-functions',
  'date-time-functions',
  'null-functions',
  'case-when-statement',
  'sql-statements',
  'filtering-sorting',
  'joins',
  'aggregations',
  'subqueries',
  'indexes',
];

export function getPrevNext(current: SubsectionId): {
  prev: SubsectionId | null;
  next: SubsectionId | null;
} {
  const idx = subsectionOrder.indexOf(current);
  return {
    prev: idx > 0 ? subsectionOrder[idx - 1] : null,
    next: idx < subsectionOrder.length - 1 ? subsectionOrder[idx + 1] : null,
  };
}
