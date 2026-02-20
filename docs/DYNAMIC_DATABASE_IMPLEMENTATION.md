# Dynamic Database Implementation

## Overview
Implemented a dynamic database system for the Practice page that allows each practice scenario (E-Commerce, University, HR, Banking) to load and work with its own dedicated database file.

## Changes Made

### 1. Modified compiler.ts
**File**: `frontend/src/components/playground/compiler.ts`

**Changes**:
- Added `currentDatabaseId` state variable to track which database is loaded
- Modified `initializeDatabase()` to accept two parameters:
  - `sqlFilePath`: Path to the SQL file (default: "/data/data.sql")
  - `databaseId`: Unique identifier for the database (default: "default")
- Added database switching logic - closes old database when switching to a new one
- Added `getCurrentDatabaseId()` function to check which database is currently loaded

**Benefits**:
- Supports multiple databases in the same session
- Prevents unnecessary reloading when the same database is already initialized
- Properly cleans up old database instances when switching

### 2. Created PracticeDatabaseContext
**File**: `frontend/src/context/PracticeDatabaseContext.tsx`

**Purpose**: 
- Provides centralized database state management for all practice components
- Auto-initializes the database when a practice page is loaded

**Key Features**:
- `databasesInfo` object containing metadata for all 4 practice databases:
  - `ecommerce`: 8 tables, Beginner difficulty
  - `university`: 10 tables, Intermediate difficulty
  - `hr`: 7 tables, Intermediate difficulty
  - `banking`: 12 tables, Advanced difficulty
- `PracticeDatabaseProvider` component wraps the practice page
- `usePracticeDatabase()` hook provides access to:
  - `databaseInfo`: Current database metadata
  - `isLoading`: Loading state
  - `error`: Error message if initialization fails
  - `initializeDB()`: Function to manually initialize a database

**Auto-initialization**:
- When `dbId` prop is provided to the provider, it automatically loads the corresponding database
- Tracks loading state and errors for UI feedback

### 3. Updated PracticePage
**File**: `frontend/src/pages/playground/practice.tsx`

**Changes**:
- Split into two components:
  - `PracticePage`: Wrapper that provides database context
  - `PracticePageContent`: Actual page content that consumes the context
- Removed manual database loading logic (now handled by context)
- Uses `usePracticeDatabase()` hook to access database info and loading state
- Shows loading spinner while database initializes
- Shows error message if database fails to load
- Dynamically calculates thumbnail and category based on database ID

### 4. Updated Practice Components

All practice components were updated to use the database context:

#### DataPreview
**File**: `frontend/src/components/practice/DataPreview.tsx`
- Added `usePracticeDatabase()` hook
- Waits for database to be loaded before fetching tables
- Re-fetches data when database changes

#### PracticeTerminal
**File**: `frontend/src/components/practice/PracticeTerminal.tsx`
- Added `usePracticeDatabase()` hook
- Removed local database initialization (uses context instead)
- `dbReady` state derived from context loading state

#### JoinPathFinder
**File**: `frontend/src/components/practice/JoinPathFinder.tsx`
- Added `usePracticeDatabase()` hook
- Waits for database before loading tables
- Re-analyzes join paths when database changes

#### QueryLibrary
**File**: `frontend/src/components/practice/QueryLibrary.tsx`
- Added `usePracticeDatabase()` hook
- Dynamically fetches table names from current database
- Generates example queries using actual table names
- Simplified query templates to use generic examples

#### ERDiagramGenerator
**File**: `frontend/src/components/practice/ERDiagramGenerator.tsx`
- Added `usePracticeDatabase()` hook
- Removed local database initialization
- Uses context to determine when database is ready
- Regenerates ER diagram when database changes

### 5. Updated PracticeListPage
**File**: `frontend/src/pages/playground/PracticeListPage.tsx`

**Changes**:
- Updated database IDs to match context provider:
  - `01_ecommerce_shopnow` → `ecommerce`
  - `02_university_edutrack` → `university`
  - `03_hr_payroll_peoplecore` → `hr`
  - `04_banking_nexbank` → `banking`
- Updated table counts and difficulty levels to match actual databases

## Database Flow

### Loading Process
1. User clicks on a database card in PracticeListPage
2. Navigates to `/practice/:dbId` (e.g., `/practice/ecommerce`)
3. `PracticePage` component renders with URL parameter
4. `PracticeDatabaseProvider` receives `dbId` prop
5. Provider auto-initializes database:
   - Fetches SQL file from `/practiceData/:dbId.sql`
   - Calls `initializeDatabase()` with correct path
   - Updates context state with database info
6. `PracticePageContent` renders once database is loaded
7. All child components (DataPreview, Terminal, etc.) access database via context

### Component Communication
```
PracticePage
  └─ PracticeDatabaseProvider (manages database state)
      └─ PracticePageContent
          ├─ DataPreview (uses usePracticeDatabase)
          ├─ PracticeTerminal (uses usePracticeDatabase)
          └─ Tools Panel
              ├─ JoinPathFinder (uses usePracticeDatabase)
              ├─ QueryLibrary (uses usePracticeDatabase)
              ├─ ERBlock
              │   └─ ERDiagramGenerator (uses usePracticeDatabase)
              └─ AnalystBlock
```

## Database Files Required

The following SQL files must exist in `frontend/public/practiceData/`:
- `ecommerce.sql` - E-commerce database schema and data
- `university.sql` - University management database
- `hr.sql` - HR and payroll database
- `banking.sql` - Banking and finance database

## Benefits of This Architecture

1. **Isolation**: Each practice scenario works with its own database independently
2. **Centralized State**: All components access the same database instance via context
3. **Automatic Loading**: Database initializes automatically when navigating to a practice page
4. **Type Safety**: TypeScript interfaces ensure proper database metadata structure
5. **Error Handling**: Loading states and errors are properly managed
6. **Scalability**: Easy to add new databases by updating `databasesInfo` object
7. **Performance**: Database only initializes once per scenario, not for each component

## Testing

To test the implementation:
1. Start dev server: `npm run dev`
2. Navigate to Practice page: http://localhost:5173/practice
3. Click on any database card
4. Verify:
   - Database info displays correctly in header
   - DataPreview shows tables from that specific database
   - SQL Terminal executes queries on that database
   - JoinPathFinder analyzes relationships in that database
   - QueryLibrary shows examples with actual table names
   - ER Diagram generates from that database schema

## Future Enhancements

Potential improvements:
1. Add database caching to avoid reloading when switching between databases
2. Implement progress tracking per database
3. Add database comparison view
4. Support user-uploaded custom databases
5. Add database reset functionality
6. Implement query history per database
