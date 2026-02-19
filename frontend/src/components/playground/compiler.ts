import initSqlJs from "sql.js";
import type { Database } from "sql.js";

let db: Database | null = null;
let initPromise: Promise<void> | null = null;

export const initializeDatabase = async (): Promise<void> => {
  // 🔥 If already initialized
  if (db) return;

  // 🔥 If already initializing
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      console.log("Starting database initialization...");
      
      const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
      });

      db = new SQL.Database();
      console.log("SQL.js database created");

      // Test if we can fetch the SQL file
      console.log("Attempting to fetch SQL file from:", "/data/data.sql");
      const response = await fetch("/data/data.sql");
      console.log("SQL file fetch response:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SQL file: ${response.status} ${response.statusText}`);
      }
      
      const sqlText = await response.text();
      console.log("SQL file loaded successfully");
      console.log("SQL file length:", sqlText.length);
      console.log("First 200 chars:", sqlText.substring(0, 200));

      // Execute the SQL
      console.log("Executing SQL...");
      db.run(sqlText);
      console.log("SQL executed successfully");

      // Test if tables were created
      console.log("Checking if tables were created...");
      const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table';");
      console.log("Tables query result:", tables);
      
      if (tables.length > 0) {
        console.log("Tables found:", tables[0].values);
        
        // Test if data was inserted
        const firstTable = tables[0].values[0][0];
        console.log("Testing data in first table:", firstTable);
        const count = db.exec(`SELECT COUNT(*) FROM ${firstTable};`);
        console.log(`Row count in ${firstTable}:`, count);
        
        // Test a sample query
        const sample = db.exec(`SELECT * FROM ${firstTable} LIMIT 3;`);
        console.log(`Sample data from ${firstTable}:`, sample);
      } else {
        console.error("No tables found after SQL execution!");
      }

      console.log("Database initialization completed successfully.");
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw error;
    }
  })();

  return initPromise;
};
export const executeQuery = async (query: string) => {
  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const result = db.exec(query);

    console.log("RAW SQL RESULT:", result);

    return {
      success: true,
      data: result,
    };

  } catch (error: any) {
    console.error("SQL Execution Error:", error);
    
    // Provide more detailed error messages
    let errorMessage = error.message;
    
    // Common SQL error patterns and user-friendly messages
    if (errorMessage.includes('no such table')) {
      const tableMatch = errorMessage.match(/no such table: (\w+)/);
      if (tableMatch) {
        errorMessage = `Table '${tableMatch[1]}' does not exist. Available tables: Customers, Restaurants, MenuItems, Orders, OrderItems`;
      }
    } else if (errorMessage.includes('no such column')) {
      const columnMatch = errorMessage.match(/no such column: (\w+)/);
      if (columnMatch) {
        errorMessage = `Column '${columnMatch[1]}' does not exist. Check the Schema tab to see available columns.`;
      }
    } else if (errorMessage.includes('syntax error')) {
      errorMessage = `SQL syntax error: ${errorMessage}. Check your SQL syntax and try again.`;
    } else if (errorMessage.includes('ambiguous column name')) {
      errorMessage = `Ambiguous column name. Use table aliases or fully qualified column names (e.g., table.column).`;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};


export const getTables = async (): Promise<string[]> => {
  console.log("getTables called, db exists:", !!db);
  
  // If database is not ready, wait for initialization
  if (!db) {
    console.log("Database not ready, waiting for initialization...");
    await initializeDatabase();
  }
  
  if (!db) {
    console.error("Database still not available after initialization");
    return [];
  }

  const result = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table';"
  );

  console.log("getTables result:", result);

  if (!result.length) return [];

  const tables = result[0].values.map((row: any[]) => row[0]);
  console.log("Extracted table names:", tables);
  
  return tables;
};

export const getTableSchema = (table: string) => {
  if (!db) return [];

  const result = db.exec(`PRAGMA table_info(${table});`);
  return result.length ? result[0].values : [];
};

export const getTableData = async (table: string) => {
  console.log(`getTableData called for table: ${table}, db exists:`, !!db);
  
  // If database is not ready, wait for initialization
  if (!db) {
    console.log("Database not ready for getTableData, waiting for initialization...");
    await initializeDatabase();
  }
  
  if (!db) {
    console.error("Database still not available after initialization");
    return null;
  }

  const result = db.exec(`SELECT * FROM ${table} LIMIT 50;`);
  
  console.log(`Table data for ${table}:`, result);
  
  if (!result.length) return null;
  
  // Return the first result which contains columns and values
  const tableData = result[0];
  console.log(`Processed table data:`, tableData);
  
  return tableData;
};
