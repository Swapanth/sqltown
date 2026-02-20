import React, { useState } from "react";
import { executeQuery } from "../playground/compiler";
import { usePracticeDatabase } from "../../context/PracticeDatabaseContext";

const PracticeTerminal: React.FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const { databaseInfo, isLoading } = usePracticeDatabase();
  const dbReady = !isLoading && databaseInfo !== null;

  const [editorWidth, setEditorWidth] = useState<number>(60);
  const [isDragging, setIsDragging] = useState(false);

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
        className={`flex flex-col ${
          hasExecuted ? "border-r border-white/20" : ""
        }`}
      >
        {/* Header */}
        <div className="relative p-3 border-b border-white/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
          <span className="text-xs font-semibold text-white">
            SQL Editor
          </span>

          <div className="absolute right-3 top-2 flex gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-1 text-xs border border-white/20 rounded-lg hover:bg-white/10 bg-white/5 backdrop-blur-sm text-white transition-colors"
            >
              Clear
            </button>

            <button
              onClick={handleRun}
              disabled={!dbReady || isRunning}
              className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/30 transition-all font-medium"
            >
              {isRunning ? "Running..." : "▶ Run"}
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-black/20 backdrop-blur-sm text-white placeholder:text-white/40"
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
          className="w-2 cursor-col-resize bg-white/10 hover:bg-purple-500/30 transition-colors"
        />
      )}

      {/* ================= OUTPUT ================= */}
      {hasExecuted && (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-3 border-b border-white/20 text-xs font-semibold text-white bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-sm">
            Output
          </div>

          <div className="flex-1 overflow-auto p-4 min-w-0 bg-black/20 backdrop-blur-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {isRunning && (
              <div className="text-purple-400 text-sm flex items-center gap-2">
                <span className="animate-pulse">⏳</span> Running query...
              </div>
            )}

            {!isRunning && result && result.success === false && (
              <div className="text-red-300 bg-red-500/20 border border-red-400/30 p-3 rounded-lg text-sm backdrop-blur-sm">
                ❌ {result.error}
              </div>
            )}

            {!isRunning && result && result.success === true && (
              <>
                {!result.data || result.data.length === 0 ? (
                  <div className="text-green-300 bg-green-500/20 border border-green-400/30 p-3 rounded-lg text-sm backdrop-blur-sm">
                    ✅ Query executed successfully •{" "}
                    {result.executionTime}
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-white/60 mb-2">
                      {result.data[0]?.values?.length || 0} rows •{" "}
                      {result.executionTime}
                    </div>

                    {/* 🔥 Horizontal Scroll Fix */}
                    <div className="overflow-x-auto overflow-y-auto border border-white/20 rounded-lg bg-black/20 backdrop-blur-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <table className="min-w-max text-xs">
                        <thead className="bg-white/10 backdrop-blur-sm sticky top-0">
                          <tr>
                            {result.data[0]?.columns?.map(
                              (col: string, i: number) => (
                                <th
                                  key={i}
                                  className="p-2 border-b border-white/20 text-left font-semibold whitespace-nowrap text-purple-300"
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
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                {row.map((cell: any, j: number) => (
                                  <td
                                    key={j}
                                    className="p-2 border-b border-white/10 whitespace-nowrap text-white/80"
                                  >
                                    {cell !== null
                                      ? cell.toString()
                                      : <span className="text-white/40 italic">NULL</span>}
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
