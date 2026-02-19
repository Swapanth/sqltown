/**
 * docs-pages/index.ts
 *
 * Lazy-loaded exports for all MySQL documentation subsection pages.
 *
 * Usage in your router or Documentation component:
 *
 *   import { lazyPages, SubsectionId } from './docs-pages';
 *
 *   const PageComponent = lazyPages[activeSubsection];
 *   if (PageComponent) {
 *     return <Suspense fallback={<PageSkeleton />}><PageComponent /></Suspense>;
 *   }
 */

import { lazy, type ComponentType } from 'react';

export type SubsectionId =
  | 'welcome'
  | 'what-is-mysql'
  | 'setup-steps'
  | 'installation'
  | 'sample-database'
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

// ─── Lazy Page Map ────────────────────────────────────────────────────────────
// Each page is code-split into its own chunk — only loaded when navigated to.

export const lazyPages: Record<SubsectionId, ComponentType<SubsectionPageProps>> = {
  'welcome': lazy(() => import('./WelcomePage')),
  'what-is-mysql': lazy(() => import('./WhatIsMySQLPage')),
  'setup-steps': lazy(() => import('./SetupStepsPage')),
  'installation': lazy(() => import('./InstallationPage')),
  'sample-database': lazy(() => import('./SampleDatabasePage')),
  'sql-statements': lazy(() => import('./CrudOperationsPage')),
  'filtering-sorting': lazy(() => import('./FilteringSortingPage')),
  'joins': lazy(() => import('./JoinsPage')),
  'aggregations': lazy(() => import('./AggregationsPage')),
  'subqueries': lazy(() => import('./SubqueriesPage')),
  'indexes': lazy(() => import('./IndexesPage')),
};

// ─── Metadata (for breadcrumbs, titles, etc.) ─────────────────────────────────

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
