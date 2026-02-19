import React, { useState, useEffect } from "react";
import { initializeDatabase, executeQuery } from "../playground/compiler";

const PracticeTerminal: React.FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);

  const [editorWidth, setEditorWidth] = useState<number>(60);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
      setDbReady(true);
    };
    init();
  }, []);

  const handleRun = async () => {
    if (!dbReady || !query.trim()) return;

    setHasExecuted(true);
    setIsRunning(true);
    setResult(null);

    const startTime = performance.now();

    try {
      const response = await executeQuery(query);
      const endTime = performance.now();

      if (response.success) {
        setResult({
          success: true,
          data: response.data,
          executionTime:
            ((endTime - startTime) / 1000).toFixed(3) + "s",
        });
      } else {
        setResult({ success: false, error: response.error });
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResult(null);
    setHasExecuted(false);
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percentage =
      ((e.clientX - rect.left) / rect.width) * 100;

    setEditorWidth(Math.max(30, Math.min(70, percentage)));
  };

  return (
    <div
      className="flex h-full w-full"
      onMouseMove={handleDrag}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* ================= EDITOR ================= */}
      <div
        style={{ width: hasExecuted ? `${editorWidth}%` : "100%" }}
        className={`flex flex-col bg-gray-50 ${
          hasExecuted ? "border-r" : ""
        }`}
      >
        {/* Header */}
        <div className="relative p-3 border-b bg-gray-50">
          <span className="text-xs font-semibold text-gray-600">
            SQL Editor
          </span>

          <div className="absolute right-3 top-2 flex gap-2">
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

        {/* Textarea */}
        <textarea
          className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Write your SQL query here...

Example:
SELECT * FROM Customers LIMIT 5;`}
        />
      </div>

      {/* ================= DIVIDER ================= */}
      {hasExecuted && (
        <div
          onMouseDown={() => setIsDragging(true)}
          className="w-2 cursor-col-resize bg-gray-200 hover:bg-gray-400"
        />
      )}

      {/* ================= OUTPUT ================= */}
      {hasExecuted && (
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          <div className="p-3 border-b text-xs font-semibold text-gray-600">
            Output
          </div>

          <div className="flex-1 overflow-auto p-4 min-w-0">
            {isRunning && (
              <div className="text-blue-600 text-sm">
                ⏳ Running query...
              </div>
            )}

            {!isRunning && result && result.success === false && (
              <div className="text-red-600 bg-red-50 p-3 rounded text-sm">
                ❌ {result.error}
              </div>
            )}

            {!isRunning && result && result.success === true && (
              <>
                {!result.data || result.data.length === 0 ? (
                  <div className="text-green-600 bg-green-50 p-3 rounded text-sm">
                    ✅ Query executed successfully •{" "}
                    {result.executionTime}
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-gray-500 mb-2">
                      {result.data[0]?.values?.length || 0} rows •{" "}
                      {result.executionTime}
                    </div>

                    {/* 🔥 Horizontal Scroll Fix */}
                    <div className="overflow-x-auto overflow-y-auto border rounded bg-white">
                      <table className="min-w-max text-xs">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            {result.data[0]?.columns?.map(
                              (col: string, i: number) => (
                                <th
                                  key={i}
                                  className="p-2 border text-left font-semibold whitespace-nowrap"
                                >
                                  {col}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {result.data[0]?.values?.map(
                            (row: any[], i: number) => (
                              <tr key={i} className="hover:bg-gray-50">
                                {row.map((cell: any, j: number) => (
                                  <td
                                    key={j}
                                    className="p-2 border whitespace-nowrap"
                                  >
                                    {cell !== null
                                      ? cell.toString()
                                      : "NULL"}
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeTerminal;
