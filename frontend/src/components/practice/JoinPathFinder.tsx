import React, { useEffect, useState } from "react";
import { getTables, getTableSchema } from "../playground/compiler";

interface JoinPath {
  from: string;
  to: string;
  via: string;
  query: string;
}

const JoinPathFinder: React.FC<{ onView?: () => void; dbId?: string }> = ({ onView, dbId }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [sourceTable, setSourceTable] = useState<string>("");
  const [targetTable, setTargetTable] = useState<string>("");
  const [joinPaths, setJoinPaths] = useState<JoinPath[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isFullscreen = !onView;

  useEffect(() => {
    const loadTables = async () => {
      try {
        // Reset state when switching databases
        setTables([]);
        setSourceTable("");
        setTargetTable("");
        setJoinPaths([]);
        
        const tableList = await getTables(dbId);
        setTables(tableList);
        if (tableList.length >= 2) {
          setSourceTable(tableList[0]);
          setTargetTable(tableList[1]);
        }
      } catch (err) {
        console.error("Failed to load tables:", err);
      }
    };
    loadTables();
  }, [dbId]);

  useEffect(() => {
    if (sourceTable && targetTable && sourceTable !== targetTable) {
      findJoinPaths();
    }
  }, [sourceTable, targetTable]);

  const findJoinPaths = () => {
    const paths: JoinPath[] = [];

    // Get schemas for all tables
    const sourceSchema = getTableSchema(sourceTable, dbId);
    const targetSchema = getTableSchema(targetTable, dbId);

    // Helper function to find likely primary key column (first column ending with _id matching table name)
    const getPrimaryKey = (tableName: string, schema: any[]) => {
      const tableNameLower = tableName.toLowerCase();
      const tableSingular = tableNameLower.replace(/s$/, '').replace(/ies$/, 'y').replace(/es$/, '');
      
      // First, look for exact match: customer_id in customers table
      let pkCol = schema.find((col: any) => {
        const colName = col[1].toLowerCase();
        return colName === `${tableSingular}_id` || colName === `${tableNameLower}_id`;
      });
      
      // If not found, try first column (common pattern)
      if (!pkCol && schema.length > 0) {
        const firstCol = schema[0][1].toLowerCase();
        if (firstCol.includes('_id')) {
          pkCol = schema[0];
        }
      }
      
      return pkCol ? pkCol[1] : null;
    };

    // Helper function to extract base name from column (e.g., "customer_id" -> "customer")
    const getBaseName = (colName: string) => {
      return colName.replace(/_id$/i, '');
    };

    // Helper function to check if column name matches table name
    const doesColumnMatchTable = (colName: string, tableName: string) => {
      const colLower = colName.toLowerCase();
      const tableLower = tableName.toLowerCase();
      const tableSingular = tableLower.replace(/s$/, '').replace(/ies$/, 'y').replace(/es$/, '');
      const baseName = getBaseName(colLower);
      
      return baseName === tableLower || baseName === tableSingular || 
             tableLower.includes(baseName) || tableSingular.includes(baseName) ||
             colLower === `${tableSingular}_id` || colLower === `${tableLower}_id`;
    };

    // Get primary keys
    const sourcePK = getPrimaryKey(sourceTable, sourceSchema);
    const targetPK = getPrimaryKey(targetTable, targetSchema);

    console.log(`Finding joins between ${sourceTable} (PK: ${sourcePK}) and ${targetTable} (PK: ${targetPK})`);

    // Strategy 1: Direct FK relationship - source table has column referencing target table
    sourceSchema.forEach((col: any) => {
      const colName = col[1];
      const colNameLower = colName.toLowerCase();
      
      // Skip if not an ID column
      if (!colNameLower.includes('_id')) return;
      
      // Check if this column references the target table
      if (doesColumnMatchTable(colName, targetTable) && targetPK) {
        paths.push({
          from: sourceTable,
          to: targetTable,
          via: colName,
          query: `SELECT * FROM ${sourceTable} s\nJOIN ${targetTable} t ON s.${colName} = t.${targetPK};`,
        });
      }
    });

    // Strategy 2: Reverse FK relationship - target table has column referencing source table
    targetSchema.forEach((col: any) => {
      const colName = col[1];
      const colNameLower = colName.toLowerCase();
      
      // Skip if not an ID column
      if (!colNameLower.includes('_id')) return;
      
      // Check if this column references the source table
      if (doesColumnMatchTable(colName, sourceTable) && sourcePK) {
        paths.push({
          from: sourceTable,
          to: targetTable,
          via: colName,
          query: `SELECT * FROM ${sourceTable} s\nJOIN ${targetTable} t ON s.${sourcePK} = t.${colName};`,
        });
      }
    });

    // Strategy 3: Many-to-many through intermediate (junction) table
    tables.forEach((intermediateTable) => {
      if (intermediateTable === sourceTable || intermediateTable === targetTable) return;

      const intermediateSchema = getTableSchema(intermediateTable, dbId);
      
      let sourceFKCol = null;
      let targetFKCol = null;

      // Find columns in intermediate table that reference source and target
      intermediateSchema.forEach((col: any) => {
        const colName = col[1];
        const colNameLower = colName.toLowerCase();
        
        if (!colNameLower.includes('_id')) return;
        
        // Check if this references source table
        if (doesColumnMatchTable(colName, sourceTable)) {
          sourceFKCol = colName;
        }
        
        // Check if this references target table
        if (doesColumnMatchTable(colName, targetTable)) {
          targetFKCol = colName;
        }
      });

      // If intermediate table has both FKs, create join path
      if (sourceFKCol && targetFKCol && sourcePK && targetPK) {
        paths.push({
          from: sourceTable,
          to: targetTable,
          via: intermediateTable,
          query: `SELECT s.*, t.* FROM ${sourceTable} s\nJOIN ${intermediateTable} i ON s.${sourcePK} = i.${sourceFKCol}\nJOIN ${targetTable} t ON i.${targetFKCol} = t.${targetPK};`,
        });
      }
    });

    // Remove duplicate paths
    const uniquePaths = paths.filter((path, index, self) =>
      index === self.findIndex((p) => p.query === path.query)
    );

    console.log(`Found ${uniquePaths.length} join paths between ${sourceTable} and ${targetTable}:`, uniquePaths);
    setJoinPaths(uniquePaths);
  };

  const copyQuery = (query: string, index: number) => {
    navigator.clipboard.writeText(query);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full flex flex-col p-3">
      <style>{`
        .scrollable-join::-webkit-scrollbar {
          width: 4px;
        }
        .scrollable-join::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .scrollable-join::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .scrollable-join::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-xs text-gray-800">Join Path Finder</h3>
        {onView && (
          <button 
            onClick={onView} 
            className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        )}
      </div>

      {/* Table Selectors */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-700">From</label>
          <select
            value={sourceTable}
            onChange={(e) => setSourceTable(e.target.value)}
            className="w-full p-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
          >
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-700">To</label>
          <select
            value={targetTable}
            onChange={(e) => setTargetTable(e.target.value)}
            className="w-full p-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
          >
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Join Paths */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollable-join">
        {joinPaths.length > 0 ? (
          <div className="space-y-1.5 h-full">
            {joinPaths.slice(0, isFullscreen ? joinPaths.length : 1).map((path, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="font-semibold text-orange-600 px-2 py-1 bg-orange-50 rounded">{path.from}</span>
                    <span className="text-gray-400">→</span>
                    {path.via !== path.from && path.via !== path.to && !path.via.includes('_id') && (
                      <>
                        <span className="text-blue-600 font-semibold px-2 py-1 bg-blue-50 rounded">{path.via}</span>
                        <span className="text-gray-400">→</span>
                      </>
                    )}
                    {path.via.includes('_id') && (
                      <span className="text-xs text-gray-500 italic">via {path.via}</span>
                    )}
                    <span className="font-semibold text-green-600 px-2 py-1 bg-green-50 rounded">{path.to}</span>
                  </div>
                  <button
                    onClick={() => copyQuery(path.query, i)}
                    className={`text-xs px-2 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                      copiedIndex === i 
                        ? 'bg-green-600 text-white' 
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {copiedIndex === i ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className={`text-xs bg-gray-900 text-green-400 p-2 rounded overflow-x-auto font-mono ${isFullscreen ? 'max-h-32' : 'max-h-16'}`}>
                  {isFullscreen ? path.query : path.query.split('\n').slice(0, 2).join('\n') + '...'}
                </pre>
              </div>
            ))}
            {!isFullscreen && joinPaths.length > 1 && (
              <p className="text-xs text-gray-500 text-center py-2 bg-blue-50 rounded">
                +{joinPaths.length - 1} more path{joinPaths.length > 2 ? 's' : ''} - Click expand to view all
              </p>
            )}
            
            {/* Sample Join Pattern - Show in compact view */}
            {!isFullscreen && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-semibold text-blue-800 mb-1.5">💡 Sample JOIN:</p>
                <div className="text-xs bg-white p-1.5 rounded border border-blue-100">
                  <p className="font-mono text-blue-600 mb-1"># INNER JOIN</p>
                  <code className="text-gray-700">SELECT * FROM A<br/>JOIN B ON A.id = B.a_id</code>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Compact view - Show only sample pattern */}
            {!isFullscreen ? (
              <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1.5">
                  <span className="text-base">📚</span>
                  Sample JOIN Pattern
                </p>
                <div className="text-xs bg-white p-1.5 rounded-lg border border-blue-100 shadow-sm">
                  <p className="font-mono text-blue-600 mb-1 font-semibold"># INNER JOIN</p>
                  <code className="text-gray-700 block">SELECT * FROM customers c</code>
                  <code className="text-gray-700 block">JOIN orders o</code>
                  <code className="text-gray-700 block">ON c.customer_id = o.customer_id</code>
                </div>
                <p className="text-xs text-blue-600 mt-2 text-center italic">
                  💡 Select different tables above to find specific joins
                </p>
              </div>
            ) : (
              /* Fullscreen view - Show detailed message */
              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="text-3xl mb-2">🔗</div>
                <p className="text-sm font-semibold text-gray-600 mb-1">No Direct Join Path Found</p>
                <p className="text-xs text-gray-500 mb-3">
                  These tables don't appear to have a direct relationship
                </p>
                <div className="text-xs text-gray-600 bg-white p-3 rounded border border-gray-200 max-w-md mx-auto">
                  <p className="font-semibold mb-2">💡 Try:</p>
                  <ul className="text-left space-y-1">
                    <li>• Select tables that share common columns</li>
                    <li>• Look for tables with foreign key relationships</li>
                    <li>• Check if there's an intermediate linking table</li>
                  </ul>
                  {tables.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="font-semibold mb-2">Available tables ({tables.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {tables.map(table => (
                          <span key={table} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                            {table}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JoinPathFinder;
