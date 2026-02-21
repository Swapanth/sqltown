import alasql from "alasql";

let db: any = null;
let initPromise: Promise<void> | null = null;
let currentDbId: string | null = null;

// Function to clear all existing tables
const clearAllTables = () => {
  if (!db || !db.tables) return;
  
  const existingTables = Object.keys(db.tables);
  console.log("Clearing existing tables:", existingTables);
  
  for (const tableName of existingTables) {
    try {
      db.exec(`DROP TABLE IF EXISTS \`${tableName}\``);
      console.log(`Dropped table: ${tableName}`);
    } catch (dropError) {
      console.log(`Could not drop table ${tableName}:`, dropError);
    }
  }
  
  // Also clear the internal tables object
  if (db.tables) {
    Object.keys(db.tables).forEach(key => {
      delete db.tables[key];
    });
  }
};

export const initializeDatabase = async (dbId?: string): Promise<void> => {
  // If we're switching to a different database, reset everything
  if (dbId && currentDbId !== dbId) {
    console.log(`Switching from database '${currentDbId}' to '${dbId}' - clearing old data`);
    
    // Clear all existing tables from Alasql
    clearAllTables();
    
    db = null;
    initPromise = null;
    currentDbId = dbId;
  }
  
  // 🔥 If already initialized for this database
  if (db && currentDbId === dbId) return;

  // 🔥 If already initializing
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      console.log("Starting database initialization for:", dbId || "default");
      
      // Initialize Alasql (it supports MySQL syntax natively)
      db = alasql;
      console.log("Alasql database initialized");

      // Determine which SQL file to load
      let sqlFilePath = "/data/data.sql"; // default fallback
      if (dbId) {
        sqlFilePath = `/practiceData/${dbId}.sql`;
      }

      // Test if we can fetch the SQL file
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

      // Execute the SQL directly (Alasql supports MySQL syntax)
      console.log("Executing SQL...");
      
      // Split SQL into individual statements and execute them one by one
      const statements = sqlText
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      console.log(`Found ${statements.length} SQL statements to execute`);
      
      let createTableErrors = 0;
      let successfulTables = 0;
      let insertErrors = 0;
      let successfulInserts = 0;
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim()) {
          try {
            const isCreateTable = statement.toUpperCase().includes('CREATE TABLE');
            const isInsert = statement.toUpperCase().includes('INSERT INTO');
            const isCreateDatabase = statement.toUpperCase().includes('CREATE DATABASE');
            const isUse = statement.toUpperCase().includes('USE ');
            
            // Skip CREATE DATABASE and USE statements (not needed in Alasql)
            if (isCreateDatabase || isUse) {
              console.log(`Skipping statement ${i + 1}: ${statement.substring(0, 50)}...`);
              continue;
            }
            
            if (isCreateTable) {
              console.log(`Executing CREATE TABLE ${i + 1}:`, statement.substring(0, 150) + '...');
            } else if (isInsert) {
              console.log(`Executing INSERT ${i + 1}:`, statement.substring(0, 100) + '...');
            } else {
              console.log(`Executing statement ${i + 1}:`, statement.substring(0, 100) + '...');
            }
            
            // Execute with Alasql
            db.exec(statement);
            console.log(`Statement ${i + 1} executed successfully`);
            
            // Count successful statements by type
            if (isCreateTable) {
              successfulTables++;
            } else if (isInsert) {
              successfulInserts++;
            }
          } catch (stmtError) {
            const isCreateTable = statement.toUpperCase().includes('CREATE TABLE');
            const isInsert = statement.toUpperCase().includes('INSERT INTO');
            
            console.error(`Error executing statement ${i + 1}:`, stmtError);
            
            if (isCreateTable) {
              console.error(`Failed CREATE TABLE statement:`, statement);
              createTableErrors++;
            } else if (isInsert) {
              console.error(`Failed INSERT statement (first 200 chars):`, statement.substring(0, 200));
              insertErrors++;
            } else {
              console.error(`Failed statement:`, statement);
            }
          }
        }
      }
      
      console.log(`SQL execution completed.`);
      console.log(`Tables: ${successfulTables} created, ${createTableErrors} failed`);
      console.log(`Inserts: ${successfulInserts} successful, ${insertErrors} failed`);

      // Test if tables were created
      console.log("Checking if tables were created...");
      try {
        // Try to get tables from internal structure first
        if (db.tables && typeof db.tables === 'object') {
          const tableNames = Object.keys(db.tables);
          console.log("Tables found:", tableNames);
          
          if (tableNames.length > 0) {
            console.log(`Successfully created ${tableNames.length} tables for database: ${dbId}`);
            
            // Test data in first table if available
            const firstTableName = tableNames[0];
            if (firstTableName) {
              console.log("Testing data in first table:", firstTableName);
              try {
                const sampleData = db.exec(`SELECT * FROM \`${firstTableName}\` LIMIT 1`);
                console.log(`Sample data from ${firstTableName}:`, sampleData);
              } catch (sampleError) {
                console.log("Error getting sample data:", sampleError);
              }
            }
          } else {
            console.error("No tables found after SQL execution!");
          }
        } else {
          console.log("Could not access internal tables structure");
        }
      } catch (tableCheckError) {
        console.error("Error checking tables:", tableCheckError);
      }

      console.log(`Database initialization completed successfully for: ${dbId}`);
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw error;
    }
  })();

  return initPromise;
};
export const executeQuery = async (query: string, dbId?: string) => {
  // Ensure database is initialized with correct dbId
  if (!db || (dbId && currentDbId !== dbId)) {
    await initializeDatabase(dbId);
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    console.log("Executing query:", query);
    const result = db.exec(query);

    console.log("RAW Alasql RESULT:", result);

    // Convert Alasql result format to match the expected format
    let formattedResult = [];
    
    // If result is an array of objects (typical Alasql SELECT result), convert to sql.js format
    if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object') {
      const columns = Object.keys(result[0]);
      const values = result.map(row => 
        columns.map(col => {
          const value = row[col];
          // Handle null, undefined, and other edge cases
          return value !== undefined ? value : null;
        })
      );
      
      formattedResult = [{
        columns: columns,
        values: values
      }];
    } else if (Array.isArray(result) && result.length === 0) {
      // Empty result set
      formattedResult = [];
    } else {
      // Other types of results (like INSERT, UPDATE, DELETE)
      formattedResult = result;
    }

    return {
      success: true,
      data: formattedResult,
    };

  } catch (error: any) {
    console.error("SQL Execution Error:", error);
    
    // Provide more detailed error messages
    let errorMessage = error.message;
    
    // Common SQL error patterns and user-friendly messages
    if (errorMessage.includes('no such table') || errorMessage.includes('Table') && errorMessage.includes('not found')) {
      const tableMatch = errorMessage.match(/Table '([^']+)' not found|no such table: (\w+)/);
      if (tableMatch) {
        const tableName = tableMatch[1] || tableMatch[2];
        errorMessage = `Table '${tableName}' does not exist. Check available tables in the Schema tab.`;
      }
    } else if (errorMessage.includes('no such column') || errorMessage.includes('Column') && errorMessage.includes('not found')) {
      const columnMatch = errorMessage.match(/Column '([^']+)' not found|no such column: (\w+)/);
      if (columnMatch) {
        const columnName = columnMatch[1] || columnMatch[2];
        errorMessage = `Column '${columnName}' does not exist. Check the Schema tab to see available columns.`;
      }
    } else if (errorMessage.includes('syntax error') || errorMessage.includes('Syntax error')) {
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


export const getTables = async (dbId?: string): Promise<string[]> => {
  console.log("getTables called, db exists:", !!db, "dbId:", dbId, "currentDbId:", currentDbId);
  
  // If database is not ready, wait for initialization
  if (!db || (dbId && currentDbId !== dbId)) {
    console.log("Database not ready, waiting for initialization...");
    await initializeDatabase(dbId);
  }
  
  if (!db) {
    console.error("Database still not available after initialization");
    return [];
  }

  try {
    // Method 1: Try to get tables from Alasql's internal structure
    let tables: string[] = [];
    
    try {
      // Access Alasql's internal tables object
      if (db.tables && typeof db.tables === 'object') {
        tables = Object.keys(db.tables);
        console.log(`Got ${tables.length} tables from internal structure for dbId '${dbId}':`, tables);
      }
    } catch (internalError) {
      console.log("Internal tables access failed:", internalError);
    }
    
    // If we got tables from internal structure, return them
    if (tables.length > 0) {
      console.log(`Returning ${tables.length} tables for database '${dbId}':`, tables);
      return tables.filter(name => name && typeof name === 'string');
    }
    
    // Method 2: Try SHOW TABLES command
    try {
      const result = db.exec("SHOW TABLES");
      console.log("SHOW TABLES result:", result);
      
      if (Array.isArray(result) && result.length > 0) {
        // Handle different possible formats
        if (typeof result[0] === 'string') {
          tables = result;
        } else if (typeof result[0] === 'object') {
          // Extract table names from object properties
          const firstObj = result[0];
          if (firstObj.tableid || firstObj.table_name || firstObj.Tables_in_database) {
            // Try different common property names
            tables = result.map(obj => 
              obj.tableid || obj.table_name || obj.Tables_in_database || 
              obj.TABLE_NAME || Object.values(obj)[0]
            ).filter(Boolean);
          } else {
            // If it's an object with table names as keys
            tables = Object.keys(firstObj);
          }
        }
      }
    } catch (showError) {
      console.log("SHOW TABLES failed:", showError);
    }

    console.log(`Final result: ${tables.length} tables for database '${dbId}':`, tables);
    return tables.filter(name => name && typeof name === 'string');
    
  } catch (error) {
    console.error("Error getting tables:", error);
    return [];
  }
};

export const getTableSchema = (table: string, dbId?: string) => {
  if (!db || (dbId && currentDbId !== dbId)) {
    console.log("Database not ready for getTableSchema, need to initialize first");
    return [];
  }

  try {
    // For Alasql, we can try to get schema information from the table structure
    // Since Alasql doesn't have a standard DESCRIBE command, we'll use a different approach
    
    // Try to get a sample row to determine column structure
    const sampleResult = db.exec(`SELECT * FROM \`${table}\` LIMIT 1`);
    console.log("Sample result for schema:", sampleResult);
    
    if (Array.isArray(sampleResult) && sampleResult.length > 0 && typeof sampleResult[0] === 'object') {
      // Extract column names from the first row
      const columns = Object.keys(sampleResult[0]);
      
      // Create a schema-like structure (simplified)
      return columns.map((col, index) => [
        index, // cid
        col, // name
        'TEXT', // type (simplified - Alasql doesn't provide detailed type info easily)
        0, // notnull (unknown)
        null, // dflt_value (unknown)
        0 // pk (unknown)
      ]);
    }
    
    return [];
  } catch (error) {
    console.error("Error getting table schema:", error);
    return [];
  }
};

export const getTableRowCount = async (table: string, dbId?: string): Promise<number> => {
  console.log(`getTableRowCount called for table: ${table}, dbId:`, dbId);
  
  // If database is not ready, wait for initialization
  if (!db || (dbId && currentDbId !== dbId)) {
    console.log("Database not ready for getTableRowCount, waiting for initialization...");
    await initializeDatabase(dbId);
  }
  
  if (!db) {
    console.error("Database still not available after initialization");
    return 0;
  }

  try {
    // Try different COUNT syntax approaches for Alasql
    let result;
    
    try {
      // Method 1: Simple COUNT without alias
      result = db.exec(`SELECT COUNT() FROM \`${table}\``);
      console.log(`Row count result (COUNT()) for ${table}:`, result);
    } catch (countError) {
      console.log("COUNT() failed, trying alternative:", countError);
      
      try {
        // Method 2: Get all rows and count them (less efficient but works)
        result = db.exec(`SELECT * FROM \`${table}\``);
        console.log(`Row count result (SELECT *) for ${table}:`, result?.length || 0);
        
        if (Array.isArray(result)) {
          return result.length;
        }
      } catch (selectError) {
        console.log("SELECT * also failed:", selectError);
        return 0;
      }
    }
    
    if (Array.isArray(result) && result.length > 0) {
      // Handle different possible result formats from Alasql
      if (typeof result[0] === 'object') {
        const count = result[0].count || result[0].COUNT || result[0]['COUNT()'] || result[0]['COUNT(*)'] || 0;
        console.log(`Total rows in ${table}:`, count);
        return count;
      } else if (typeof result[0] === 'number') {
        console.log(`Total rows in ${table}:`, result[0]);
        return result[0];
      }
    }
    
    return 0;
  } catch (error) {
    console.error(`Error getting row count for table ${table}:`, error);
    return 0;
  }
};

export const getTableData = async (table: string, dbId?: string, page: number = 1, pageSize: number = 20) => {
  console.log(`getTableData called for table: ${table}, db exists:`, !!db, "dbId:", dbId, "page:", page, "pageSize:", pageSize);
  
  // If database is not ready, wait for initialization
  if (!db || (dbId && currentDbId !== dbId)) {
    console.log("Database not ready for getTableData, waiting for initialization...");
    await initializeDatabase(dbId);
  }
  
  if (!db) {
    console.error("Database still not available after initialization");
    return null;
  }

  try {
    const offset = (page - 1) * pageSize;
    const result = db.exec(`SELECT * FROM \`${table}\` LIMIT ${pageSize} OFFSET ${offset}`);
    
    console.log(`Table data for ${table} (page ${page}):`, result);
    
    if (!result || result.length === 0) return null;
    
    // Handle Alasql result format - it returns an array of objects
    if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object') {
      // Convert array of objects to sql.js format (columns + values)
      const columns = Object.keys(result[0]);
      const values = result.map(row => 
        columns.map(col => {
          const value = row[col];
          // Handle null, undefined, and other edge cases
          return value !== undefined ? value : null;
        })
      );
      
      const tableData = {
        columns: columns,
        values: values
      };
      
      console.log(`Processed table data:`, tableData);
      return tableData;
    }
    
    // If it's already in the expected format (shouldn't happen with Alasql)
    if (result[0] && result[0].columns && result[0].values) {
      return result[0];
    }
    
    // If it's some other format, try to handle it
    console.warn("Unexpected result format:", result);
    return null;
  } catch (error) {
    console.error(`Error getting data for table ${table}:`, error);
    return null;
  }
};
