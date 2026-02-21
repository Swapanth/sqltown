import React, { useEffect, useState } from "react";
import { getTables, getTableSchema } from "../playground/compiler";

const TablesBlock: React.FC<{ onView?: () => void }> = ({ onView }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [schema, setSchema] = useState<any[]>([]);
  const isFullscreen = !onView; // If no onView prop, we're in fullscreen

  useEffect(() => {
    const loadTables = async () => {
      try {
        const tableList = await getTables();
        setTables(tableList);
        if (tableList.length > 0) {
          setSelectedTable(tableList[0]);
        }
      } catch (err) {
        console.error("Failed to load tables:", err);
      }
    };
    loadTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      const schemaData = getTableSchema(selectedTable);
      setSchema(schemaData);
    }
  }, [selectedTable]);

  return (
    <div className={`bg-white p-4 rounded shadow ${!isFullscreen ? 'mb-4' : 'h-full'}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`font-semibold ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
          {isFullscreen ? '' : '📋 Database Tables'}
        </h2>
        {onView && (
          <button onClick={onView} className="text-blue-500 text-sm hover:underline">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        )}
      </div>

      {tables.length > 0 ? (
        <>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full p-2 border rounded mb-3 text-sm"
          >
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>

          {schema.length > 0 && (
            <div className={`overflow-auto ${isFullscreen ? 'max-h-[600px]' : 'max-h-64'}`}>
              <table className="w-full text-xs border">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 border text-left">Column</th>
                    <th className="p-2 border text-left">Type</th>
                    <th className="p-2 border text-center">Not Null</th>
                    <th className="p-2 border text-center">PK</th>
                    {isFullscreen && <th className="p-2 border text-center">Default</th>}
                  </tr>
                </thead>
                <tbody>
                  {schema.map((col, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border font-mono font-semibold">{col[1]}</td>
                      <td className="p-2 border text-gray-600">{col[2]}</td>
                      <td className="p-2 border text-center">
                        {col[3] ? "✓" : ""}
                      </td>
                      <td className="p-2 border text-center">
                        {col[5] ? "✓" : ""}
                      </td>
                      {isFullscreen && <td className="p-2 border text-center text-gray-500">{col[4] || '-'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500">No tables found. Initialize database first.</p>
      )}
    </div>
  );
};

export default TablesBlock;
