import React, { useEffect, useState } from "react";
import { getTables, getTableData, getTableSchema } from "../playground/compiler";
import { usePracticeDatabase } from "../../context/PracticeDatabaseContext";

const DataPreview: React.FC<{ onView?: () => void }> = ({ onView }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [schema, setSchema] = useState<any[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const isFullscreen = !onView;
  const { databaseInfo, isLoading } = usePracticeDatabase();

  useEffect(() => {
    const loadTables = async () => {
      try {
        // Wait for database to be initialized
        if (isLoading || !databaseInfo) return;
        
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
  }, [databaseInfo, isLoading]);

  useEffect(() => {
    if (!selectedTable) return;

    const loadData = async () => {
      try {
        console.log('Loading data for table:', selectedTable);
        const tableData = await getTableData(selectedTable);
        console.log('Received table data:', tableData);
        console.log('Full data object:', JSON.stringify(tableData, null, 2));
        console.log('Data keys:', tableData ? Object.keys(tableData) : 'null');
        console.log('Data has columns?', tableData?.columns);
        console.log('Data has values?', tableData?.values);
        console.log('Values length:', tableData?.values?.length);
        
        setData(tableData);
        setRowCount(tableData?.values?.length || 0);

        const schemaData = getTableSchema(selectedTable);
        console.log('Schema data:', schemaData);
        setSchema(schemaData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    loadData();
  }, [selectedTable]);

  return (
    <div className={`p-4 rounded h-full flex flex-col overflow-hidden`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`font-semibold ${isFullscreen ? 'text-xl' : 'text-lg'} text-white flex items-center gap-2`}>
          📊 Data Preview
        </h2>
        {onView && (
          <button onClick={onView} className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors font-medium">
            View Full →
          </button>
        )}
      </div>

      {/* Table Selector */}
      <div className="mb-3">
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all"
        >
          {tables.map((table) => (
            <option key={table} value={table} className="bg-gray-900">
              {table}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm p-2 rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-500/10">
          <div className="text-xs text-cyan-300 font-semibold">Rows</div>
          <div className="text-lg font-bold text-white">{rowCount}</div>
        </div>
        <div className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 backdrop-blur-sm p-2 rounded-lg border border-teal-400/30 shadow-lg shadow-teal-500/10">
          <div className="text-xs text-teal-300 font-semibold">Columns</div>
          <div className="text-lg font-bold text-white">{schema.length}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm p-2 rounded-lg border border-blue-400/30 shadow-lg shadow-blue-500/10">
          <div className="text-xs text-blue-300 font-semibold">Tables</div>
          <div className="text-lg font-bold text-white">{tables.length}</div>
        </div>
      </div>

      {/* Schema Info */}
      {isFullscreen && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold mb-2 text-white">Schema</h3>
          <div className="overflow-auto max-h-48 border border-white/20 rounded-lg bg-black/20 backdrop-blur-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-xs">
              <thead className="bg-white/10 backdrop-blur-sm sticky top-0">
                <tr>
                  <th className="p-2 border-b border-white/20 text-left text-cyan-300 font-semibold">Column</th>
                  <th className="p-2 border-b border-white/20 text-left text-cyan-300 font-semibold">Type</th>
                  <th className="p-2 border-b border-white/20 text-center text-cyan-300 font-semibold">PK</th>
                  <th className="p-2 border-b border-white/20 text-center text-cyan-300 font-semibold">Not Null</th>
                </tr>
              </thead>
              <tbody>
                {schema.map((col, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-2 border-b border-white/10 font-mono font-semibold text-white">{col[1]}</td>
                    <td className="p-2 border-b border-white/10 text-white/60">{col[2]}</td>
                    <td className="p-2 border-b border-white/10 text-center text-white">{col[5] ? "✓" : ""}</td>
                    <td className="p-2 border-b border-white/10 text-center text-white">{col[3] ? "✓" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Preview */}
      <div className={`flex-1 min-h-0 flex flex-col`}>
        <h3 className="text-sm font-semibold mb-2 text-white">Sample Data</h3>
        {data && data.columns && data.values && data.values.length > 0 ? (
          <div className={`flex-1 overflow-auto border border-white/20 rounded-lg bg-black/20 backdrop-blur-sm ${isFullscreen ? 'max-h-96' : ''} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
            <table className="w-full text-xs">
              <thead className="bg-white/10 backdrop-blur-sm sticky top-0">
                <tr>
                  {data.columns.map((col: string, i: number) => (
                    <th key={i} className="p-2 border-b border-white/20 text-left font-semibold text-cyan-300">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.values.slice(0, isFullscreen ? 50 : 5).map((row: any[], i: number) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    {row.map((cell: any, j: number) => (
                      <td key={j} className="p-2 border-b border-white/10 text-white/80">
                        {cell !== null ? cell.toString() : <span className="text-white/40 italic">NULL</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-white/40 p-4 text-center">
            {!data ? (
              <div>Loading data...</div>
            ) : !data.columns ? (
              <div>No columns found</div>
            ) : !data.values ? (
              <div>No values found</div>
            ) : data.values.length === 0 ? (
              <div>Table is empty</div>
            ) : (
              <div>No data available</div>
            )}
            {selectedTable && <div className="text-xs mt-2 text-white/30">Table: {selectedTable}</div>}
            <div className="text-xs mt-1 text-white/20">
              Debug: data={data ? 'exists' : 'null'}, 
              columns={data?.columns ? data.columns.length : 'none'}, 
              values={data?.values ? data.values.length : 'none'}
            </div>
          </div>
        )}
      </div>

      {!isFullscreen && (
        <p className="text-xs text-white/50 mt-3 italic flex-shrink-0">
          Click View Full to see complete schema and more rows
        </p>
      )}
    </div>
  );
};

export default DataPreview;
