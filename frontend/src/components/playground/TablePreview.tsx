import React, { useEffect, useState } from "react";
import { getTables, getTableData } from "./compiler";

interface Props {
  dbReady: boolean;
}

const TablePreview: React.FC<Props> = ({ dbReady }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!dbReady) return;

    const loadTables = async () => {
      const tableList = await getTables();
      setTables(tableList);
    };

    loadTables();
  }, [dbReady]);

  useEffect(() => {
    if (!dbReady || tables.length === 0) return;

    // Load data for all tables
    const loadAllTableData = async () => {
      const dataPromises = tables.map(async (table) => {
        const data = await getTableData(table);
        return { table, data };
      });

      const results = await Promise.all(dataPromises);
      const dataMap: Record<string, any> = {};
      results.forEach(({ table, data }) => {
        dataMap[table] = data;
      });
      setTableData(dataMap);
    };

    loadAllTableData();
  }, [tables, dbReady]);

  if (!dbReady) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-black/40 text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
          Loading tables...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-black/5 sticky top-0 bg-white z-10">
        <h3 className="text-sm font-semibold text-black/80" style={{ fontFamily: "'Playfair Display', serif" }}>
          Available Tables
        </h3>
      </div>

      <div className="p-4 space-y-6">
        {tables.map((table) => {
          const data = tableData[table];
          if (!data || !data.lc || !data.values) {
            return (
              <div key={table} className="space-y-2">
                <h4 className="text-xs font-semibold text-black/60 uppercase tracking-wide" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {table}
                </h4>
                <div className="text-black/40 text-xs">Loading...</div>
              </div>
            );
          }

          const columns = data.lc;
          const rows = data.values.slice(0, 10); // Show first 10 rows

          return (
            <div key={table} className="space-y-2">
              <h4 className="text-xs font-semibold text-black/60 uppercase tracking-wide" style={{ fontFamily: "'Syne', sans-serif" }}>
                {table}
              </h4>
              <div className="border border-black/10 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs border-collapse">
                    <thead className="bg-black/5">
                      <tr>
                        {columns.map((col: string, i: number) => (
                          <th
                            key={i}
                            className="px-3 py-2 text-left font-semibold text-black/70 border-b border-black/10"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row: any[], i: number) => (
                        <tr key={i} className="hover:bg-black/2 transition-colors">
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="px-3 py-2 border-b border-black/5 text-black/70"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.values.length > 10 && (
                  <div className="px-3 py-2 bg-black/2 text-xs text-black/50 text-center border-t border-black/5">
                    Showing 10 of {data.values.length} rows
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TablePreview;
