import React, { useState, useEffect } from "react";
import Terminal from "../../components/playground/terminal";
import Schema from "../../components/playground/schema";
import Data from "../../components/playground/data";
import Output from "../../components/playground/output";
import Toolbar from "../../components/playground/toolbar";
import Tabs from "../../components/playground/tabs";
import {
  initializeDatabase,
  executeQuery,
} from "../../components/playground/compiler";

export const GroundPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "schema" | "data" | "output"
  >("output");
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // 🔥 NEW: Database ready state
  const [dbReady, setDbReady] = useState<boolean>(false);

  // Editor Resize State
  const [editorHeight, setEditorHeight] = useState<number>(300);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // -----------------------------
  // Initialize database once
  // -----------------------------
  useEffect(() => {
    const init = async () => {
      try {
        console.log("Ground component: Starting database initialization...");
        await initializeDatabase();
        console.log("Ground component: Database initialization completed, setting dbReady to true");
        setDbReady(true);
      } catch (err) {
        console.error("Ground component: DB Init failed:", err);
        setDbReady(false);
      }
    };

    init();
  }, []);

  // -----------------------------
  // Resize Logic
  // -----------------------------
  const startDragging = () => {
    document.body.style.cursor = "row-resize";
    setIsDragging(true);
  };

  const stopDragging = () => {
    document.body.style.cursor = "default";
    setIsDragging(false);
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const minHeight = 150;
    const maxHeight = window.innerHeight - 200;

    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, e.clientY)
    );

    setEditorHeight(newHeight);
  };

  // -----------------------------
  // Run Query
  // -----------------------------
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
    setActiveTab("output");

    const startTime = performance.now();

    try {
      const response = await executeQuery(query);
      const endTime = performance.now();
        if (response.success) {
        setResult({
        success: true,
         data: response.data,   // ✅ now this matches
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

  // -----------------------------
  // Format Query
  // -----------------------------
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
    setQuery("");
    setResult(null);
    setIsRunning(false);
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div
      className="h-screen flex flex-col p-20"
      onMouseMove={handleDrag}
      onMouseUp={stopDragging}
    >
      {/* ---------------- Editor Section ---------------- */}
      <div
        style={{ height: editorHeight }}
        className="bg-white border-b"
      >
        <Terminal value={query} onChange={setQuery} />
      </div>

      {/* ---------------- Drag Divider ---------------- */}
      <div
        onMouseDown={startDragging}
        className="relative h-4  hover:bg-gray-300 cursor-row-resize flex items-center justify-center"
      >
        <span className="text-gray-500 text-xs">
          ⇅
        </span>
      </div>

      {/* ---------------- Bottom Section ---------------- */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Toolbar */}
        <Toolbar
          onRun={handleRun}
          onReset={handleReset}
          onFormat={handleFormat}
          disabled={!dbReady || isRunning}   // 🔥 pass this
        />

        {/* DB Loading Indicator */}
        {!dbReady && (
          <div className="px-4 py-2 bg-blue-100 border-b border-blue-300 text-blue-800 text-sm">
            ⏳ Loading database...
          </div>
        )}

        {/* Running Indicator */}
        {isRunning && (
          <div className="px-4 py-2 bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-sm">
            ⏳ Executing query...
          </div>
        )}

        {/* Tabs */}
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
         {activeTab === "schema" && <Schema dbReady={dbReady} />}
         {activeTab === "data" && <Data dbReady={dbReady} />}
         {activeTab === "output" && ( <Output result={result} />)}
        </div>
      </div>
    </div>
  );
};

export default GroundPage;
