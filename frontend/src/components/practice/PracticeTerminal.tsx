import React, { useState, useEffect } from "react";
import { initializeDatabase, executeQuery } from "../playground/compiler";
import Terminal from "../playground/terminal";
import Output from "../playground/output";

const PracticeTerminal: React.FC<{ dbId?: string; onView?: () => void }> = ({ dbId, onView }) => {
  const [query, setQuery] = useState("-- Welcome to SQL Practice\n-- Try: SELECT * FROM Customers LIMIT 5;");
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [editorHeight, setEditorHeight] = useState<number>(200);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isFullscreen = !onView;

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase(dbId);
        setDbReady(true);
      } catch (err) {
        console.error("DB Init failed:", err);
        setDbReady(false);
      }
    };
    init();
  }, [dbId]);

  // Editor resize logic
  const startDragging = () => {
    document.body.style.cursor = "row-resize";
    setIsDragging(true);
  };

  const stopDragging = () => {
    document.body.style.cursor = "default";
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleEditorMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const minHeight = 150;
        const maxHeight = 400;
        const newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - 200));
        setEditorHeight(newHeight);
      };

      document.addEventListener("mousemove", handleEditorMouseMove);
      document.addEventListener("mouseup", stopDragging);
      return () => {
        document.removeEventListener("mousemove", handleEditorMouseMove);
        document.removeEventListener("mouseup", stopDragging);
      };
    }
  }, [isDragging]);

  // Run Query
  const handleRun = async (): Promise<void> => {
    if (!dbReady) {
      setResult({
        success: false,
        error: "Database is still loading...",
      });
      return;
    }

    if (!query.trim()) {
      setResult({
        success: false,
        error: "Please enter a SQL query",
      });
      return;
    }

    setIsRunning(true);

    const startTime = performance.now();

    try {
      const response = await executeQuery(query, dbId);
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

  // Format Query
  const handleFormat = (): void => {
    const formatted = query
      .replace(/\s+/g, " ")
      .replace(/\s*,\s*/g, ",\n  ")
      .replace(
        /\b(SELECT|FROM|WHERE|JOIN|ON|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE|CREATE|DROP)\b/gi,
        "\n$1"
      )
      .trim();
    setQuery(formatted);
  };

  const handleReset = (): void => {
    setQuery("-- Welcome to SQL Practice\n-- Try: SELECT * FROM Customers LIMIT 5;");
    setResult(null);
    setIsRunning(false);
  };

  return (
    <div className={`h-full flex flex-col`}>
      {isFullscreen ? (
        // Full-screen version (expanded)
        <div 
          className="flex-1 flex flex-col bg-black rounded-lg shadow-xl overflow-hidden border border-black/10 m-4"
          style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)' }}
        >
          {/* Terminal Header */}
          <div className="bg-gradient-to-b from-[#3a3d42] to-[#2a2d32] px-6 py-2.5 border-b border-black/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#FF5F57] rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-[#FEBC2E] rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-[#28C840] rounded-full"></div>
                </div>
                <span className="text-white/80 text-xs font-medium">
                  SQL Practice Terminal
                </span>
              </div>
              <div className="text-white/50 text-xs">
                Ctrl+Enter to run
              </div>
            </div>
          </div>
          
          {/* Editor Section */}
          <div 
            style={{ height: editorHeight }}
            className="relative bg-black flex-shrink-0"
          >
            <Terminal value={query} onChange={setQuery} />
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={startDragging}
            className="relative h-1.5 bg-black/20 hover:bg-[#E67350]/30 cursor-row-resize flex items-center justify-center group transition-colors flex-shrink-0"
          >
            <div className="w-10 h-0.5 bg-white/20 rounded-full group-hover:bg-[#E67350]/60 transition-colors"></div>
          </div>

          {/* Toolbar */}
          <div className="bg-black/95 px-6 py-3 border-t border-white/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={!dbReady || isRunning}
                data-testid="run-button"
                className="px-4 py-2 bg-[#E67350] hover:bg-[#d5633e] text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <span>▶</span>
                    Run Query
                  </>
                )}
              </button>
              
              <button
                onClick={handleFormat}
                disabled={!dbReady || isRunning}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Format
              </button>
              
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset
              </button>
              
              <div className="flex-1"></div>
              
              <div className="text-white/60 text-xs">
                {dbReady ? "Database Ready" : "Loading Database..."}
              </div>
            </div>
          </div>

          {/* Running Indicator */}
          {isRunning && (
            <div className="bg-[#E67350]/10 border-t border-[#E67350]/20 flex-shrink-0">
              <div className="px-6 py-2 flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-[#E67350] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[#E67350] font-medium text-xs">
                  Executing query...
                </span>
              </div>
            </div>
          )}

          {/* Output Section */}
          <div className="flex-1 bg-white overflow-auto">
            <div className="p-6">
              <div className="mb-4 pb-2 border-b border-black/5">
                <h3 className="text-sm font-semibold text-black/80">
                  Output
                </h3>
              </div>
              <Output result={result} />
            </div>
          </div>
        </div>
      ) : (
        // Compact version
        <div className="h-full flex flex-col p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-xs text-gray-800">SQL Terminal</h3>
            {onView && (
              <button 
                onClick={onView} 
                className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            )}
          </div>

          {/* Compact Editor */}
          <div className="flex-1 flex flex-col bg-gray-900 rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-800 px-3 py-2 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-xs">SQL</span>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                className="w-full h-full p-2 bg-gray-900 text-green-400 font-mono text-xs resize-none focus:outline-none border-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SELECT * FROM Customers LIMIT 5;"
              />
            </div>
            
            <div className="bg-gray-800 px-3 py-2 border-t border-gray-700 flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {dbReady ? "Ready" : "Loading..."}
              </div>
              <button
                onClick={handleRun}
                disabled={!dbReady || isRunning}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium disabled:opacity-50 transition-colors"
              >
                {isRunning ? "..." : "▶ Run"}
              </button>
            </div>
          </div>

          {/* Compact Results */}
          {result && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200 max-h-32 overflow-auto">
              {result.success ? (
                <div className="text-xs text-green-600">
                  ✓ {result.data?.[0]?.values?.length || 0} rows • {result.executionTime}
                </div>
              ) : (
                <div className="text-xs text-red-600">
                  ✗ {result.error}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeTerminal;
