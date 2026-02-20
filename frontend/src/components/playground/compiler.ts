import initSqlJs from "sql.js";
import type { Database } from "sql.js";

let db: Database | null = null;
let currentDatabaseId: string | null = null;

// Use a Map to track initialization promises by database ID
const initPromiseCache = new Map<string, Promise<void>>();

export const initializeDatabase = async (sqlFilePath: string = "/data/data.sql", databaseId: string = "default"): Promise<void> => {
  // 🔥 If already initialized with the same database, return immediately
  if (db && currentDatabaseId === databaseId) {
    console.log(`Database ${databaseId} already initialized, skipping`);
    return;
  }

  // 🔥 If already initializing this database, return the cached promise
  if (initPromiseCache.has(databaseId)) {
    console.log(`Database ${databaseId} already initializing, returning cached promise`);
    return initPromiseCache.get(databaseId)!;
  }

  // 🔥 If switching databases, close the old one and clear its promise
  if (db && currentDatabaseId !== databaseId) {
    console.log(`Switching from ${currentDatabaseId} to ${databaseId}`);
    try {
      db.close();
    } catch (e) {
      console.warn("Error closing old database:", e);
    }
    db = null;
    currentDatabaseId = null;
    // Clear ALL cached promises to ensure fresh start
    initPromiseCache.clear();
  }

  // Create a variable to hold the promise resolution
  let resolveInit!: () => void;
  let rejectInit!: (error: any) => void;

  // Create and cache a placeholder promise IMMEDIATELY (synchronously)
  const placeholderPromise = new Promise<void>((resolve, reject) => {
    resolveInit = resolve;
    rejectInit = reject;
  });
  
  initPromiseCache.set(databaseId, placeholderPromise);

  // Now do the actual async initialization
  (async () => {
    try {
      console.log(`Starting database initialization for: ${databaseId}...`);
      console.log(`SQL file path: ${sqlFilePath}`);
      
      const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
      });

      // Double-check: ensure db is null before creating new instance
      if (db) {
        console.warn("Database still exists before creation, forcibly closing...");
        try {
          db.close();
        } catch (e) {
          console.warn("Error closing lingering database:", e);
        }
        db = null;
      }
      
      // Create a completely fresh database instance
      db = new SQL.Database();
      currentDatabaseId = databaseId; // Set current database ID after creating DB
      console.log("SQL.js database created");

      // Fetch the SQL file
      console.log("Attempting to fetch SQL file from:", sqlFilePath);
      const response = await fetch(sqlFilePath);
      console.log("SQL file fetch response:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SQL file: ${response.status} ${response.statusText}`);
      }
      
      const sqlText = await response.text();
      console.log("SQL file loaded successfully");
      console.log("SQL file length:", sqlText.length);
      console.log("First 200 chars:", sqlText.substring(0, 200));

      // Clean up MySQL-specific syntax for SQLite compatibility
      let cleanedSql = sqlText
        // First, fix line-wrapped quoted strings by joining lines that end mid-quote
        //  Match patterns like: 'text\ntext' OR 'text\nmore\nmore' with multiple newlines
        .replace(/'[^']*?(?:\r?\n[^']*?)*'/g, (match) => {
          return match.replace(/\r?\n/g, ' ');
        })
        // Remove CREATE DATABASE and USE statements
        .replace(/CREATE DATABASE[^;]*;/gi, '')
        .replace(/USE\s+[\w`]+;/gi, '')
        // Convert INT PRIMARY KEY AUTO_INCREMENT to INTEGER PRIMARY KEY AUTOINCREMENT
        .replace(/INT\s+PRIMARY\s+KEY\s+AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        // Replace remaining AUTO_INCREMENT with AUTOINCREMENT
        .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
        // Replace INT with INTEGER for general cases
        .replace(/\bINT\b/gi, 'INTEGER')
        // Remove ENUM types and replace with TEXT (handle multi-line ENUMs with [\s\S] to match newlines)
        .replace(/ENUM\s*\([\s\S]*?\)/gi, 'TEXT')
        // Replace DATETIME with TEXT (SQLite doesn't have DATETIME type)
        .replace(/DATETIME/gi, 'TEXT')
        // Replace BOOLEAN with INTEGER
        .replace(/BOOLEAN/gi, 'INTEGER')
        // Remove DEFAULT CURRENT_TIMESTAMP (can cause issues)
        .replace(/DEFAULT\s+CURRENT_TIMESTAMP/gi, '')
        // Remove backticks (MySQL identifier quotes)
        .replace(/`/g, '')
        // Fix unquoted country names in INSERT statements (common issue)
        .replace(/,India,/g, ",'India',")
        .replace(/,USA,/g, ",'USA',")
        .replace(/,UK,/g, ",'UK',")
        .replace(/,NULL,/g, ",NULL,") // Keep NULL unquoted
        // Clean up multiple semicolons
        .replace(/;\s*;/g, ';')
        // Remove empty lines
        .split('\n')
        .filter(line => line.trim().length > 0)
        .join('\n');

      console.log("SQL cleaned for SQLite compatibility");
      console.log("Cleaned SQL first 200 chars:", cleanedSql.substring(0, 200));
      
      // Debug: Save cleaned SQL for inspection
      const searchStrs = ["nsferred", "sferred", " s'", "'s'", "' s", "s ,", ", s"];
      searchStrs.forEach(str => {
        if (cleanedSql.includes(str)) {
          const idx = cleanedSql.indexOf(str);
          console.error(`Found suspicious pattern "${str}" at position ${idx}:`);
          console.error(cleanedSql.substring(Math.max(0, idx - 50), idx + 50));
        }
      });
      
      // Debug: Check if ENUM was properly replaced
      if (cleanedSql.includes('ENUM')) {
        console.error("WARNING: ENUM still present in cleaned SQL!");
        const enumMatch = cleanedSql.match(/ENUM[\s\S]{0,100}/);
        if (enumMatch) console.error("ENUM found:", enumMatch[0]);
      }
      
      // Debug: Check for the specific error area around 'students'
      const studentMatch = cleanedSql.match(/CREATE TABLE students[\s\S]{0,500}/);
      if (studentMatch) {
        console.log("CREATE TABLE students section:", studentMatch[0]);
      }

      // Execute the SQL
      console.log("Executing SQL...");
      try {
        db.run(cleanedSql);
      } catch (sqlError: any) {
        console.error("Full SQL execution failed:", sqlError.message);
        console.error("Database is in a broken state, recreating...");
        
        // Close the broken database and create a fresh one
        try {
          db.close();
        } catch (e) {
          console.warn("Error closing broken database:", e);
        }
        
        const SQL = await initSqlJs({
          locateFile: () => "/sql-wasm.wasm",
        });
        db = new SQL.Database();
        console.log("Fresh database created for statement-by-statement execution");
        
        // Split more intelligently: only on )...; (with optional whitespace) followed by CREATE/INSERT/ALTER/DROP
        // This preserves multi-line INSERT statements even if there's a newline before the semicolon
        const statements = cleanedSql
          .split(/\)[\s]*;[\s]*(?=CREATE|INSERT|ALTER|DROP)/i)
          .map((stmt, idx, arr) => {
            // Re-add the ); that was removed by split, except for the last one
            if (idx < arr.length - 1 && stmt.trim()) {
              return stmt + ');';
            }
            return stmt;
          })
          .map(s => s.trim())
          .filter(s => s.length > 0);
        console.log(`Trying to execute ${statements.length} statements individually...`);
        
        for (let i = 0; i < Math.min(statements.length, 50); i++) {
          try {
            db.run(statements[i]);
          } catch (stmtError: any) {
            console.error(`\n❌ ERROR at statement ${i + 1}/${statements.length}:`);
            console.error(`Message: ${stmtError.message}`);
            console.error(`SQL (first 500 chars):`);
            console.error(statements[i].substring(0, 500));
            console.error(`SQL (last 200 chars):`);
            const stmt = statements[i];
            console.error(stmt.substring(Math.max(0, stmt.length - 200)));
                        // Show previous statement too for context
            if (i > 0) {
              console.error(`\nPrevious statement ${i} (last 300 chars):`);
              const prev = statements[i - 1];
              console.error(prev.substring(Math.max(0, prev.length - 300)));
            }
                        // Look for problematic patterns
            if (statements[i].includes('nsferred') || statements[i].includes('sferred')) {
              console.error("⚠️  Found line-wrapped ENUM value!");
            }
            
            throw stmtError;
          }
        }
      }
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

      console.log(`Database ${databaseId} initialization completed successfully.`);
      resolveInit(); // Resolve the placeholder promise
    } catch (error) {
      console.error("Database initialization failed:", error);
      
      // Clean up on error
      if (db) {
        db.close();
      }
      db = null;
      currentDatabaseId = null;
      initPromiseCache.delete(databaseId); // Remove failed promise from cache
      
      rejectInit(error); // Reject the placeholder promise
    }
  })();

  // Return the cached placeholder promise
  return placeholderPromise;
};

export const getCurrentDatabaseId = (): string | null => {
  return currentDatabaseId;
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
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
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
  console.log(`Result length:`, result.length);
  
  if (!result.length) return null;
  
  // SQL.js returns results with 'columns' and 'values' properties
  // Note: The actual property might be 'lc' in some versions, so we handle both
  const tableData = result[0];
  console.log(`Processed table data:`, tableData);
  console.log(`Table data keys:`, Object.keys(tableData));
  
  // Normalize the response to use 'columns' and 'values'
  // @ts-ignore - SQL.js may use 'lc' or 'columns' depending on version
  const columns = tableData.columns || tableData.lc || [];
  const values = tableData.values || [];
  
  console.log(`Normalized columns:`, columns);
  console.log(`Normalized values length:`, values.length);
  
  return {
    columns,
    values
  };
};
