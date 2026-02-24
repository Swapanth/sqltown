/**
 * Database Registry - Maps database IDs to their URLs (S3 or local)
 */

const API_BASE_URL = 'http://localhost:3000/api';

// In-memory cache of database URLs
const databaseUrlCache: Map<string, string> = new Map();

/**
 * Register a database URL in the cache
 */
export const registerDatabaseUrl = (dbId: string, url: string): void => {
  databaseUrlCache.set(dbId, url);
  console.log(`Registered database: ${dbId} -> ${url}`);
};

/**
 * Get the URL for a database ID
 * Returns S3 URL if available, otherwise falls back to local path
 */
export const getDatabaseUrl = async (dbId: string): Promise<string> => {
  // Check cache first
  if (databaseUrlCache.has(dbId)) {
    const url = databaseUrlCache.get(dbId)!;
    console.log(`Database ${dbId} found in cache: ${url}`);
    return url;
  }

  // Try to fetch from API
  try {
    const response = await fetch(`${API_BASE_URL}/list-databases`);
    if (response.ok) {
      const data = await response.json();
      
      // Populate cache with all databases
      if (data.databases && data.databases.length > 0) {
        for (const db of data.databases) {
          const id = db.filename.replace('.sql', '').replace(/^\d+-/, '');
          registerDatabaseUrl(id, db.url);
        }
      }

      // Check cache again
      if (databaseUrlCache.has(dbId)) {
        const url = databaseUrlCache.get(dbId)!;
        console.log(`Database ${dbId} loaded from API: ${url}`);
        return url;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch databases from API:', error);
  }

  // Fallback to local path
  const localPath = `/practiceData/${dbId}.sql`;
  console.log(`Using local fallback for ${dbId}: ${localPath}`);
  return localPath;
};

/**
 * Clear the database URL cache
 */
export const clearDatabaseCache = (): void => {
  databaseUrlCache.clear();
  console.log('Database URL cache cleared');
};

/**
 * Preload all database URLs from S3
 */
export const preloadDatabaseUrls = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/list-databases`);
    if (response.ok) {
      const data = await response.json();
      
      if (data.databases && data.databases.length > 0) {
        for (const db of data.databases) {
          const id = db.filename.replace('.sql', '').replace(/^\d+-/, '');
          registerDatabaseUrl(id, db.url);
        }
        console.log(`Preloaded ${data.databases.length} database URLs from S3`);
      }
    }
  } catch (error) {
    console.warn('Failed to preload database URLs:', error);
  }
};
