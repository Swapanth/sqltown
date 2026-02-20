import React, { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";
import { getTables, getTableSchema } from "../playground/compiler";
import { usePracticeDatabase } from "../../context/PracticeDatabaseContext";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
  er: {
    useMaxWidth: true,
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
  const [relationshipCount, setRelationshipCount] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { databaseInfo, isLoading: dbLoading } = usePracticeDatabase();
  const dbReady = !dbLoading && databaseInfo !== null;
  const diagramRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

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
        const result = generateMermaidER(tableStructures);
        setDiagramCode(result.code);
        setRelationshipCount(result.relationshipCount);
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

  const generateMermaidER = (tables: TableStructure[]): {code: string, relationshipCount: number} => {
    // Use ER diagram to show tables with columns and relationships
    let code = "erDiagram\n";
    
    // Track relationships
    const relationships: Array<{from: string, to: string, via: string, type: string}> = [];
    
    // Add each table with its columns
    tables.forEach((table) => {
      code += `  ${table.name} {\n`;
      
      table.columns.forEach((col) => {
        // Format: type columnName [PK] [FK]
        let annotations = "";
        if (col.isPK) annotations += " PK";
        
        // Check if it's a foreign key by column naming convention
        const fkMatch = col.name.match(/^(.+)_id$/);
        if (fkMatch && !col.isPK) annotations += " FK";
        
        // Normalize SQL type for display
        const displayType = col.type.toLowerCase().replace(/\(.*\)/, '');
        code += `    ${displayType} ${col.name}${annotations}\n`;
      });
      
      code += `  }\n\n`;
    });
    
    // Detect and add relationships with cardinality
    tables.forEach((table) => {
      table.columns.forEach((col) => {
        // Convention: column_id references Column table
        const fkMatch = col.name.match(/^(.+)_id$/);
        if (fkMatch && !col.isPK) {
          const singularName = fkMatch[1];
          
          // Try to find referenced table (could be singular or plural)
          let referencedTable = tables.find(t => 
            t.name.toLowerCase() === singularName.toLowerCase() || 
            t.name.toLowerCase() === singularName.toLowerCase() + 's' ||
            t.name.toLowerCase() === singularName.toLowerCase() + 'es'
          );
          
          if (referencedTable) {
            // Determine relationship type
            // If FK is also a PK, it's likely 1:1, otherwise 1:N
            const isOneToOne = col.isPK;
            const relationshipSymbol = isOneToOne ? "||--||" : "||--o{";
            const relationType = isOneToOne ? "1:1" : "1:N";
            
            relationships.push({
              from: referencedTable.name,
              to: table.name,
              via: col.name,
              type: relationType
            });
            
            // Add relationship line with cardinality
            code += `  ${referencedTable.name} ${relationshipSymbol} ${table.name} : "${col.name}"\n`;
          }
        }
      });
    });
    
    return {
      code,
      relationshipCount: relationships.length
    };
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
    setZoom((prev) => Math.min(prev + 10, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 25));
  };

  const handleReset = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
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

  // Mouse dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -10 : 10;
    setZoom((prev) => Math.min(Math.max(prev + delta, 25), 300));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(diagramCode);
    alert("Mermaid code copied to clipboard!");
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">
            🗂️ Database Schema
          </h2>
          {dbReady && !isLoading && (
            <>
              <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-lg border border-green-400/30">
                ✓ Live
              </span>
              <span className="text-xs text-violet-300 bg-violet-500/20 px-2 py-1 rounded-lg border border-violet-400/30">
                🔗 {relationshipCount} {relationshipCount === 1 ? 'Relationship' : 'Relationships'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="px-2 py-1 hover:bg-white/10 disabled:opacity-50 text-sm text-white transition-colors"
              title="Zoom Out (25-300%)"
            >
              −
            </button>
            <span className="px-2 py-1 text-xs font-mono border-x border-white/20 min-w-[50px] text-center text-white/80">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 300}
              className="px-2 py-1 hover:bg-white/10 disabled:opacity-50 text-sm text-white transition-colors"
              title="Zoom In (25-300%)"
            >
              +
            </button>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs border border-white/20 rounded-lg hover:bg-white/10 bg-white/5 backdrop-blur-sm text-white transition-colors"
            title="Reset Zoom"
          >
            Reset
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className="px-3 py-1 text-xs border border-white/20 rounded-lg hover:bg-white/10 bg-white/5 backdrop-blur-sm text-white transition-colors"
          >
            {showCode ? "Hide Code" : "Show Code"}
          </button>

          <button
            onClick={handleFullscreen}
            className="px-3 py-1 text-xs border border-white/20 rounded-lg hover:bg-white/10 bg-white/5 backdrop-blur-sm text-white transition-colors"
            title="Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Diagram View */}
        <div 
          ref={viewportRef}
          className="flex-1 overflow-hidden bg-gradient-to-br from-black/40 via-black/20 to-black/40 p-6 flex items-center justify-center relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto mb-3"></div>
              <p className="text-sm text-white/60">Generating schema diagram...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="text-red-400 text-4xl mb-3">⚠️</div>
              <p className="text-red-400 font-semibold mb-2">Error</p>
              <p className="text-sm text-white/60">{error}</p>
            </div>
          )}

          {!isLoading && !error && diagramCode && (
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
                transformOrigin: "center center",
                transition: isDragging ? 'none' : 'transform 0.2s ease',
              }}
              ref={diagramRef}
              className="max-w-full pointer-events-none"
            />
          )}
        </div>

        {/* Code Panel */}
        {showCode && (
          <div className="w-96 border-l border-white/20 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-sm flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/20 bg-white/5">
              <span className="text-sm font-semibold text-white">Mermaid Code</span>
              <button
                onClick={copyCode}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                Copy
              </button>
            </div>
            <pre className="flex-1 p-4 overflow-auto text-xs font-mono bg-black/40 text-violet-400 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {diagramCode}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm text-xs text-white/50 flex items-center justify-between">
        <span>
          {!isLoading && !error && "🖱️ Drag to pan • 🔍 Scroll to zoom • Reset button to center"}
        </span>
        <span className="text-white/40">
          Powered by Mermaid.js
        </span>
      </div>
    </div>
  );
};

export default ERDiagramGenerator;
