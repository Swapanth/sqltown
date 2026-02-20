import React, { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";
import { initializeDatabase, getTables, getTableSchema } from "../playground/compiler";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
  },
});

interface TableStructure {
  name: string;
  columns: {
    name: string;
    type: string;
    isPK: boolean;
    isFK: boolean;
  }[];
}

const ERDiagramGenerator: React.FC = () => {
  const [diagramCode, setDiagramCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showCode, setShowCode] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize database
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch (err) {
        console.error("DB Init failed:", err);
        setError("Failed to initialize database");
      }
    };
    init();
  }, []);

  // Generate ER diagram from database
  useEffect(() => {
    if (!dbReady) return;

    const generateDiagram = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const tables = await getTables();
        if (!tables || tables.length === 0) {
          setError("No tables found in database");
          setIsLoading(false);
          return;
        }

        const tableStructures: TableStructure[] = [];

        // Get schema for each table
        for (const tableName of tables) {
          const schema = getTableSchema(tableName);
          const columns = schema.map((col: any) => ({
            name: col[1],
            type: col[2],
            isPK: col[5] === 1,
            isFK: false, // We'll detect FKs from column names
          }));

          tableStructures.push({ name: tableName, columns });
        }

        // Generate Mermaid ER diagram
        const mermaidCode = generateMermaidER(tableStructures);
        setDiagramCode(mermaidCode);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Failed to generate diagram:", err);
        setError(err.message || "Failed to generate diagram");
        setIsLoading(false);
      }
    };

    generateDiagram();
  }, [dbReady]);

  // Render diagram when code changes
  useEffect(() => {
    if (diagramCode && diagramRef.current) {
      renderDiagram();
    }
  }, [diagramCode]);

  const generateMermaidER = (tables: TableStructure[]): string => {
    let code = "erDiagram\n";

    // Add tables and their columns
    tables.forEach((table) => {
      code += `  ${table.name} {\n`;
      table.columns.forEach((col) => {
        // Mermaid syntax: type columnName constraints
        // Extract base type (remove parentheses content for cleaner display)
        let baseType = col.type.replace(/\(.*?\)/, "").trim();
        
        // Map SQL types to simpler names
        const typeMap: Record<string, string> = {
          "INTEGER": "int",
          "INT": "int",
          "VARCHAR": "string",
          "TEXT": "string",
          "DECIMAL": "decimal",
          "REAL": "float",
          "DATE": "date",
          "DATETIME": "datetime",
          "TIMESTAMP": "timestamp",
        };
        
        const displayType = typeMap[baseType.toUpperCase()] || baseType.toLowerCase();
        
        // Build the line: type columnName PK/FK
        let line = `    ${displayType} ${col.name}`;
        if (col.isPK) line += " PK";
        if (col.isFK) line += " FK";
        code += line + "\n";
      });
      code += "  }\n";
    });

    // Add relationships (detect from foreign key naming convention)
    tables.forEach((table) => {
      table.columns.forEach((col) => {
        // Convention: column_id references Column table
        const fkMatch = col.name.match(/^(.+)_id$/);
        if (fkMatch && !col.isPK) {
          const referencedTable = fkMatch[1].charAt(0).toUpperCase() + fkMatch[1].slice(1) + "s";
          if (tables.some((t) => t.name === referencedTable)) {
            code += `  ${referencedTable} ||--o{ ${table.name} : "has"\n`;
          }
        }
      });
    });

    return code;
  };

  const renderDiagram = async () => {
    if (!diagramRef.current || !diagramCode) return;

    try {
      const id = `erDiagram-${Date.now()}`;
      const { svg } = await mermaid.render(id, diagramCode);
      diagramRef.current.innerHTML = svg;
    } catch (err) {
      console.error("Mermaid render error:", err);
      setError("Failed to render diagram");
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleReset = () => {
    setZoom(100);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(diagramCode);
    alert("Mermaid code copied to clipboard!");
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            🗂️ ER Diagram
          </h2>
          {dbReady && !isLoading && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
              ✓ Live
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border rounded bg-white">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 text-sm"
              title="Zoom Out"
            >
              −
            </button>
            <span className="px-2 py-1 text-xs font-mono border-x min-w-[50px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 text-sm"
              title="Zoom In"
            >
              +
            </button>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs border rounded hover:bg-gray-100"
            title="Reset Zoom"
          >
            Reset
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className="px-3 py-1 text-xs border rounded hover:bg-gray-100"
          >
            {showCode ? "Hide Code" : "Show Code"}
          </button>

          <button
            onClick={handleFullscreen}
            className="px-3 py-1 text-xs border rounded hover:bg-gray-100"
            title="Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Diagram View */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6 flex items-center justify-center">
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Generating ER diagram...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-3">⚠️</div>
              <p className="text-red-600 font-semibold mb-2">Error</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && diagramCode && (
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center center",
                transition: "transform 0.2s ease",
              }}
            >
              <div
                ref={diagramRef}
                className="bg-white p-6 rounded shadow-sm border"
              />
            </div>
          )}
        </div>

        {/* Code Panel */}
        {showCode && (
          <div className="w-96 border-l bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
              <span className="text-sm font-semibold">Mermaid Code</span>
              <button
                onClick={copyCode}
                className="text-xs text-blue-600 hover:underline"
              >
                Copy
              </button>
            </div>
            <pre className="flex-1 p-4 overflow-auto text-xs font-mono bg-gray-900 text-green-400">
              {diagramCode}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
        <span>
          {!isLoading && !error && "Pan: Click and drag • Zoom: +/- buttons"}
        </span>
        <span className="text-gray-400">
          Powered by Mermaid.js
        </span>
      </div>
    </div>
  );
};

export default ERDiagramGenerator;
