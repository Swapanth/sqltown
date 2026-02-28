import { Database } from 'sql.js';
import {
  createDatabase,
  executeQuery,
  executeSelect,
  resetDatabase,
  getTables,
} from './sqlEngine';

export interface GameLevelSchema {
  tables: {
    name: string;
    createStatement: string;
  }[];
}

export interface QueryResult {
  success: boolean;
  message?: string;
  error?: string;
  rowsAffected?: number;
  selectResult?: {
    columns: string[];
    rows: any[][];
  };
}

/**
 * GameLevelDatabase manages SQL execution for a specific game level
 * Each level has its own isolated in-memory SQLite database
 */
export class GameLevelDatabase {
  private db: Database | null = null;
  private levelId: number;
  private schema: GameLevelSchema | null = null;
  private initializedTables: Set<string> = new Set();

  constructor(levelId: number) {
    this.levelId = levelId;
  }

  /**
   * Initialize the database with the level's schema
   */
  async initialize(schema: GameLevelSchema): Promise<void> {
    if (!this.db) {
      this.db = await createDatabase();
    }
    
    this.schema = schema;
    this.initializedTables.clear();

    // Create all tables for this level
    for (const table of schema.tables) {
      try {
        const result = await executeQuery(this.db, table.createStatement);
        if (result.success) {
          this.initializedTables.add(table.name);
        }
      } catch (error) {
        console.error(`Failed to create table ${table.name}:`, error);
      }
    }
  }

  /**
   * Execute a query on the level's database
   */
  async executeQuery(sql: string): Promise<QueryResult> {
    if (!this.db) {
      return {
        success: false,
        error: 'Database not initialized. Call initialize() first.',
      };
    }

    const trimmedSql = sql.trim();

    if (!trimmedSql) {
      return {
        success: false,
        error: 'Empty query',
      };
    }

    try {
      // Check if this is a SELECT query
      const isSelect = /^\s*SELECT\s+/i.test(trimmedSql);

      if (isSelect) {
        const selectResult = await executeSelect(this.db, trimmedSql);
        if (!selectResult.success) {
          return {
            success: false,
            error: selectResult.error,
          };
        }
        return {
          success: true,
          message: `Query returned ${selectResult.rows?.length || 0} rows`,
          selectResult: {
            columns: selectResult.columns || [],
            rows: selectResult.rows || [],
          },
        };
      } else {
        // INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, etc.
        const result = await executeQuery(this.db, trimmedSql);

        if (!result.success) {
          return {
            success: false,
            error: result.error,
          };
        }

        // Get the number of affected rows for DML statements
        let rowsAffected = 0;
        if (/^\s*(INSERT|UPDATE|DELETE)\s+/i.test(trimmedSql)) {
          // sql.js result format varies, but changes array length indicates affected rows
          const changes = (this.db as any).getRowsModified?.() || 0;
          rowsAffected = changes;
        }

        return {
          success: true,
          message: this.getSuccessMessage(trimmedSql, rowsAffected),
          rowsAffected,
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Execution error: ${errorMessage}`,
      };
    }
  }

  /**
   * Validate if a query matches the expected command for a level
   */
  validateQueryExecution(
    userQuery: string,
    expectedQuery: string
  ): { isValid: boolean; reason?: string } {
    const normalizeQuery = (q: string) => {
      return q
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/;\s*$/, ''); // Remove trailing semicolon
    };

    const userNormalized = normalizeQuery(userQuery);
    const expectedNormalized = normalizeQuery(expectedQuery);

    if (userNormalized === expectedNormalized) {
      return { isValid: true };
    }

    // For SELECT queries, be a bit more lenient (allow different formatting)
    if (userNormalized.startsWith('select')) {
      // Both must be SELECT and have similar structure
      return {
        isValid: false,
        reason: 'SQL query does not match expected command exactly',
      };
    }

    return {
      isValid: false,
      reason: 'SQL query does not match expected command',
    };
  }

  /**
   * Get the current database state/schema
   */
  async getSchema(): Promise<GameLevelSchema | null> {
    return this.schema;
  }

  /**
   * Get all tables in the current database
   */
  async getTables(): Promise<string[]> {
    if (!this.db) {
      return [];
    }
    return getTables(this.db);
  }

  /**
   * Reset the database to its initial state
   */
  async reset(): Promise<void> {
    if (this.db) {
      await resetDatabase(this.db);
      this.initializedTables.clear();
      
      // Reinitialize schema if available
      if (this.schema) {
        await this.initialize(this.schema);
      }
    }
  }

  /**
   * Close and clean up the database
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.schema = null;
      this.initializedTables.clear();
    }
  }

  /**
   * Helper to generate success messages
   */
  private getSuccessMessage(query: string, rowsAffected: number): string {
    const upperQuery = query.toUpperCase();

    if (upperQuery.startsWith('CREATE TABLE')) {
      const match = query.match(/CREATE\s+TABLE\s+(\w+)/i);
      const tableName = match?.[1] || 'table';
      return `Table '${tableName}' created successfully`;
    }

    if (upperQuery.startsWith('CREATE DATABASE')) {
      const match = query.match(/CREATE\s+DATABASE\s+(\w+)/i);
      const dbName = match?.[1] || 'database';
      return `Database '${dbName}' created successfully`;
    }

    if (upperQuery.startsWith('INSERT')) {
      return rowsAffected
        ? `${rowsAffected} row${rowsAffected !== 1 ? 's' : ''} inserted`
        : 'Insert successful';
    }

    if (upperQuery.startsWith('UPDATE')) {
      return rowsAffected
        ? `${rowsAffected} row${rowsAffected !== 1 ? 's' : ''} updated`
        : 'Update successful';
    }

    if (upperQuery.startsWith('DELETE')) {
      return rowsAffected
        ? `${rowsAffected} row${rowsAffected !== 1 ? 's' : ''} deleted`
        : 'Delete successful';
    }

    if (upperQuery.startsWith('ALTER TABLE')) {
      return 'Table altered successfully';
    }

    return 'Query executed successfully';
  }
}
