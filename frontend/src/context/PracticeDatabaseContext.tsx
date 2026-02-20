import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { initializeDatabase } from '../components/playground/compiler';

interface DatabaseInfo {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tables: number;
  sqlPath: string;
}

interface PracticeDatabaseContextType {
  databaseInfo: DatabaseInfo | null;
  isLoading: boolean;
  error: string | null;
  initializeDB: (dbInfo: DatabaseInfo) => Promise<void>;
}

const PracticeDatabaseContext = createContext<PracticeDatabaseContextType | undefined>(undefined);

export const databasesInfo: Record<string, DatabaseInfo> = {
  ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce Store',
    description: 'Master product catalogs, orders, and customer relationships',
    difficulty: 'Beginner',
    tables: 14,
    sqlPath: '/practiceData/01_ecommerce_shopnow.sql',
  },
  university: {
    id: 'university',
    name: 'University System',
    description: 'Explore student enrollment, courses, and academic records',
    difficulty: 'Intermediate',
    tables: 19,
    sqlPath: '/practiceData/02_university_edutrack.sql',
  },
  hr: {
    id: 'hr',
    name: 'HR Management',
    description: 'Navigate employee hierarchies and department structures',
    difficulty: 'Intermediate',
    tables: 16,
    sqlPath: '/practiceData/03_hr_payroll_peoplecore.sql',
  },
  banking: {
    id: 'banking',
    name: 'Banking System',
    description: 'Handle complex transactions and account management',
    difficulty: 'Advanced',
    tables: 17,
    sqlPath: '/practiceData/04_banking_nexbank.sql',
  },
};

interface PracticeDatabaseProviderProps {
  children: ReactNode;
  dbId?: string;
}

export const PracticeDatabaseProvider: React.FC<PracticeDatabaseProviderProps> = ({ children, dbId }) => {
  const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as loading
  const [error, setError] = useState<string | null>(null);
  const initializingDbIdRef = useRef<string | null>(null);

  const initializeDB = async (dbInfo: DatabaseInfo) => {
    // Prevent duplicate initializations using ref (synchronous check)
    if (initializingDbIdRef.current === dbInfo.id) {
      console.log(`Already initializing ${dbInfo.id}, skipping duplicate call`);
      return;
    }

    initializingDbIdRef.current = dbInfo.id;
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Initializing database: ${dbInfo.name} (${dbInfo.id})`);
      await initializeDatabase(dbInfo.sqlPath, dbInfo.id);
      setDatabaseInfo(dbInfo);
      console.log(`Database ${dbInfo.id} initialized successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize database';
      setError(errorMessage);
      console.error('Database initialization error:', err);
    } finally {
      setIsLoading(false);
      initializingDbIdRef.current = null;
    }
  };

  // Auto-initialize when dbId prop changes
  useEffect(() => {
    if (dbId) {
      if (databasesInfo[dbId]) {
        const dbInfo = databasesInfo[dbId];
        // Only initialize if it's a different database or not loaded yet
        if (!databaseInfo || databaseInfo.id !== dbId) {
          initializeDB(dbInfo);
        }
      } else {
        // Invalid database ID
        setIsLoading(false);
        setError(`Database '${dbId}' not found`);
      }
    } else {
      // No database ID provided
      setIsLoading(false);
    }
  }, [dbId]); // Note: intentionally not including databaseInfo to avoid infinite loops

  return (
    <PracticeDatabaseContext.Provider value={{ databaseInfo, isLoading, error, initializeDB }}>
      {children}
    </PracticeDatabaseContext.Provider>
  );
};

export const usePracticeDatabase = (): PracticeDatabaseContextType => {
  const context = useContext(PracticeDatabaseContext);
  if (context === undefined) {
    throw new Error('usePracticeDatabase must be used within a PracticeDatabaseProvider');
  }
  return context;
};
