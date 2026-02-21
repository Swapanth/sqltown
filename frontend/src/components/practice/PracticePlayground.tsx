import React, { useState, useEffect } from "react";
import Terminal from "../playground/terminal";
import Output from "../playground/output";
import Toolbar from "../playground/toolbar";
import SchemaBrowser from "../playground/SchemaBrowser";
import TablePreview from "../playground/TablePreview";
import {
  initializeDatabase,
  executeQuery,
} from "../playground/compiler";

interface PracticePlaygroundProps {
  dbId?: string;
}

export const PracticePlayground: React.FC<PracticePlaygroundProps> = ({ dbId }) => {
  const [query, setQuery] = useState<string>("-- Welcome to SQL Practice\n-- Try: SELECT * FROM Customers LIMIT 5;");
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [dbReady, setDbReady] = useState<boolean>(false);
  const [editorHeight, setEditorHeight] = useState<number>(200);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Panel widths
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(280);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(350);
  const [isDraggingLeft, setIsDraggingLeft] = useState<boolean>(false);
  const [isDraggingRight, setIsDraggingRight] = useState<boolean>(false);
  
  // Panel visibility
  const [leftPanelVisible, setLeftPanelVisible] = useState<boolean>(true);
  const [rightPanelVisible, setRightPanelVisible] = useState<boolean>(true);

  // Initialize database with dbId
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

  // Left panel resize logic
  const startDraggingLeft = () => {
    document.body.style.cursor = "col-resize";
    setIsDraggingLeft(true);
  };

  const stopDraggingLeft = () => {
    document.body.style.cursor = "default";
    setIsDraggingLeft(false);
  };

  const handleLeftDrag = (e: MouseEvent) => {
    if (!isDraggingLeft) return;
    const minWidth = 200;
    const maxWidth = 500;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - 8));
    setLeftPanelWidth(newWidth);
  };

  // Right panel resize logic
  const startDraggingRight = () => {
    document.body.style.cursor = "col-resize";
    setIsDraggingRight(true);
  };

  const stopDraggingRight = () => {
    document.body.style.cursor = "default";
    setIsDraggingRight(false);
  };

  const handleRightDrag = (e: MouseEvent) => {
    if (!isDraggingRight) return;
    const minWidth = 250;
    const maxWidth = 600;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, window.innerWidth - e.clientX - 8));
    setRightPanelWidth(newWidth);
  };

  useEffect(() => {
    if (isDraggingLeft) {
      document.addEventListener("mousemove", handleLeftDrag);
      document.addEventListener("mouseup", stopDraggingLeft);
      return () => {
        document.removeEventListener("mousemove", handleLeftDrag);
        document.removeEventListener("mouseup", stopDraggingLeft);
      };
    }
  }, [isDraggingLeft]);

  useEffect(() => {
    if (isDraggingRight) {
      document.addEventListener("mousemove", handleRightDrag);
      document.addEventListener("mouseup", stopDraggingRight);
      return () => {
        document.removeEventListener("mousemove", handleRightDrag);
        document.removeEventListener("mouseup", stopDraggingRight);
      };
    }
  }, [isDraggingRight]);

  useEffect(() => {
    if (isDragging) {
      const handleEditorMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const minHeight = 250;
        const maxHeight = window.innerHeight - 400;
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
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Three-Panel Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - Schema Browser */}
        {leftPanelVisible && (
          <>
            <div 
              className="flex-shrink-0 bg-white border-r border-black/5 overflow-hidden relative"
              style={{ width: `${leftPanelWidth}px` }}
            >
              <button
                onClick={() => setLeftPanelVisible(false)}
                className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center text-black/40 hover:text-black/60 hover:bg-black/5 rounded transition-colors"
                title="Hide schema panel"
              >
                <span className="text-xs">‹</span>
              </button>
              <SchemaBrowser dbReady={dbReady} dbId={dbId} />
            </div>
            <div
              onMouseDown={startDraggingLeft}
              className="w-1  hover:bg-[#E67350]/30 cursor-col-resize flex-shrink-0 transition-colors group relative"
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-transparent group-hover:bg-[#E67350]/60 transition-colors"></div>
            </div>
          </>
        )}
        
        {/* Left Panel Toggle Button (when hidden) */}
        {!leftPanelVisible && (
          <button
            onClick={() => setLeftPanelVisible(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-white border-r border-y border-black/10 rounded-r flex items-center justify-center text-black/40 hover:text-black/60 hover:bg-black/5 transition-colors shadow-sm"
            title="Show schema panel"
          >
            <span className="text-xs">›</span>
          </button>
        )}

        {/* Middle Panel - Editor & Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Terminal Window */}
          <div 
            className="flex-1 flex flex-col bg-black rounded-lg shadow-xl overflow-hidden border border-black/10 m-4"
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
                    SQL Practice
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
              <Toolbar
                onRun={handleRun}
                onReset={handleReset}
                onFormat={handleFormat}
                disabled={!dbReady || isRunning}
              />
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
        </div>

        {/* Right Panel - Table Preview */}
        {rightPanelVisible && (
          <>
            <div
              onMouseDown={startDraggingRight}
              className="w-1 hover:bg-[#E67350]/30 cursor-col-resize flex-shrink-0 transition-colors group relative"
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-transparent group-hover:bg-[#E67350]/60 transition-colors"></div>
            </div>
            <div 
              className="flex-shrink-0 bg-white border-l border-black/5 overflow-hidden relative"
              style={{ width: `${rightPanelWidth}px` }}
            >
              <button
                onClick={() => setRightPanelVisible(false)}
                className="absolute top-2 left-2 z-10 w-6 h-6 flex items-center justify-center text-black/40 hover:text-black/60 hover:bg-black/5 rounded transition-colors"
                title="Hide tables panel"
              >
                <span className="text-xs">›</span>
              </button>
              <TablePreview dbReady={dbReady} dbId={dbId} />
            </div>
          </>
        )}
        
        {/* Right Panel Toggle Button (when hidden) */}
        {!rightPanelVisible && (
          <button
            onClick={() => setRightPanelVisible(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-white border-l border-y border-black/10 rounded-l flex items-center justify-center text-black/40 hover:text-black/60 hover:bg-black/5 transition-colors shadow-sm"
            title="Show tables panel"
          >
            <span className="text-xs">‹</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticePlayground;