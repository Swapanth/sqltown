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
      db.exec(`DROP TABLE IF EXISTS ${tableName}`);
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
  // Check if we're switching to a different database
  const isSwitchingDatabase = dbId && currentDbId !== dbId;
  
  // 🔥 If already initialized for this database and not switching
  if (!isSwitchingDatabase && db && currentDbId === dbId) {
    console.log(`Database '${dbId}' already initialized, skipping`);
    return;
  }

  // 🔥 If already initializing and not switching
  if (!isSwitchingDatabase && initPromise) {
    console.log(`Database initialization already in progress`);
    return initPromise;
  }

  // If we're switching databases, log it
  if (isSwitchingDatabase) {
    console.log(`Switching from database '${currentDbId}' to '${dbId}' - will reload`);
    initPromise = null; // Reset the promise so we can re-initialize
  }

  initPromise = (async () => {
    try {
      console.log("Starting database initialization for:", dbId || "default");
      
      // Update current database ID
      currentDbId = dbId || null;
      
      // Initialize Alasql (it's a singleton)
      db = alasql;
      
      // Clear all existing tables from Alasql
      clearAllTables();
      
      console.log("Alasql database initialized and cleared");

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
      
      // Split SQL into individual statements
      // Handle apostrophes in string values by using a more sophisticated split
      const statements: string[] = [];
      let currentStmt = '';
      let inString = false;
      let stringChar = '';
      
      for (let i = 0; i < sqlText.length; i++) {
        const char = sqlText[i];
        
        // Track if we're inside a string
        if ((char === "'" || char === '"') && sqlText[i - 1] !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
            stringChar = '';
          }
        }
        
        currentStmt += char;
        
        // Split on semicolon only if not inside a string
        if (char === ';' && !inString) {
          const trimmed = currentStmt.trim();
          if (trimmed.length > 0 && !trimmed.startsWith('--')) {
            statements.push(trimmed.substring(0, trimmed.length - 1).trim()); // Remove the semicolon
          }
          currentStmt = '';
        }
      }
      
      // Add the last statement if any
      if (currentStmt.trim().length > 0 && !currentStmt.trim().startsWith('--')) {
        statements.push(currentStmt.trim());
      }
      
      console.log(`Found ${statements.length} SQL statements to execute`);
      
      let createTableErrors = 0;
      let successfulTables = 0;
      let insertErrors = 0;
      let successfulInserts = 0;
      
      // Function to transform MySQL syntax to Alasql-compatible syntax
      const transformSQLStatement = (stmt: string): string => {
        let transformed = stmt;
        
        // Replace AUTO_INCREMENT with AUTOINCREMENT (Alasql syntax)
        transformed = transformed.replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT');
        
        // Replace UNIQUE KEY with UNIQUE constraint inline
        transformed = transformed.replace(/UNIQUE\s+KEY\s+`[^`]+`\s*\(([^)]+)\)/gi, 'UNIQUE($1)');
        
        // Remove ENGINE, CHARSET, COLLATE clauses (not supported in Alasql)
        transformed = transformed.replace(/ENGINE\s*=\s*\w+/gi, '');
        transformed = transformed.replace(/DEFAULT\s+CHARSET\s*=\s*\w+/gi, '');
        transformed = transformed.replace(/COLLATE\s*=\s*\w+/gi, '');
        
        // Convert ENUM to VARCHAR (Alasql doesn't support ENUM)
        transformed = transformed.replace(/ENUM\s*\([^)]+\)/gi, 'VARCHAR(50)');
        
        // Convert BOOLEAN/BOOL to INT (Alasql doesn't have native BOOLEAN)
        transformed = transformed.replace(/\sBOOLEAN\b/gi, ' INT');
        transformed = transformed.replace(/\sBOOL\b/gi, ' INT');
        
        // Convert DATETIME to DATE (Alasql has limited DATETIME support)
        // Keep it as is for now, but if issues arise we can change to DATE
        // transformed = transformed.replace(/DATETIME/gi, 'DATE');
        
        // Remove DEFAULT CURRENT_TIMESTAMP (Alasql doesn't support it the same way)
        transformed = transformed.replace(/DEFAULT\s+CURRENT_TIMESTAMP/gi, '');
        
        // Remove ON UPDATE CURRENT_TIMESTAMP
        transformed = transformed.replace(/ON\s+UPDATE\s+CURRENT_TIMESTAMP/gi, '');
        
        // Remove FOREIGN KEY constraints for now (Alasql has limited FK support)
        transformed = transformed.replace(/,\s*FOREIGN\s+KEY\s*\([^)]+\)\s*REFERENCES\s+[^\s,)]+\s*\([^)]+\)(\s+ON\s+DELETE\s+\w+)?(\s+ON\s+UPDATE\s+\w+)?/gi, '');
        
        // Remove KEY indexes (Alasql doesn't need explicit KEY definitions)
        transformed = transformed.replace(/,\s*KEY\s+`[^`]+`\s*\([^)]+\)/gi, '');
        
        // Remove backticks from identifiers (Alasql doesn't handle them well)
        transformed = transformed.replace(/`/g, '');
        
        // Handle reserved keywords as table names by wrapping them in square brackets
        // AlaSQL reserved keywords that might be used as table names
        const reservedKeywords = ['RETURN', 'RETURNS', 'FUNCTION', 'PROCEDURE', 'TRIGGER', 'VIEW', 'INDEX', 'BEGIN', 'END', 'IF', 'THEN', 'ELSE', 'WHILE', 'LOOP', 'REPEAT'];
        reservedKeywords.forEach(keyword => {
          // For CREATE TABLE returns -> CREATE TABLE [returns]
          transformed = transformed.replace(new RegExp(`CREATE\\s+TABLE\\s+(${keyword})\\s*\\(`, 'gi'), `CREATE TABLE [${keyword}] (`);
          // For INSERT INTO returns -> INSERT INTO [returns]
          transformed = transformed.replace(new RegExp(`INSERT\\s+INTO\\s+(${keyword})\\s*\\(`, 'gi'), `INSERT INTO [${keyword}] (`);
          // For SELECT FROM returns -> SELECT FROM [returns]
          transformed = transformed.replace(new RegExp(`FROM\\s+(${keyword})\\b`, 'gi'), `FROM [${keyword}]`);
        });
        
        // Clean up any double commas or trailing commas before closing parenthesis
        transformed = transformed.replace(/,\s*,/g, ',');
        transformed = transformed.replace(/,\s*\)/g, ')');
        
        return transformed;
      };
      
      // Function to fix common data errors in INSERT statements
      const fixInsertStatement = (stmt: string): string => {
        let fixed = stmt;
        
        // Step 1: Remove single quotes from column names in the column list
        // Find the portion before VALUES and replace quoted identifiers
        const valuesIndex = fixed.toUpperCase().indexOf(' VALUES');
        if (valuesIndex > 0) {
          const beforeValues = fixed.substring(0, valuesIndex);
          const afterValues = fixed.substring(valuesIndex);
          
          // Debug: log what we're trying to fix
          console.log(`🔍 Before VALUES (first 150 chars):`, beforeValues.substring(0, 150));
          
          // Debug: find quoted columns
          const quotedColumns = beforeValues.match(/'([a-zA-Z_][a-zA-Z0-9_]*)'/g);
          if (quotedColumns && quotedColumns.length > 0) {
            console.log(`🔧 Found ${quotedColumns.length} quoted column names:`, quotedColumns.join(', '));
          } else {
            console.log(`✓ No quoted column names found in INSERT statement`);
          }
          
          // In the column list portion, replace 'columnname' with columnname
          // But be careful not to replace string values
          const fixedBefore = beforeValues.replace(/'([a-zA-Z_][a-zA-Z0-9_]*)'/g, '$1');
          
          // Debug: check if anything changed
          if (beforeValues !== fixedBefore) {
            console.log(`✅ Successfully removed quotes from column names`);
            console.log(`🔍 After fix (first 150 chars):`, fixedBefore.substring(0, 150));
          }
          
          // Step 2: Fix unquoted string values in the VALUES portion ONLY (common error: ,India, should be ,'India',)
          // Match pattern: ,word, where word contains only letters and is not a number or NULL
          const fixedAfter = afterValues.replace(/,\s*([A-Za-z][A-Za-z]+)\s*,/g, (match, word) => {
            // Don't quote SQL keywords like NULL, TRUE, FALSE
            const keywords = ['NULL', 'TRUE', 'FALSE', 'DEFAULT'];
            if (keywords.includes(word.toUpperCase())) {
              return match;
            }
            // Quote the word
            return `,'${word}',`;
          });
          
          fixed = fixedBefore + fixedAfter;
        } else {
          console.log(`⚠️ No VALUES keyword found in INSERT statement`);
        }
         
        return fixed;
      };
      
      for (let i = 0; i < statements.length; i++) {
        let statement = statements[i];
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
            
            // Transform MySQL-specific syntax to Alasql-compatible syntax
            if (isCreateTable) {
              statement = transformSQLStatement(statement);
              // Extract table name for logging
              const tableNameMatch = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?/i);
              const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown';
              console.log(`Executing CREATE TABLE for '${tableName}' (statement ${i + 1}):`, statement.substring(0, 150) + '...');
            } else if (isInsert) {
              console.log(`📋 Original INSERT ${i + 1} (first 200 chars):`, statement.substring(0, 200));
              // Transform reserved keywords first
              statement = transformSQLStatement(statement);
              console.log(`🔄 After transformSQLStatement (first 200 chars):`, statement.substring(0, 200));
              // Then fix common data errors in INSERT statements
              statement = fixInsertStatement(statement);
              console.log(`✅ Final statement before execution (first 200 chars):`, statement.substring(0, 200));
            } else {
              console.log(`Executing statement ${i + 1}:`, statement.substring(0, 100) + '...');
            }
            
            // Execute with Alasql
            db.exec(statement);
            
            // Log success with table name for CREATE TABLE
            if (isCreateTable) {
              const tableNameMatch = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?/i);
              const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown';
              console.log(`✓ Successfully created table '${tableName}' (statement ${i + 1})`);
              successfulTables++;
            } else {
              console.log(`Statement ${i + 1} executed successfully`);
            }
            
            // Count successful statements by type
            if (isInsert) {
              successfulInserts++;
            }
          } catch (stmtError) {
            const isCreateTable = statement.toUpperCase().includes('CREATE TABLE');
            const isInsert = statement.toUpperCase().includes('INSERT INTO');
            
            console.error(`Error executing statement ${i + 1}:`, stmtError);
            
            if (isCreateTable) {
              const tableNameMatch = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?/i);
              const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown';
              console.error(`✗ Failed to create table '${tableName}':`, stmtError);
              console.error(`Failed CREATE TABLE statement (first 300 chars):`, statement.substring(0, 300));
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
    // Try to access Alasql's internal table structure
    const alasqlTable = (db as any).tables?.[table];
    console.log("Alasql table structure:", alasqlTable);
    
    if (alasqlTable && alasqlTable.columns) {
      // Use Alasql's column definitions
      return alasqlTable.columns.map((col: any, index: number) => {
        const colName = col.columnid || col.name || `column_${index}`;
        const colLower = colName.toLowerCase();
        
        // Detect if column is a primary key (check column name pattern)
        const tableSingular = table.toLowerCase().replace(/s$/, '').replace(/ies$/, 'y').replace(/es$/, '');
        const isPK = colLower.includes('_id') && 
                     (colLower === `${table.toLowerCase()}_id` ||
                      colLower === `${tableSingular}_id` ||
                      index === 0); // First column often PK
        
        // Detect if column is a foreign key (ends with _id but not the table's own PK)
        const isFK = colLower.includes('_id') && !isPK;
        
        // Get data type (Alasql may have dbtypeid or we infer from name)
        let dataType = 'TEXT';
        if (col.dbtypeid) {
          dataType = col.dbtypeid.toUpperCase();
        } else if (colLower.includes('id')) {
          dataType = 'INTEGER';
        } else if (colLower.includes('price') || 
                   colLower.includes('amount') ||
                   colLower.includes('salary')) {
          dataType = 'DECIMAL';
        } else if (colLower.includes('date')) {
          dataType = 'DATE';
        }
        
        // Detect nullable - assume columns can be null unless they are PK
        const isNullable = !isPK;
        
        return [
          index, // cid
          colName, // name
          dataType, // type
          isNullable ? 1 : 0, // nullable (1 = can be null, 0 = NOT NULL)
          null, // dflt_value
          isPK ? 1 : 0, // pk
          isFK ? 1 : 0 // fk (added)
        ];
      });
    }
    
    // Fallback: Try to get a sample row to determine column structure
    const sampleResult = db.exec(`SELECT * FROM ${table} LIMIT 1`);
    console.log("Sample result for schema:", sampleResult);
    
    if (Array.isArray(sampleResult) && sampleResult.length > 0 && typeof sampleResult[0] === 'object') {
      // Extract column names from the first row
      const columns = Object.keys(sampleResult[0]);
      
      // Try to infer types from sample data
      const sampleRow = sampleResult[0];
      
      return columns.map((col, index) => {
        const value = sampleRow[col];
        const colLower = col.toLowerCase();
        let dataType = 'TEXT';
        
        // Infer type from column name and sample value
        if (colLower.includes('id')) {
          dataType = 'INTEGER';
        } else if (colLower.includes('price') || 
                   colLower.includes('amount') ||
                   colLower.includes('salary') ||
                   colLower.includes('rating')) {
          dataType = 'DECIMAL';
        } else if (colLower.includes('date')) {
          dataType = 'DATE';
        } else if (colLower.includes('time')) {
          dataType = 'DATETIME';
        } else if (typeof value === 'number') {
          dataType = Number.isInteger(value) ? 'INTEGER' : 'DECIMAL';
        } else if (value instanceof Date) {
          dataType = 'DATETIME';
        }
        
        // Detect if column is likely a primary key
        const tableSingular = table.toLowerCase().replace(/s$/, '').replace(/ies$/, 'y').replace(/es$/, '');
        const isPK = colLower.includes('_id') && 
                     (colLower === `${table.toLowerCase()}_id` ||
                      colLower === `${tableSingular}_id` ||
                      index === 0);
        
        // Detect if column is a foreign key (ends with _id but not the table's own PK)
        const isFK = colLower.includes('_id') && !isPK;
        
        // Detect nullable - assume columns can be null unless they are PK
        const isNullable = !isPK;
        
        return [
          index, // cid
          col, // name
          dataType, // type
          isNullable ? 1 : 0, // nullable (1 = can be null, 0 = NOT NULL)
          null, // dflt_value (unknown)
          isPK ? 1 : 0, // pk
          isFK ? 1 : 0 // fk (added)
        ];
      });
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
    // Alasql approach: Just get all rows and count them
    // This is more reliable than COUNT(*) which has parsing issues with backticks
    try {
      const result = db.exec(`SELECT * FROM ${table}`);
      console.log(`Row count result for ${table}:`, result?.length || 0);
      
      if (Array.isArray(result)) {
        return result.length;
      }
      return 0;
    } catch (selectError) {
      console.log("SELECT * failed:", selectError);
      return 0;
    }
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
    const result = db.exec(`SELECT * FROM ${table} LIMIT ${pageSize} OFFSET ${offset}`);
    
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
