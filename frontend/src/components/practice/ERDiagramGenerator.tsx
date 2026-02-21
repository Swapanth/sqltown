import React, { useEffect, useState, useRef, useCallback } from "react";
import mermaid from "mermaid";
import PaletteIcon from '@mui/icons-material/Palette';
import FrontHandIcon from '@mui/icons-material/FrontHand';
import BrushIcon from '@mui/icons-material/Brush';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RouteIcon from '@mui/icons-material/Route';
import { initializeDatabase, getTables, getTableSchema } from "../playground/compiler";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
  },
  themeVariables: {
    primaryColor: '#ffffff',
    primaryTextColor: '#374151',
    primaryBorderColor: '#d1d5db',
    lineColor: '#6b7280',
  }
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

const ERDiagramGenerator: React.FC<{ dbId?: string }> = ({ dbId }) => {
  const [diagramCode, setDiagramCode] = useState<string>("");
  const [editableCode, setEditableCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showEditor, setShowEditor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Filter states
  const [activeTool, setActiveTool] = useState<'pan' | 'select'>('pan');
  const [theme, setTheme] = useState<'default' | 'dark' | 'forest' | 'neutral'>('default');
  const [tableColorScheme, setTableColorScheme] = useState<'default' | 'pastel' | 'vibrant' | 'monochrome'>('default');
  const [layoutDirection, setLayoutDirection] = useState<'TB' | 'BT' | 'LR' | 'RL'>('TB');
  const [flowType, setFlowType] = useState<'hierarchical' | 'adaptive'>('hierarchical');

  // Menu states
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showFlowMenu, setShowFlowMenu] = useState(false);

  const diagramRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const getThemeVariables = useCallback(() => {
    const themes = {
      default: {
        primaryColor: '#ffffff',
        primaryTextColor: '#374151',
        primaryBorderColor: '#d1d5db',
        lineColor: '#6b7280',
      },
      dark: {
        primaryColor: '#1f2937',
        primaryTextColor: '#f9fafb',
        primaryBorderColor: '#4b5563',
        lineColor: '#9ca3af',
      },
      forest: {
        primaryColor: '#f0fdf4',
        primaryTextColor: '#166534',
        primaryBorderColor: '#22c55e',
        lineColor: '#16a34a',
      },
      neutral: {
        primaryColor: '#fafafa',
        primaryTextColor: '#525252',
        primaryBorderColor: '#a3a3a3',
        lineColor: '#737373',
      }
    };
    return themes[theme];
  }, [theme]);

  // Initialize database
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase(dbId);
        setDbReady(true);
      } catch (err) {
        console.error("DB Init failed:", err);
        setError("Failed to initialize database");
      }
    };
    init();
  }, [dbId]);

  // Generate ER diagram from database
  useEffect(() => {
    if (!dbReady) return;
    generateDiagramWithLayout();
  }, [dbReady]);

  // Regenerate when any filter changes
  useEffect(() => {
    if (dbReady) {
      // Re-initialize Mermaid with new theme before generating
      mermaid.initialize({
        startOnLoad: false,
        theme: theme,
        securityLevel: "loose",
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
        },
        themeVariables: getThemeVariables()
      });
      generateDiagramWithLayout();
    }
  }, [layoutDirection, flowType, theme, tableColorScheme]);

  // Render diagram when code changes
  const renderDiagram = useCallback(async (code: string) => {
    if (!diagramRef.current || !code) return;

    try {
      // Ensure Mermaid is configured with current theme before rendering
      await mermaid.initialize({
        startOnLoad: false,
        theme: theme,
        securityLevel: "loose",
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
        },
        themeVariables: getThemeVariables()
      });

      const id = `erDiagram-${Date.now()}`;
      const { svg } = await mermaid.render(id, code);
      diagramRef.current.innerHTML = svg;

      // Add interactivity to SVG elements
      const svgElement = diagramRef.current.querySelector('svg');
      if (svgElement) {
        // Make SVG elements interactive
        const entities = svgElement.querySelectorAll('.er-entityBox, .entityBox');
        entities.forEach((entity) => {
          const entityLabel = entity.querySelector('.er-entityLabel, .entityLabel');
          const tableName = entityLabel?.textContent?.trim() || '';

          entity.addEventListener('click', (e) => {
            e.stopPropagation();

            // Clear previous selections
            entities.forEach(e => e.classList.remove('selected'));

            // Select current entity
            entity.classList.add('selected');
            setSelectedTable(tableName);

            // Add visual feedback
            const rect = entity.querySelector('rect');
            if (rect) {
              rect.setAttribute('stroke', '#f97316');
              rect.setAttribute('stroke-width', '3');
              rect.setAttribute('fill', '#fff7ed');
            }

            // Show table info
            console.log(`Selected table: ${tableName}`);
          });

          entity.addEventListener('mouseenter', () => {
            if (!entity.classList.contains('selected')) {
              (entity as HTMLElement).style.cursor = 'pointer';
              const rect = entity.querySelector('rect');
              if (rect) {
                rect.setAttribute('stroke', '#6b7280');
                rect.setAttribute('stroke-width', '2');
                rect.setAttribute('fill', '#f9fafb');
              }
            }
          });

          entity.addEventListener('mouseleave', () => {
            if (!entity.classList.contains('selected')) {
              const rect = entity.querySelector('rect');
              if (rect) {
                rect.setAttribute('stroke', '#374151');
                rect.setAttribute('stroke-width', '1');
                rect.setAttribute('fill', '#ffffff');
              }
            }
          });
        });

        // Add relationship hover effects
        const relationships = svgElement.querySelectorAll('.er-relationshipLine, .relationshipLine');
        relationships.forEach((rel) => {
          rel.addEventListener('mouseenter', () => {
            (rel as HTMLElement).style.cursor = 'pointer';
            rel.setAttribute('stroke', '#f97316');
            rel.setAttribute('stroke-width', '3');
          });

          rel.addEventListener('mouseleave', () => {
            rel.setAttribute('stroke', '#374151');
            rel.setAttribute('stroke-width', '1');
          });
        });
      }
    } catch (err) {
      console.error("Mermaid render error:", err);
      setError("Failed to render diagram. Check your Mermaid syntax.");
    }
  }, [theme, getThemeVariables]);

  useEffect(() => {
    if (diagramCode && diagramRef.current) {
      renderDiagram(diagramCode);
    }
  }, [diagramCode, renderDiagram]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return;

      const target = event.target as Element;
      if (!target.closest('.filter-menu-container')) {
        setShowToolMenu(false);
        setShowThemeMenu(false);
        setShowColorMenu(false);
        setShowLayoutMenu(false);
        setShowFlowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateMermaidER = (tables: TableStructure[]): string => {
    let code = "erDiagram\n";

    // Add tables and their columns
    tables.forEach((table) => {
      code += `  ${table.name} {\n`;
      table.columns.forEach((col) => {
        let baseType = col.type.replace(/\(.*?\)/, "").trim();

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

        let line = `    ${displayType} ${col.name}`;
        if (col.isPK) line += " PK";
        if (col.isFK) line += " FK";
        code += line + "\n";
      });
      code += "  }\n";
    });

    // Add relationships
    tables.forEach((table) => {
      table.columns.forEach((col) => {
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

  const generateMermaidFlowchart = (tables: TableStructure[]): string => {
    const direction = flowType === 'hierarchical' ? layoutDirection : 'TD';
    let code = `flowchart ${direction}\n`;

    // Add styling based on color scheme
    const getTableColor = (index: number) => {
      const colors = {
        default: ['#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af'],
        pastel: ['#fef3c7', '#fed7aa', '#fecaca', '#c7d2fe'],
        vibrant: ['#fbbf24', '#f97316', '#ef4444', '#8b5cf6'],
        monochrome: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db']
      };
      return colors[tableColorScheme][index % colors[tableColorScheme].length];
    };

    // Add table nodes with colors
    tables.forEach((table, index) => {
      const columns = table.columns.map(col => {
        let line = `${col.name}: ${col.type}`;
        if (col.isPK) line += " (PK)";
        if (col.isFK) line += " (FK)";
        return line;
      }).join("<br/>");

      const color = getTableColor(index);
      code += `  ${table.name}["<b>${table.name}</b><br/>${columns}"]\n`;
      code += `  ${table.name} --> ${table.name}\n`;
      code += `  style ${table.name} fill:${color},stroke:#374151,stroke-width:2px\n`;
    });

    // Add relationships based on flow type
    if (flowType === 'hierarchical') {
      // Hierarchical: strict parent-child relationships
      tables.forEach((table) => {
        table.columns.forEach((col) => {
          const fkMatch = col.name.match(/^(.+)_id$/);
          if (fkMatch && !col.isPK) {
            const referencedTable = fkMatch[1].charAt(0).toUpperCase() + fkMatch[1].slice(1) + "s";
            if (tables.some((t) => t.name === referencedTable)) {
              code += `  ${referencedTable} --> ${table.name}\n`;
            }
          }
        });
      });
    } else {
      // Adaptive: more flexible connections
      tables.forEach((table, i) => {
        tables.forEach((otherTable, j) => {
          if (i !== j && Math.random() > 0.7) { // Some adaptive connections
            code += `  ${table.name} -.-> ${otherTable.name}\n`;
          }
        });
      });
    }

    return code;
  };

  const generateDiagramWithLayout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Force re-initialize Mermaid with current theme settings
      await mermaid.initialize({
        startOnLoad: false,
        theme: theme,
        securityLevel: "loose",
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
        },
        themeVariables: getThemeVariables()
      });

      const tables = await getTables(dbId);
      if (!tables || tables.length === 0) {
        setError("No tables found in database");
        setIsLoading(false);
        return;
      }

      const tableStructures: TableStructure[] = [];

      // Get schema for each table
      for (const tableName of tables) {
        const schema = getTableSchema(tableName, dbId);
        const columns = schema.map((col: any) => ({
          name: col[1],
          type: col[2],
          isPK: col[5] === 1,
          isFK: false,
        }));

        tableStructures.push({ name: tableName, columns });
      }

      // Generate diagram based on layout direction and flow type
      const mermaidCode = layoutDirection === 'TB' && flowType === 'hierarchical'
        ? generateMermaidER(tableStructures)
        : generateMermaidFlowchart(tableStructures);

      setDiagramCode(mermaidCode);
      setEditableCode(mermaidCode);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Failed to generate diagram:", err);
      setError(err.message || "Failed to generate diagram");
      setIsLoading(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setEditableCode(newCode);
    setIsEditing(true);
    // Debounced rendering with current theme
    const timeoutId = setTimeout(() => {
      renderDiagram(newCode);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const applyChanges = () => {
    setDiagramCode(editableCode);
    setIsEditing(false);
  };

  const resetToGenerated = () => {
    setEditableCode(diagramCode);
    renderDiagram(diagramCode);
    setIsEditing(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleReset = () => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
    setSelectedTable(null);
  };

  // Pan functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && activeTool === 'pan') { // Only pan when pan tool is active
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && activeTool === 'pan') {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;

      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));

      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Get mouse position relative to the viewport
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? -10 : 10;
    const newZoom = Math.max(25, Math.min(300, zoom + delta));

    if (newZoom !== zoom) {
      // Zoom towards mouse position
      const zoomFactor = newZoom / zoom;
      const newPanX = mouseX - (mouseX - panOffset.x) * zoomFactor;
      const newPanY = mouseY - (mouseY - panOffset.y) * zoomFactor;

      setZoom(newZoom);
      setPanOffset({ x: newPanX, y: newPanY });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(editableCode);
    // Show temporary feedback
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Interactive ER Diagram</h2>
          {dbReady && !isLoading && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-lg font-medium">
               Live
            </span>
          )}
          {isEditing && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-lg font-medium">
              Editing
            </span>
          )}
          {selectedTable && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-lg font-medium">
              {selectedTable}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 filter-menu-container">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 text-sm transition-colors"
              title="Zoom Out"
            >
              −
            </button>
            <span className="px-3 py-2 text-xs font-mono border-x border-gray-200 min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 300}
              className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 text-sm transition-colors"
              title="Zoom In"
            >
              +
            </button>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Reset View"
          >
            Reset
          </button>

          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`px-3 py-2 text-sm border rounded-lg transition-colors ${showEditor
                ? 'bg-orange-100 border-orange-300 text-orange-700'
                : 'border-gray-200 hover:bg-gray-50'
              }`}
          >
            {showEditor ? "Hide Editor" : "Show Editor"}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Diagram View */}
        <div
          ref={viewportRef}
          className={`flex-1 overflow-hidden bg-gray-50 relative ${activeTool === 'pan'
              ? (isPanning ? 'cursor-grabbing' : 'cursor-grab')
              : 'cursor-pointer'
            }`}
          style={{ minHeight: '400px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Generating ER diagram...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 font-semibold mb-2">Error</p>
                <p className="text-sm text-gray-600 max-w-md">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && (editableCode || diagramCode) && (
            <>
              {/* Filter Toolbar Overlay */}
              <div className="absolute top-4 left-4 z-20 filter-menu-container">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-1">
                  {/* Tool Selection */}
                  <div className="relative">
                    <button
                      onClick={() => setShowToolMenu(!showToolMenu)}
                      className={`p-2 rounded transition-colors ${activeTool === 'pan' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                      title="Tool Selection"
                    >
                      <FrontHandIcon />
                    </button>

                    {showToolMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[120px]">
                        <button
                          onClick={() => { setActiveTool('pan'); setShowToolMenu(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${activeTool === 'pan' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 6v5h5l-6 6-6-6h5V6h2z" />
                          </svg>
                          <span>Pan Tool</span>
                        </button>
                        <button
                          onClick={() => { setActiveTool('select'); setShowToolMenu(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${activeTool === 'select' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span>Select Tool</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Theme Selection */}
                  <div className="relative">
                    <button
                      onClick={() => setShowThemeMenu(!showThemeMenu)}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                      title="Theme Selection"
                    >
                     {/* Use PaletteIcon */}
                     <PaletteIcon className="w-5 h-5" />
                     
                    </button>

                    {showThemeMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[120px]">
                          {(['default', 'dark', 'forest', 'neutral'] as const).map((themeOption) => (
                            <button
                              key={themeOption}
                              onClick={() => { setTheme(themeOption); setShowThemeMenu(false); }}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${theme === themeOption ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                                }`}
                            >
                              <div className={`w-3 h-3 rounded-full ${themeOption === 'default' ? 'bg-gray-300' :
                                  themeOption === 'dark' ? 'bg-gray-800' :
                                    themeOption === 'forest' ? 'bg-green-500' :
                                      'bg-gray-400'
                                }`}></div>
                              <span className="capitalize">{themeOption}</span>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Table Colors */}
                  <div className="relative">
                    <button
                      onClick={() => setShowColorMenu(!showColorMenu)}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                      title="Table Colors"
                    >
                      <BrushIcon/>
                    </button>

                    {showColorMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[140px]">
                        {(['default', 'pastel', 'vibrant', 'monochrome'] as const).map((colorOption) => (
                          <button
                            key={colorOption}
                            onClick={() => { setTableColorScheme(colorOption); setShowColorMenu(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${tableColorScheme === colorOption ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                              }`}
                          >
                            <div className="flex gap-1">
                              {colorOption === 'default' && <div className="w-2 h-2 rounded-full bg-gray-400"></div>}
                              {colorOption === 'pastel' && (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-pink-300"></div>
                                  <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                                  <div className="w-2 h-2 rounded-full bg-green-300"></div>
                                </>
                              )}
                              {colorOption === 'vibrant' && (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </>
                              )}
                              {colorOption === 'monochrome' && (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-gray-800"></div>
                                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                </>
                              )}
                            </div>
                            <span className="capitalize">{colorOption}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                

                  {/* Layout Direction Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                      className={`p-2 rounded transition-colors ${showLayoutMenu ? 'bg-gray-100' : 'hover:bg-gray-100'
                        }`}
                      title="Layout Direction"
                    >
                      <RouteIcon/>
                    </button>

                    {showLayoutMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[160px]">
                        <button
                          onClick={() => { setLayoutDirection('TB'); setShowLayoutMenu(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${layoutDirection === 'TB' ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5z" />
                          </svg>
                          <span>Top to bottom</span>
                        </button>
                        <button
                          onClick={() => { setLayoutDirection('BT'); setShowLayoutMenu(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${layoutDirection === 'BT' ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 14l5-5 5 5z" />
                          </svg>
                          <span>Bottom to top</span>
                        </button>
                        <button
                          onClick={() => { setLayoutDirection('LR'); setShowLayoutMenu(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${layoutDirection === 'LR' ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 7l5 5-5 5z" />
                          </svg>
                          <span>Left to right</span>
                        </button>
                        <button
                          onClick={() => { setLayoutDirection('RL'); setShowLayoutMenu(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${layoutDirection === 'RL' ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 7l-5 5 5 5z" />
                          </svg>
                          <span>Right to left</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Flow Type */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFlowMenu(!showFlowMenu)}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                      title="Flow Type"
                    >
                                              <AccountTreeIcon/>

                    </button>

                    {showFlowMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[140px]">
                        <button
                          onClick={() => { setFlowType('hierarchical'); setShowFlowMenu(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${flowType === 'hierarchical' ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span>Hierarchical</span>
                        </button>
                        <button
                          onClick={() => { setFlowType('adaptive'); setShowFlowMenu(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${flowType === 'adaptive' ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                          </svg>
                          <span>Adaptive</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Diagram Content */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
                  transformOrigin: "0 0",
                  transition: isPanning ? 'none' : 'transform 0.2s ease',
                }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <div className="relative">
                    <div
                      ref={diagramRef}
                      className="p-6 rounded-xl select-none"
                      style={{ minWidth: '400px', minHeight: '300px' }}
                    />
                    {/* Zoom indicator */}
                    {zoom !== 100 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded pointer-events-none">
                        {zoom}%
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Editor Panel */}
        {showEditor && (
          <div className="w-96 border-l border-gray-200 bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-semibold text-gray-800">Mermaid Editor</span>
              <div className="flex gap-2">
                <button
                  onClick={copyCode}
                  className="text-xs text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Copy
                </button>
                {isEditing && (
                  <>
                    <button
                      onClick={resetToGenerated}
                      className="text-xs text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={applyChanges}
                      className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </>
                )}
              </div>
            </div>

            <textarea
              value={editableCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none"
              placeholder="Edit your Mermaid ER diagram code here..."
              spellCheck={false}
              style={{ minHeight: '400px' }}
            />

            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              <p>💡 Click tables to select and highlight</p>
              <p>🖱️ Drag to pan • Mouse wheel to zoom</p>
              <p>� Cheange layout direction with arrow buttons</p>
            </div>


          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
        <span>
          {!isLoading && !error && "Interactive Mode: Click tables • Drag to pan • Mouse wheel to zoom • Change layout direction"}
        </span>
      </div>
    </div>
  );
};

export default ERDiagramGenerator;