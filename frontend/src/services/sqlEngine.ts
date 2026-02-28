import initSqlJs, { Database } from 'sql.js';

let SQL: any = null;

/**
 * Initialize sql.js library
 * Must be called once before creating databases
 */
export async function initializeSqlJs() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
}

/**
 * Create a new in-memory SQLite database
 */
export async function createDatabase(): Promise<Database> {
  if (!SQL) {
    await initializeSqlJs();
  }
  return new SQL.Database();
}

/**
 * Execute a single SQL query on a database
 * Returns the result of the query or throws an error
 */
export async function executeQuery(
  db: Database,
  query: string
): Promise<any> {
  try {
    const trimmedQuery = query.trim();
    
    // Normalize whitespace and remove comments for comparison
    const normalizedQuery = trimmedQuery
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/--.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalizedQuery) {
      throw new Error('Empty query');
    }

    // Execute the query
    const result = db.run(trimmedQuery);
    
    return {
      success: true,
      data: result,
      query: trimmedQuery,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage,
      query: query.trim(),
    };
  }
}

/**
 * Get the schema for a specific table
 */
export async function getTableSchema(
  db: Database,
  tableName: string
): Promise<any> {
  try {
    const result = db.exec(`PRAGMA table_info(${tableName})`);
    return result[0]?.values || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get schema for table ${tableName}: ${errorMessage}`);
  }
}

/**
 * Get all table names in the database
 */
export async function getTables(db: Database): Promise<string[]> {
  try {
    const result = db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    return result[0]?.values.map((row: any) => row[0]) || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get tables: ${errorMessage}`);
  }
}

/**
 * Execute a SELECT query and return formatted results
 */
export async function executeSelect(
  db: Database,
  query: string
): Promise<{
  success: boolean;
  columns?: string[];
  rows?: any[][];
  error?: string;
}> {
  try {
    const result = db.exec(query);
    if (result.length === 0) {
      return {
        success: true,
        columns: [],
        rows: [],
      };
    }

    const { columns, values } = result[0];
    return {
      success: true,
      columns,
      rows: values,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Reset database to empty state
 */
export async function resetDatabase(db: Database): Promise<void> {
  try {
    // Get all tables and drop them
    const tables = await getTables(db);
    for (const table of tables) {
      if (table !== 'sqlite_sequence') {
        db.run(`DROP TABLE IF EXISTS ${table}`);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to reset database: ${errorMessage}`);
  }
}
