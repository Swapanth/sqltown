import React, { useEffect, useState } from "react";
import { getTables, getTableData, getTableSchema, getTableRowCount, initializeDatabase } from "../playground/compiler";

const DataPreview: React.FC<{ onView?: () => void; dbId?: string }> = ({ onView, dbId }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [schema, setSchema] = useState<any[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFullscreen = !onView;

  useEffect(() => {
    const loadTables = async () => {
      try {
        // Reset state when switching databases
        setTables([]);
        setSelectedTable("");
        setData(null);
        setSchema([]);
        setRowCount(0);
        setTotalRowCount(0);
        setCurrentPage(1);
        
        // Initialize database with dbId first
        await initializeDatabase(dbId);
        const tableList = await getTables(dbId);
        setTables(tableList);
        if (tableList.length > 0) {
          setSelectedTable(tableList[0]);
        }
      } catch (err) {
        console.error("Failed to load tables:", err);
      }
    };
    loadTables();
  }, [dbId]);

  useEffect(() => {
    if (!selectedTable) return;
    setCurrentPage(1); // Reset to first page when table changes
  }, [selectedTable]);

  useEffect(() => {
    if (!selectedTable) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load table data with pagination
        const tableData = await getTableData(selectedTable, dbId, currentPage, pageSize);
        setData(tableData);
        setRowCount(tableData?.values?.length || 0);

        // Get the actual total row count (only on first page or when table changes)
        if (currentPage === 1) {
          let totalRows = await getTableRowCount(selectedTable, dbId);
          
          // If COUNT failed, estimate based on current page data
          if (totalRows === 0 && tableData?.values?.length === pageSize) {
            console.log("COUNT failed, estimating total rows...");
            // If we got a full page, there are likely more rows
            totalRows = pageSize * 10; // Conservative estimate
            console.log(`Estimated totalRows: ${totalRows}`);
          } else if (totalRows === 0) {
            // Use actual returned rows if COUNT failed and we got less than a full page
            totalRows = tableData?.values?.length || 0;
          }
          
          console.log(`Setting totalRowCount to: ${totalRows} for table: ${selectedTable}`);
          setTotalRowCount(totalRows);
          
          // Load schema info
          const schemaData = getTableSchema(selectedTable, dbId);
          setSchema(schemaData);
        }
        
        console.log(`Pagination check: isFullscreen=${isFullscreen}, totalRowCount=${totalRowCount}, pageSize=${pageSize}, condition=${isFullscreen && totalRowCount > pageSize}`);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedTable, dbId, currentPage, pageSize]);

  return (
    <div className={`${!isFullscreen ? 'p-3' : 'h-full flex flex-col'}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`font-semibold text-gray-800 ${isFullscreen ? 'text-xl' : 'text-sm'}`}>
          Data Set's Preview
        </h3>
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

      {/* Table Selector */}
      <div className="mb-3">
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
        <div className="bg-orange-50 p-2 rounded-lg border border-orange-100">
          <div className="text-xs text-orange-600 font-semibold">Total Rows</div>
          <div className="text-sm font-bold text-orange-700">
            {totalRowCount > 0 ? totalRowCount.toLocaleString() : rowCount}
          </div>
        </div>
        <div className="bg-green-50 p-2 rounded-lg border border-green-100">
          <div className="text-xs text-green-600 font-semibold">Columns</div>
          <div className="text-sm font-bold text-green-700">{schema.length}</div>
        </div>
        <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
          <div className="text-xs text-blue-600 font-semibold">Tables</div>
          <div className="text-sm font-bold text-blue-700">{tables.length}</div>
        </div>
      </div>

      {/* Schema Info */}
      {isFullscreen && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-3 text-gray-800">Schema</h4>
          <div className="overflow-auto max-h-48 border border-gray-200 rounded-xl">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-3 border-b border-gray-200 text-left font-semibold text-gray-700">Column</th>
                  <th className="p-3 border-b border-gray-200 text-left font-semibold text-gray-700">Type</th>
                  <th className="p-3 border-b border-gray-200 text-center font-semibold text-gray-700">PK</th>
                  <th className="p-3 border-b border-gray-200 text-center font-semibold text-gray-700">FK</th>
                  <th className="p-3 border-b border-gray-200 text-center font-semibold text-gray-700">Not Null</th>
                  <th className="p-3 border-b border-gray-200 text-center font-semibold text-gray-700">Nullable</th>
                </tr>
              </thead>
              <tbody>
                {schema.map((col, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-100 font-mono font-semibold text-gray-800">{col[1]}</td>
                    <td className="p-3 border-b border-gray-100 text-gray-600">{col[2]}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{col[5] ? "✓" : ""}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{col[6] ? "✓" : ""}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{!col[3] ? "✓" : ""}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{col[3] ? "✓" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Preview */}
      <div className={`${isFullscreen ? 'flex-1' : ''}`}>
        <h4 className="text-sm font-semibold mb-3 text-gray-800">Sample Data</h4>
        {data && data.columns && data.values ? (
          <div className={`overflow-auto border border-gray-200 rounded-xl ${isFullscreen ? 'max-h-96' : 'max-h-48'}`}>
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {data.columns.map((col: string, i: number) => (
                    <th key={i} className="p-3 border-b border-gray-200 text-left font-semibold text-gray-700">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={data.columns.length} className="p-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  data.values.map((row: any[], i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {row.map((cell: any, j: number) => (
                        <td key={j} className="p-3 border-b border-gray-100 text-gray-800">
                          {cell !== null ? cell.toString() : <span className="text-gray-400">NULL</span>}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-400 p-8 text-center bg-gray-50 rounded-xl">
            {isLoading ? "Loading..." : "No data available"}
          </div>
        )}
        
        {/* Pagination Controls */}
        {(() => {
          const shouldShowPagination = isFullscreen && totalRowCount > pageSize;
          console.log(`Pagination render check: isFullscreen=${isFullscreen}, totalRowCount=${totalRowCount}, pageSize=${pageSize}, shouldShow=${shouldShowPagination}`);
          return shouldShowPagination;
        })() && (
          <div className="flex items-center justify-between mt-4 px-4 py-2 bg-gray-50 rounded-lg border">
            <div className="text-xs text-gray-600">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRowCount)} of {totalRowCount.toLocaleString()} rows
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs text-gray-600">
                Page {currentPage} of {Math.ceil(totalRowCount / pageSize)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalRowCount / pageSize)))}
                disabled={currentPage >= Math.ceil(totalRowCount / pageSize)}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {!isFullscreen && (
        <p className="text-xs text-gray-500 mt-4">
          {totalRowCount > pageSize ? (
            <>Showing {pageSize} rows per page of {totalRowCount.toLocaleString()} total. Click View Full for pagination and complete schema</>
          ) : (
            "Click View Full to see complete schema and pagination"
          )}
        </p>
      )}
    </div>
  );
};

export default DataPreview;
