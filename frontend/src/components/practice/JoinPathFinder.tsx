import React, { useEffect, useState } from "react";
import { getTables, getTableSchema } from "../playground/compiler";

interface JoinPath {
  from: string;
  to: string;
  via: string;
  query: string;
}

const JoinPathFinder: React.FC<{ onView?: () => void }> = ({ onView }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [sourceTable, setSourceTable] = useState<string>("");
  const [targetTable, setTargetTable] = useState<string>("");
  const [joinPaths, setJoinPaths] = useState<JoinPath[]>([]);
  const isFullscreen = !onView;

  useEffect(() => {
    const loadTables = async () => {
      try {
        const tableList = await getTables();
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
  }, []);

  useEffect(() => {
    if (sourceTable && targetTable && sourceTable !== targetTable) {
      findJoinPaths();
    }
  }, [sourceTable, targetTable]);

  const findJoinPaths = () => {
    const paths: JoinPath[] = [];

    // Direct join detection
    const sourceSchema = getTableSchema(sourceTable);
    const targetSchema = getTableSchema(targetTable);

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

      const intermediateSchema = getTableSchema(intermediateTable);
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
    <div className={`bg-white p-4 rounded shadow ${!isFullscreen ? 'mb-4' : 'h-full flex flex-col overflow-auto'}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`font-semibold ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
          🔗 Join Path Finder
        </h2>
        {onView && (
          <button onClick={onView} className="text-blue-500 text-sm hover:underline">
            View Full
          </button>
        )}
      </div>

      {/* Table Selectors */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-600">From Table</label>
          <select
            value={sourceTable}
            onChange={(e) => setSourceTable(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-600">To Table</label>
          <select
            value={targetTable}
            onChange={(e) => setTargetTable(e.target.value)}
            className="w-full p-2 border rounded text-sm"
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
      {joinPaths.length > 0 ? (
        <div className="space-y-3">
          {joinPaths.map((path, i) => (
            <div key={i} className="border rounded p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-blue-600">{path.from}</span>
                  <span className="text-gray-400">→</span>
                  {path.via !== path.from && path.via !== path.to && (
                    <>
                      <span className="text-purple-600 font-semibold">{path.via}</span>
                      <span className="text-gray-400">→</span>
                    </>
                  )}
                  <span className="font-semibold text-green-600">{path.to}</span>
                </div>
                <button
                  onClick={() => copyQuery(path.query)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Copy
                </button>
              </div>
              <pre className="text-xs bg-gray-900 text-green-400 p-2 rounded overflow-x-auto font-mono">
                {path.query}
              </pre>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-sm">No direct join path found between these tables</p>
          <p className="text-xs mt-1">Try selecting different tables</p>
        </div>
      )}

      {!isFullscreen && joinPaths.length > 0 && (
        <p className="text-xs text-gray-500 mt-3 italic">
          Click View Full to see all possible join paths
        </p>
      )}
    </div>
  );
};

export default JoinPathFinder;
