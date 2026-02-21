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
  const isFullscreen = !onView;

  useEffect(() => {
    const loadTables = async () => {
      try {
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

    // Direct join detection
    const sourceSchema = getTableSchema(sourceTable, dbId);
    const targetSchema = getTableSchema(targetTable, dbId);

    // Check for foreign keys in source table
    sourceSchema.forEach((col: any) => {
      const colName = col[1].toLowerCase();
      const targetSingular = targetTable.toLowerCase().replace(/s$/, "");
      
      if (colName.includes(targetSingular + "_id")) {
        paths.push({
          from: sourceTable,
          to: targetTable,
          via: col[1],
          query: `SELECT * FROM ${sourceTable} s\nJOIN ${targetTable} t ON s.${col[1]} = t.${targetSingular}_id;`,
        });
      }
    });

    // Check for foreign keys in target table
    targetSchema.forEach((col: any) => {
      const colName = col[1].toLowerCase();
      const sourceSingular = sourceTable.toLowerCase().replace(/s$/, "");
      
      if (colName.includes(sourceSingular + "_id")) {
        paths.push({
          from: targetTable,
          to: sourceTable,
          via: col[1],
          query: `SELECT * FROM ${targetTable} t\nJOIN ${sourceTable} s ON t.${col[1]} = s.${sourceSingular}_id;`,
        });
      }
    });

    // Check for indirect joins through other tables
    tables.forEach((intermediateTable) => {
      if (intermediateTable === sourceTable || intermediateTable === targetTable) return;

      const intermediateSchema = getTableSchema(intermediateTable, dbId);
      const sourceSingular = sourceTable.toLowerCase().replace(/s$/, "");
      const targetSingular = targetTable.toLowerCase().replace(/s$/, "");

      let hasSourceFK = false;
      let hasTargetFK = false;
      let sourceFKCol = "";
      let targetFKCol = "";

      intermediateSchema.forEach((col: any) => {
        const colName = col[1].toLowerCase();
        if (colName.includes(sourceSingular + "_id")) {
          hasSourceFK = true;
          sourceFKCol = col[1];
        }
        if (colName.includes(targetSingular + "_id")) {
          hasTargetFK = true;
          targetFKCol = col[1];
        }
      });

      if (hasSourceFK && hasTargetFK) {
        paths.push({
          from: sourceTable,
          to: targetTable,
          via: intermediateTable,
          query: `SELECT s.*, t.* FROM ${sourceTable} s\nJOIN ${intermediateTable} i ON s.${sourceSingular}_id = i.${sourceFKCol}\nJOIN ${targetTable} t ON i.${targetFKCol} = t.${targetSingular}_id;`,
        });
      }
    });

    setJoinPaths(paths);
  };

  const copyQuery = (query: string) => {
    navigator.clipboard.writeText(query);
    alert("Query copied to clipboard!");
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm text-gray-800">Join Path Finder</h3>
        {onView && (
          <button 
            onClick={onView} 
            className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        )}
      </div>

      {/* Table Selectors */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-700">From</label>
          <select
            value={sourceTable}
            onChange={(e) => setSourceTable(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
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
            className="w-full p-2 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
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
      <div className="flex-1 overflow-y-auto">
        {joinPaths.length > 0 ? (
          <div className="space-y-2">
            {joinPaths.slice(0, 1).map((path, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-semibold text-orange-600">{path.from}</span>
                    <span className="text-gray-400">→</span>
                    {path.via !== path.from && path.via !== path.to && (
                      <>
                        <span className="text-blue-600 font-semibold">{path.via}</span>
                        <span className="text-gray-400">→</span>
                      </>
                    )}
                    <span className="font-semibold text-green-600">{path.to}</span>
                  </div>
                  <button
                    onClick={() => copyQuery(path.query)}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="text-xs bg-gray-900 text-green-400 p-2 rounded overflow-x-auto font-mono max-h-16">
                  {path.query.split('\n').slice(0, 2).join('\n')}...
                </pre>
              </div>
            ))}
            {joinPaths.length > 1 && (
              <p className="text-xs text-gray-500 text-center">+{joinPaths.length - 1} more paths</p>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <div className="text-2xl mb-1">🔍</div>
            <p className="text-xs font-medium">No join path found</p>
            <p className="text-xs">Try different tables</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinPathFinder;
