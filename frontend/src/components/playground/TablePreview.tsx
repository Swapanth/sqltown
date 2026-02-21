import React, { useEffect, useState } from "react";
import { getTables, getTableData } from "./compiler";

interface Props {
  dbReady: boolean;
  dbId?: string;
}

const TablePreview: React.FC<Props> = ({ dbReady, dbId }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, any>>({});
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!dbReady) return;

    const loadTables = async () => {
      const tableList = await getTables(dbId);
      setTables(tableList);
      // Expand first table by default
      if (tableList.length > 0) {
        setExpandedTables(new Set([tableList[0]]));
      }
    };

    loadTables();
  }, [dbReady]);

  useEffect(() => {
    if (!dbReady || expandedTables.size === 0) return;

    // Load data only for expanded tables
    const loadExpandedTableData = async () => {
      const dataPromises = Array.from(expandedTables).map(async (table) => {
        if (tableData[table]) return { table, data: tableData[table] }; // Skip if already loaded
        const data = await getTableData(table, dbId, 1, 10); // page 1, 10 rows
        return { table, data };
      });

      const results = await Promise.all(dataPromises);
      const dataMap: Record<string, any> = { ...tableData };
      results.forEach(({ table, data }) => {
        dataMap[table] = data;
      });
      setTableData(dataMap);
    };

    loadExpandedTableData();
  }, [expandedTables, dbReady, dbId]);

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
        <div className="text-black/40 text-sm">
          Loading tables...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-black/5 sticky top-0 bg-white z-10">
        <h3 className="text-sm font-semibold text-black/80">
          Available Tables
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {tables.map((table) => {
          const isExpanded = expandedTables.has(table);
          const data = tableData[table];

          return (
            <div key={table} className="space-y-2">
              {/* Table Header with Expand/Collapse */}
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-black/5 rounded-lg p-2 -m-2 transition-colors"
                onClick={() => toggleTable(table)}
              >
                <h4 className="text-xs font-semibold text-black/60 uppercase tracking-wide">
                  {table}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-black/40">
                    {isExpanded ? 'Hide' : 'Show'} data
                  </span>
                  <svg
                    className={`w-3 h-3 text-black/40 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Table Data (only show if expanded) */}
              {isExpanded && (
                <>
                  {!data || (!data.columns && !data.lc) || !data.values ? (
                    <div className="text-black/40 text-xs ml-4">Loading...</div>
                  ) : (
                    <div className="border border-black/10 rounded-lg overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs border-collapse">
                          <thead className="bg-black/5">
                            <tr>
                              {(data.columns || data.lc).map((col: string, i: number) => (
                                <th
                                  key={i}
                                  className="px-3 py-2 text-left font-semibold text-black/70 border-b border-black/10"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {data.values.map((row: any[], i: number) => (
                              <tr key={i} className="hover:bg-black/2 transition-colors">
                                {row.map((cell, j) => (
                                  <td
                                    key={j}
                                    className="px-3 py-2 border-b border-black/5 text-black/70"
                                  >
                                    {cell !== null ? cell : <span className="text-black/40 italic">NULL</span>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="px-3 py-2 bg-black/2 text-xs text-black/50 text-center border-t border-black/5">
                        Showing first 10 rows
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TablePreview;
