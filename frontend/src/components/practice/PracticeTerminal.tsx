import React, { useState, useEffect } from "react";
import { initializeDatabase, executeQuery } from "../playground/compiler";

const PracticeTerminal: React.FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch (err) {
        console.error("DB Init failed:", err);
      }
    };
    init();
  }, []);

  const handleRun = async () => {
    if (!dbReady || !query.trim()) return;

    setIsRunning(true);
    const startTime = performance.now();

    try {
      const response = await executeQuery(query);
      const endTime = performance.now();

      if (response.success) {
        setResult({
          success: true,
          data: response.data,
          executionTime: ((endTime - startTime) / 1000).toFixed(3) + "s",
        });
      } else {
        setResult({
          success: false,
          error: response.error,
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResult(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Query Editor */}
      <div className="border-b bg-gray-50 p-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-gray-600">SQL Editor</span>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-1 text-xs border rounded hover:bg-gray-100"
            >
              Clear
            </button>
            <button
              onClick={handleRun}
              disabled={!dbReady || isRunning}
              className="px-4 py-1 bg-black text-white rounded text-xs disabled:opacity-50"
            >
              {isRunning ? "Running..." : "▶ Run"}
            </button>
          </div>
        </div>
      </div>

      <textarea
        className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write your SQL query here...\n\nExample:\nSELECT * FROM Customers LIMIT 5;"
      />

      {/* Output Area */}
      <div className="flex-1 p-4 overflow-auto bg-gray-50 border-t">
        <div className="text-xs font-semibold text-gray-600 mb-2">Output</div>
        
        {!dbReady && (
          <div className="text-sm text-blue-600">⏳ Loading database...</div>
        )}

        {!result && dbReady && (
          <div className="text-sm text-gray-400">
            Write a query and click Run to see results
          </div>
        )}

        {result && !result.success && (
          <div className="text-red-600 bg-red-50 p-3 rounded text-sm">
            ❌ {result.error}
          </div>
        )}

        {result && result.success && (
          <>
            {!result.data || result.data.length === 0 ? (
              <div className="text-green-600 bg-green-50 p-3 rounded text-sm">
                ✅ Query executed successfully • {result.executionTime}
              </div>
            ) : (
              <div>
                <div className="text-xs text-gray-500 mb-2">
                  {result.data[0]?.values?.length || 0} rows • {result.executionTime}
                </div>
                <div className="overflow-auto max-h-96 border rounded bg-white">
                  <table className="min-w-full text-xs">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        {result.data[0]?.columns?.map((col: string, i: number) => (
                          <th key={i} className="p-2 border text-left font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.data[0]?.values?.map((row: any[], i: number) => (
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PracticeTerminal;
