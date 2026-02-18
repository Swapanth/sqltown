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
  | 'what-is-mysql'
  | 'setup-steps'
  | 'installation'
  | 'sample-database'
  | 'sql-statements'
  | 'filtering-sorting';

export interface SubsectionPageProps {
  initialTheme?: 'dark' | 'light';
}

// ─── Lazy Page Map ────────────────────────────────────────────────────────────
// Each page is code-split into its own chunk — only loaded when navigated to.

export const lazyPages: Record<SubsectionId, ComponentType<SubsectionPageProps>> = {
  'what-is-mysql': lazy(() => import('./WhatIsMySQLPage')),
  'setup-steps': lazy(() => import('./SetupStepsPage')),
  'installation': lazy(() => import('./InstallationPage')),
  'sample-database': lazy(() => import('./SampleDatabasePage')),
  'sql-statements': lazy(() => import('./CrudOperationsPage')),
  'filtering-sorting': lazy(() => import('./FilteringSortingPage')),
};

// ─── Metadata (for breadcrumbs, titles, etc.) ─────────────────────────────────

export const subsectionMeta: Record<SubsectionId, {
  title: string;
  emoji: string;
  section: string;
  sectionTitle: string;
  difficulty: string;
}> = {
  'what-is-mysql': {
    title: 'What Even IS MySQL?',
    emoji: '🤔',
    section: 'getting-started',
    sectionTitle: 'Getting Started',
    difficulty: 'absolute-beginner',
  },
  'setup-steps': {
    title: 'Five Steps to Setup MySQL',
    emoji: '⚙️',
    section: 'getting-started',
    sectionTitle: 'Getting Started',
    difficulty: 'beginner',
  },
  'installation': {
    title: 'Deep Dive: Installation Details',
    emoji: '🔬',
    section: 'getting-started',
    sectionTitle: 'Getting Started',
    difficulty: 'beginner',
  },
  'sample-database': {
    title: 'Sample Databases',
    emoji: '🎬',
    section: 'getting-started',
    sectionTitle: 'Getting Started',
    difficulty: 'beginner',
  },
  'sql-statements': {
    title: 'CRUD Operations',
    emoji: '✍️',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'beginner',
  },
  'filtering-sorting': {
    title: 'Filtering & Sorting',
    emoji: '🔍',
    section: 'basics',
    sectionTitle: 'MySQL Basics',
    difficulty: 'beginner',
  },
};

// ─── Ordered list (for prev/next navigation) ──────────────────────────────────

export const subsectionOrder: SubsectionId[] = [
  'what-is-mysql',
  'setup-steps',
  'installation',
  'sample-database',
  'sql-statements',
  'filtering-sorting',
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
