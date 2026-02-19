import React, { useEffect, useState } from "react";
import { getTables, getTableData, getTableSchema } from "../playground/compiler";

const DataPreview: React.FC<{ onView?: () => void }> = ({ onView }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [schema, setSchema] = useState<any[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const isFullscreen = !onView;

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
    if (!selectedTable) return;

    const loadData = async () => {
      try {
        const tableData = await getTableData(selectedTable);
        setData(tableData);
        setRowCount(tableData?.values?.length || 0);

        const schemaData = getTableSchema(selectedTable);
        setSchema(schemaData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    loadData();
  }, [selectedTable]);

  return (
    <div className={`bg-white p-4 rounded shadow ${!isFullscreen ? 'mb-4' : 'h-full flex flex-col'}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`font-semibold ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
          📊 Data Preview
        </h2>
        {onView && (
          <button onClick={onView} className="text-blue-500 text-sm hover:underline">
            View Full
          </button>
        )}
      </div>

      {/* Table Selector */}
      <div className="mb-3">
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <div className="text-xs text-blue-600 font-semibold">Rows</div>
          <div className="text-lg font-bold text-blue-700">{rowCount}</div>
        </div>
        <div className="bg-green-50 p-2 rounded border border-green-200">
          <div className="text-xs text-green-600 font-semibold">Columns</div>
          <div className="text-lg font-bold text-green-700">{schema.length}</div>
        </div>
        <div className="bg-purple-50 p-2 rounded border border-purple-200">
          <div className="text-xs text-purple-600 font-semibold">Tables</div>
          <div className="text-lg font-bold text-purple-700">{tables.length}</div>
        </div>
      </div>

      {/* Schema Info */}
      {isFullscreen && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold mb-2">Schema</h3>
          <div className="overflow-auto max-h-48 border rounded">
            <table className="w-full text-xs">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 border text-left">Column</th>
                  <th className="p-2 border text-left">Type</th>
                  <th className="p-2 border text-center">PK</th>
                  <th className="p-2 border text-center">Not Null</th>
                </tr>
              </thead>
              <tbody>
                {schema.map((col, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 border font-mono font-semibold">{col[1]}</td>
                    <td className="p-2 border text-gray-600">{col[2]}</td>
                    <td className="p-2 border text-center">{col[5] ? "✓" : ""}</td>
                    <td className="p-2 border text-center">{col[3] ? "✓" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Preview */}
      <div className={`${isFullscreen ? 'flex-1' : ''}`}>
        <h3 className="text-sm font-semibold mb-2">Sample Data</h3>
        {data && data.columns && data.values ? (
          <div className={`overflow-auto border rounded ${isFullscreen ? 'max-h-96' : 'max-h-48'}`}>
            <table className="w-full text-xs">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {data.columns.map((col: string, i: number) => (
                    <th key={i} className="p-2 border text-left font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.values.slice(0, isFullscreen ? 50 : 5).map((row: any[], i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {row.map((cell: any, j: number) => (
                      <td key={j} className="p-2 border">
                        {cell !== null ? cell.toString() : "NULL"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-400 p-4 text-center">No data available</div>
        )}
      </div>

      {!isFullscreen && (
        <p className="text-xs text-gray-500 mt-3 italic">
          Click View Full to see complete schema and more rows
        </p>
      )}
    </div>
  );
};

export default DataPreview;
