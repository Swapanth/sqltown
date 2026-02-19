import React, { useEffect, useState } from "react";
import { getTables, getTableSchema } from "./compiler";

interface Props {
  dbReady: boolean;
}

const SchemaBrowser: React.FC<Props> = ({ dbReady }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [schemas, setSchemas] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (!dbReady) return;

    const loadTables = async () => {
      const tableList = await getTables();
      setTables(tableList);
      // Expand first table by default
      if (tableList.length > 0) {
        setExpandedTables(new Set([tableList[0]]));
      }
    };

    loadTables();
  }, [dbReady]);

  useEffect(() => {
    if (!dbReady) return;

    // Load schemas for expanded tables
    expandedTables.forEach((tableName) => {
      if (!schemas[tableName]) {
        const schema = getTableSchema(tableName);
        setSchemas((prev) => ({ ...prev, [tableName]: schema }));
      }
    });
  }, [expandedTables, dbReady]);

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tableName)) {
        newSet.delete(tableName);
      } else {
        newSet.add(tableName);
      }
      return newSet;
    });
  };

  if (!dbReady) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-black/40 text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
          Loading database...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-black/5">
        <h3 className="text-sm font-semibold text-black/80" style={{ fontFamily: "'Playfair Display', serif" }}>
          Schema
        </h3>
      </div>
      
      <div className="p-2">
        {tables.map((table) => {
          const isExpanded = expandedTables.has(table);
          const schema = schemas[table] || [];

          return (
            <div key={table} className="mb-1">
              <button
                onClick={() => toggleTable(table)}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-black/5 rounded-md transition-colors group"
              >
                <span className="text-sm font-medium text-black/80" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {table}
                </span>
                <span className="text-black/40 text-xs group-hover:text-black/60">
                  {isExpanded ? "−" : "+"}
                </span>
              </button>

              {isExpanded && schema.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {schema.map((col: any[], i: number) => {
                    const colName = col[1];
                    const colType = col[2];
                    const isPrimaryKey = col[5];
                    const isNotNull = col[3];

                    return (
                      <div
                        key={i}
                        className="px-3 py-1.5 text-xs text-black/60 hover:bg-black/3 rounded"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-black/80">{colName}</span>
                          <span className="text-black/40">[{colType}]</span>
                          {isPrimaryKey && (
                            <span className="px-1.5 py-0.5 bg-[#E67350]/10 text-[#E67350] rounded text-[10px] font-medium">
                              PK
                            </span>
                          )}
                          {isNotNull && (
                            <span className="px-1.5 py-0.5 bg-black/5 text-black/60 rounded text-[10px]">
                              NOT NULL
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SchemaBrowser;
