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
    const SQL = await initSqlJs({
      locateFile: () => "/sql-wasm.wasm",
    });

    db = new SQL.Database();

    const response = await fetch("/data/data.sql");
    const sqlText = await response.text();

    db.run(sqlText);

    console.log("Database initialized.");
  })();

  return initPromise;
};
export const executeQuery = async (query: string) => {
  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const result = db.exec(query);

    console.log("RAW SQL RESULT:", result); // 🔥 ADD THIS

   return {
  success: true,
  data: result,
};

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};


export const getTables = (): string[] => {
  if (!db) return [];

  const result = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table';"
  );

  if (!result.length) return [];

  return result[0].values.map((row: any[]) => row[0]);
};

export const getTableSchema = (table: string) => {
  if (!db) return [];

  const result = db.exec(`PRAGMA table_info(${table});`);
  return result.length ? result[0].values : [];
};

export const getTableData = (table: string) => {
  if (!db) return null;

  const result = db.exec(`SELECT * FROM ${table} LIMIT 50;`);
  return result.length ? result[0] : null;
};
