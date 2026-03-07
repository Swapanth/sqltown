import React, { useState, useEffect, useRef } from 'react';
import { initializeDatabase, getTables, getTableSchema } from '../playground/compiler';

interface Column {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
  isFK: number;
  fkTable?: string;
  fkColumn?: string;
}

interface Table {
  name: string;
  position: { x: number; y: number };
  columns: Column[];
  schemaId: string;
  visible?: boolean;
}

interface Schema {
  id: string;
  name: string;
  isDefault: boolean;
  isExpanded: boolean;
}

interface Relation {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  cardinality: '1:1' | '1:N' | 'N:1' | 'N:N';
}

interface Enum {
  id: string;
  name: string;
  values: string[];
}

interface Area {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  tableIds: string[];
}

interface Note {
  id: string;
  content: string;
  position: { x: number; y: number };
}

interface WorkspaceData {
  schemas: Schema[];
  tables: Table[];
  relations: Relation[];
  enums: Enum[];
  areas: Area[];
  notes: Note[];
}

// Color palette for table headers
const TABLE_COLORS = [
  'from-red-400 to-orange-500',      
  'from-green-400 to-teal-500',  
  'from-cyan-400 to-blue-500',    
  'from-blue-400 to-indigo-500',    
  'from-orange-400 to-yellow-400', 
  'from-purple-400 to-pink-500', 
  'from-pink-400 to-rose-400',    
  'from-yellow-400 to-amber-400', 
  'from-indigo-400 to-purple-500', 
  'from-teal-400 to-green-500',    
];

// Dot colors for table indicators in sidebar
const DOT_COLORS = [
  'bg-red-500',
  'bg-green-500',
  'bg-cyan-500',
  'bg-blue-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-teal-500',
];

const RelateDBView: React.FC<{ dbId?: string }> = ({ dbId }) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'refs' | 'types' | 'visuals' | 'dbml'>('tables');
  
  // Workspace data structure
  const [workspaceData, setWorkspaceData] = useState<Record<string, WorkspaceData>>({
    'workspace': {
      schemas: [{ id: 'public', name: 'public', isDefault: true, isExpanded: true }],
      tables: [],
      relations: [],
      enums: [],
      areas: [],
      notes: []
    }
  });
  const [selectedWorkspace, setSelectedWorkspace] = useState('workspace');
  
  // Computed values from current workspace
  const tables = workspaceData[selectedWorkspace]?.tables || [];
  const schemas = workspaceData[selectedWorkspace]?.schemas || [];
  const relations = workspaceData[selectedWorkspace]?.relations || [];
  const enums = workspaceData[selectedWorkspace]?.enums || [];
  const areas = workspaceData[selectedWorkspace]?.areas || [];
  const notes = workspaceData[selectedWorkspace]?.notes || [];
  
  // Helper function to update current workspace data
  const updateWorkspaceData = (updater: (data: WorkspaceData) => WorkspaceData) => {
    setWorkspaceData(prev => ({
      ...prev,
      [selectedWorkspace]: updater(prev[selectedWorkspace])
    }));
  };
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(50);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [canvasSearchQuery, setCanvasSearchQuery] = useState('');
  const [renamingTable, setRenamingTable] = useState<string | null>(null);
  const [newTableName, setNewTableName] = useState('');
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [renamingSchema, setRenamingSchema] = useState<string | null>(null);
  const [newSchemaName, setNewSchemaName] = useState('');
  const [showAddSchemaModal, setShowAddSchemaModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{ type: 'schema' | 'workspace'; id?: string } | null>(null);
  const [notifications, setNotifications] = useState<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([]);
  const [addSchemaInput, setAddSchemaInput] = useState('');
  const [workspaces, setWorkspaces] = useState<string[]>(['workspace']);
  const [showAddWorkspaceModal, setShowAddWorkspaceModal] = useState(false);
  const [addWorkspaceInput, setAddWorkspaceInput] = useState('');
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableInput, setNewTableInput] = useState('');
  const [newTableSchema, setNewTableSchema] = useState('public');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [openTableMenu, setOpenTableMenu] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<{ tableName: string; columnName: string } | null>(null);
  const [openColumnMenu, setOpenColumnMenu] = useState<string | null>(null);
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editingColumns, setEditingColumns] = useState<Column[]>([]);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [addFieldTableName, setAddFieldTableName] = useState<string>('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('TEXT');
  const [editingColumnData, setEditingColumnData] = useState<Column | null>(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [history, setHistory] = useState<WorkspaceData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [newRelationSourceTable, setNewRelationSourceTable] = useState<string>('');
  const [newRelationSourceColumn, setNewRelationSourceColumn] = useState<string>('');
  const [newRelationTargetTable, setNewRelationTargetTable] = useState<string>('');
  const [newRelationTargetColumn, setNewRelationTargetColumn] = useState<string>('');
  const [newRelationCardinality, setNewRelationCardinality] = useState<'1:1' | '1:N' | 'N:1' | 'N:N'>('1:N');
  const [showAddEnumModal, setShowAddEnumModal] = useState(false);
  const [newEnumName, setNewEnumName] = useState('');
  const [newEnumValues, setNewEnumValues] = useState('');
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [draggingArea, setDraggingArea] = useState<string | null>(null);
  const [draggingNote, setDraggingNote] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [prevAreaPosition, setPrevAreaPosition] = useState<{ x: number; y: number } | null>(null);
  const [tablesInDraggedArea, setTablesInDraggedArea] = useState<string[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const schemaRenameInputRef = useRef<HTMLInputElement>(null);

  // Get table color 
  const getTableColor = (tableName: string) => {
    const index = tables.findIndex(t => t.name === tableName);
    return TABLE_COLORS[index % TABLE_COLORS.length];
  };

  // Get dot color 
  const getDotColor = (tableName: string) => {
    const index = tables.findIndex(t => t.name === tableName);
    return DOT_COLORS[index % DOT_COLORS.length];
  };

  // Get schema dot color
  const getSchemaDotColor = (schemaId: string) => {
    const index = schemas.findIndex(s => s.id === schemaId);
    return DOT_COLORS[index % DOT_COLORS.length];
  };

  // Toggle table expansion
  const toggleTableExpansion = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  // Handle add field to table
  const handleAddField = (tableName: string) => {
    setAddFieldTableName(tableName);
    setNewFieldName('');
    setNewFieldType('TEXT');
    setShowAddFieldModal(true);
    setOpenTableMenu(null);
  };

  const confirmAddField = () => {
    if (newFieldName && newFieldName.trim() && addFieldTableName) {
      const table = tables.find(t => t.name === addFieldTableName);
      if (table && !table.columns.find(c => c.name === newFieldName.trim())) {
        const newColumn: Column = {
          cid: table.columns.length,
          name: newFieldName.trim(),
          type: newFieldType,
          notnull: 0,
          dflt_value: null,
          pk: 0,
          isFK: 0
        };
        updateWorkspaceData(data => ({
          ...data,
          tables: data.tables.map(t => 
            t.name === addFieldTableName 
              ? { ...t, columns: [...t.columns, newColumn] } 
              : t
          )
        }));
        showNotification(`Field "${newFieldName.trim()}" added to table "${addFieldTableName}"!`, 'success');
        setShowAddFieldModal(false);
        setNewFieldName('');
        setAddFieldTableName('');
      } else {
        showNotification('Field name already exists!', 'error');
      }
    }
  };

  // Handle duplicate table
  const handleDuplicateTable = (tableName: string) => {
    showNotification(`Table "${tableName}" duplicated!`, 'success');
    setOpenTableMenu(null);
  };

  // Handle change schema
  const handleChangeSchema = (tableName: string) => {
    showNotification(`Change schema for "${tableName}" - Select new schema`, 'info');
    setOpenTableMenu(null);
  };

  // Handle delete table
  const handleDeleteTable = (tableName: string) => {
    updateWorkspaceData(data => ({
      ...data,
      tables: data.tables.filter(t => t.name !== tableName)
    }));
    showNotification(`Table "${tableName}" deleted!`, 'success');
    setOpenTableMenu(null);
  };

  // Handle delete column
  const handleDeleteColumn = () => {
    if (selectedColumn) {
      updateWorkspaceData(data => ({
        ...data,
        tables: data.tables.map(t => 
          t.name === selectedColumn.tableName
            ? { ...t, columns: t.columns.filter(c => c.name !== selectedColumn.columnName) }
            : t
        )
      }));
      showNotification(`Column "${selectedColumn.columnName}" deleted!`, 'success');
      setSelectedColumn(null);
    }
  };

  // Toggle schema expansion  
  const toggleSchema = (schemaId: string) => {
    updateWorkspaceData(data => ({
      ...data,
      schemas: data.schemas.map(s => 
        s.id === schemaId ? { ...s, isExpanded: !s.isExpanded } : s
      )
    }));
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Add new schema
  const handleAddSchema = () => {
    setShowAddSchemaModal(true);
  };

  const confirmAddSchema = () => {
    if (addSchemaInput && addSchemaInput.trim()) {
      const newSchema: Schema = {
        id: `schema_${Date.now()}`,
        name: addSchemaInput.trim(),
        isDefault: false,
        isExpanded: true
      };
      updateWorkspaceData(data => ({
        ...data,
        schemas: [...data.schemas, newSchema]
      }));
      showNotification(`Schema "${addSchemaInput.trim()}" created successfully!`, 'success');
      setAddSchemaInput('');
      setShowAddSchemaModal(false);
    }
  };

  // Add new workspace
  const handleAddWorkspace = () => {
    setShowAddWorkspaceModal(true);
    setAddWorkspaceInput('');
  };

  const confirmAddWorkspace = () => {
    if (addWorkspaceInput && addWorkspaceInput.trim()) {
      const newWorkspace = addWorkspaceInput.trim();
      if (!workspaces.includes(newWorkspace)) {
        // Initialize new workspace with default schema
        setWorkspaceData(prev => ({
          ...prev,
          [newWorkspace]: {
            schemas: [{ id: 'public', name: 'public', isDefault: true, isExpanded: true }],
            tables: [],
            relations: [],
            enums: [],
            areas: [],
            notes: []
          }
        }));
        setWorkspaces([...workspaces, newWorkspace]);
        setSelectedWorkspace(newWorkspace);
        showNotification(`Workspace "${newWorkspace}" created successfully!`, 'success');
      } else {
        showNotification('Workspace already exists!', 'error');
      }
      setAddWorkspaceInput('');
      setShowAddWorkspaceModal(false);
    }
  };

  // Add new table
  const handleAddTable = () => {
    setShowAddTableModal(true);
    setNewTableInput('');
    setNewTableSchema(schemas[0]?.id || 'public');
  };

  const confirmAddTable = () => {
    if (newTableInput && newTableInput.trim()) {
      const tableName = newTableInput.trim();
      if (tables.find(t => t.name === tableName)) {
        showNotification('Table name already exists!', 'error');
        return;
      }
      const newTable: Table = {
        name: tableName,
        position: { x: 100 + tables.length * 50, y: 100 + tables.length * 50 },
        columns: [
          {
            cid: 0,
            name: 'id',
            type: 'INTEGER',
            notnull: 1,
            dflt_value: null,
            pk: 1,
            isFK: 0
          }
        ],
        schemaId: newTableSchema,
        visible: true
      };
      updateWorkspaceData(data => ({
        ...data,
        tables: [...data.tables, newTable]
      }));
      showNotification(`Table "${tableName}" created successfully!`, 'success');
      setNewTableInput('');
      setShowAddTableModal(false);
    }
  };

  // Delete schema (only custom ones)
  const handleDeleteSchema = (schemaId: string) => {
    const schema = schemas.find(s => s.id === schemaId);
    if (schema && !schema.isDefault) {
      setShowDeleteModal({ type: 'schema', id: schemaId });
    }
  };

  const confirmDelete = () => {
    if (showDeleteModal?.type === 'schema' && showDeleteModal.id) {
      const schema = schemas.find(s => s.id === showDeleteModal.id);
      updateWorkspaceData(data => ({
        ...data,
        schemas: data.schemas.filter(s => s.id !== showDeleteModal.id),
        tables: data.tables.filter(t => t.schemaId !== showDeleteModal.id)
      }));
      showNotification(`Schema "${schema?.name}" deleted successfully!`, 'success');
    } else if (showDeleteModal?.type === 'workspace') {
      if (workspaces.length > 1 && selectedWorkspace !== 'workspace') {
        const filteredWorkspaces = workspaces.filter(ws => ws !== selectedWorkspace);
        const workspaceToDelete = selectedWorkspace;
        setSelectedWorkspace(filteredWorkspaces[0]);
        setWorkspaces(filteredWorkspaces);
        // Remove workspace data
        setWorkspaceData(prev => {
          const newData = { ...prev };
          delete newData[workspaceToDelete];
          return newData;
        });
        showNotification(`Workspace "${workspaceToDelete}" deleted successfully!`, 'success');
      } else if (selectedWorkspace === 'workspace') {
        showNotification('Cannot delete default workspace!', 'error');
      } else {
        showNotification('Cannot delete last workspace!', 'error');
      }
    }
    setShowDeleteModal(null);
  };

  // Start renaming table
  const handleDoubleClickTable = (tableName: string) => {
    setRenamingTable(tableName);
    setNewTableName(tableName);
  };

  // Confirm rename
  const handleRenameTable = () => {
    if (newTableName && newTableName.trim() && renamingTable) {
      updateWorkspaceData(data => ({
        ...data,
        tables: data.tables.map(t => 
          t.name === renamingTable ? { ...t, name: newTableName.trim() } : t
        )
      }));
      setRenamingTable(null);
      setNewTableName('');
    }
  };

  // Cancel rename
  const handleCancelRename = () => {
    setRenamingTable(null);
    setNewTableName('');
  };

  // Enter full table edit mode
  const handleEnterEditMode = (tableName: string) => {
    const table = tables.find(t => t.name === tableName);
    if (table) {
      setEditingTable(tableName);
      // Create a deep copy of columns for editing
      setEditingColumns(table.columns.map(col => ({ ...col })));
    }
  };

  // Update editing column field
  const handleColumnFieldChange = (columnIndex: number, field: keyof Column, value: any) => {
    setEditingColumns(editingColumns.map((col, idx) => 
      idx === columnIndex ? { ...col, [field]: value } : col
    ));
  };

  // Save all table edits
  const handleSaveTableEdits = () => {
    if (editingTable) {
      updateWorkspaceData(data => ({
        ...data,
        tables: data.tables.map(t => 
          t.name === editingTable ? { ...t, columns: editingColumns } : t
        )
      }));
      showNotification(`Table "${editingTable}" updated successfully!`, 'success');
      setEditingTable(null);
      setEditingColumns([]);
    }
  };

  // Cancel table edit mode
  const handleCancelTableEdit = () => {
    setEditingTable(null);
    setEditingColumns([]);
  };

  // Start renaming schema
  const handleDoubleClickSchema = (schemaId: string) => {
    const schema = schemas.find(s => s.id === schemaId);
    if (schema && !schema.isDefault) {
      setRenamingSchema(schemaId);
      setNewSchemaName(schema.name);
    }
  };

  // Confirm schema rename
  const handleRenameSchema = () => {
    if (newSchemaName && newSchemaName.trim() && renamingSchema) {
      const oldName = schemas.find(s => s.id === renamingSchema)?.name;
      updateWorkspaceData(data => ({
        ...data,
        schemas: data.schemas.map(s => 
          s.id === renamingSchema ? { ...s, name: newSchemaName.trim() } : s
        )
      }));
      showNotification(`Schema renamed from "${oldName}" to "${newSchemaName.trim()}"`, 'success');
      setRenamingSchema(null);
      setNewSchemaName('');
    }
  };

  // Cancel schema rename
  const handleCancelSchemaRename = () => {
    setRenamingSchema(null);
    setNewSchemaName('');
  };

  // Handle table drag start
  const handleTableMouseDown = (e: React.MouseEvent, tableName: string) => {
    if (renamingTable || !containerRef.current) return;
    const table = tables.find(t => t.name === tableName);
    if (!table) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const containerCenterX = rect.width / 2;
    const containerCenterY = rect.height / 2;
    
    const relativeX = e.clientX - rect.left - containerCenterX;
    const relativeY = e.clientY - rect.top - containerCenterY;
    
    setDraggingTable(tableName);
    setDragOffset({
      x: relativeX - table.position.x * (zoom / 100),
      y: relativeY - table.position.y * (zoom / 100)
    });
    e.preventDefault();
  };

  // Handle table drag move
  const handleMouseMove = (e: React.MouseEvent) => {
    // Handle canvas panning
    if (isDraggingCanvas && !draggingTable && !draggingArea && !draggingNote) {
      const dx = e.clientX - dragStartPos.x;
      const dy = e.clientY - dragStartPos.y;
      setCanvasPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStartPos({ x: e.clientX, y: e.clientY });
      return;
    }

    // Handle area dragging (with tables inside)
    if (draggingArea && containerRef.current && prevAreaPosition) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerCenterX = rect.width / 2;
      const containerCenterY = rect.height / 2;
      
      const relativeX = e.clientX - rect.left - containerCenterX;
      const relativeY = e.clientY - rect.top - containerCenterY;
      
      const newX = (relativeX - dragOffset.x) / (zoom / 100);
      const newY = (relativeY - dragOffset.y) / (zoom / 100);
      
      // Calculate delta movement
      const deltaX = newX - prevAreaPosition.x;
      const deltaY = newY - prevAreaPosition.y;
      
      // Update area position and ONLY the tables that were inside at drag start
      updateWorkspaceData(data => ({
        ...data,
        areas: data.areas.map(a => 
          a.id === draggingArea 
            ? { ...a, position: { x: newX, y: newY } }
            : a
        ),
        tables: data.tables.map(t => {
          // Only move tables that were in the area when dragging started
          if (tablesInDraggedArea.includes(t.name)) {
            return {
              ...t,
              position: {
                x: t.position.x + deltaX,
                y: t.position.y + deltaY
              }
            };
          }
          return t;
        })
      }));
      
      // Update previous position for next frame
      setPrevAreaPosition({ x: newX, y: newY });
      return;
    }

    // Handle note dragging
    if (draggingNote && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerCenterX = rect.width / 2;
      const containerCenterY = rect.height / 2;
      
      const relativeX = e.clientX - rect.left - containerCenterX;
      const relativeY = e.clientY - rect.top - containerCenterY;
      
      const newX = (relativeX - dragOffset.x) / (zoom / 100);
      const newY = (relativeY - dragOffset.y) / (zoom / 100);
      
      updateWorkspaceData(data => ({
        ...data,
        notes: data.notes.map(n => 
          n.id === draggingNote 
            ? { ...n, position: { x: newX, y: newY } }
            : n
        )
      }));
      return;
    }

    // Handle table dragging
    if (!draggingTable || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate position relative to container center
    const containerCenterX = rect.width / 2;
    const containerCenterY = rect.height / 2;
    
    const relativeX = e.clientX - rect.left - containerCenterX;
    const relativeY = e.clientY - rect.top - containerCenterY;
    
    const newX = (relativeX - dragOffset.x) / (zoom / 100);
    const newY = (relativeY - dragOffset.y) / (zoom / 100);
    
    // Keep within reasonable boundaries
    const minX = 20;
    const maxX = 1200;
    const minY = 20;
    const maxY = 700;
    
    const constrainedX = Math.max(minX, Math.min(newX, maxX));
    const constrainedY = Math.max(minY, Math.min(newY, maxY));
    
    updateWorkspaceData(data => ({
      ...data,
      tables: data.tables.map(t => 
        t.name === draggingTable 
          ? { ...t, position: { x: constrainedX, y: constrainedY } }
          : t
      )
    }));
  };

  // Handle table drag end
  const handleMouseUp = () => {
    // Check if a table was being dragged
    if (draggingTable) {
      const draggedTable = tables.find(t => t.name === draggingTable);
      if (draggedTable) {
        const tableX = draggedTable.position.x;
        const tableY = draggedTable.position.y;
        const tableWidth = 260;
        const tableHeight = 100;
        const tableCenterX = tableX + tableWidth / 2;
        const tableCenterY = tableY + tableHeight / 2;
        
        // Check all areas to see if table was dropped in any of them
        let tableAddedToArea = false;
        updateWorkspaceData(data => {
          const updatedAreas = data.areas.map(area => {
            // Check if table center is within area bounds
            const isInArea = (
              tableCenterX >= area.position.x &&
              tableCenterX <= area.position.x + area.size.width &&
              tableCenterY >= area.position.y &&
              tableCenterY <= area.position.y + area.size.height
            );
            
            if (isInArea) {
              // Add table to this area if not already there
              if (!area.tableIds.includes(draggingTable)) {
                tableAddedToArea = true;
                return { ...area, tableIds: [...area.tableIds, draggingTable] };
              }
            } else {
              // Remove table from this area if it was there
              if (area.tableIds.includes(draggingTable)) {
                return { ...area, tableIds: area.tableIds.filter(id => id !== draggingTable) };
              }
            }
            return area;
          });
          
          return { ...data, areas: updatedAreas };
        });
        
        if (tableAddedToArea) {
          showNotification(`Table "${draggingTable}" placed in area!`, 'success');
        }
      }
    }
    
    if (draggingTable || draggingArea || draggingNote) {
      saveToHistory();
    }
    setDraggingTable(null);
    setDraggingArea(null);
    setDraggingNote(null);
    setPrevAreaPosition(null);
    setTablesInDraggedArea([]);
    setIsDraggingCanvas(false);
  };

  // Handle canvas drag start
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only start canvas drag if clicking on the canvas background (not on a table)
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('canvas-draggable')) {
      setIsDraggingCanvas(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!mainContainerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await mainContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  // Handle sidebar resize
  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    if (!isFullscreen) return;
    setIsResizingSidebar(true);
    e.preventDefault();
  };

  const handleSidebarMouseMove = (e: MouseEvent) => {
    if (!isResizingSidebar) return;
    const newWidth = e.clientX - 64; // 64px is the icon sidebar width
    setSidebarWidth(Math.max(240, Math.min(newWidth, 600)));
  };

  const handleSidebarMouseUp = () => {
    setIsResizingSidebar(false);
  };

  // Focus rename input when it appears
  useEffect(() => {
    if (renamingTable && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingTable]);

  // Focus schema rename input when it appears
  useEffect(() => {
    if (renamingSchema && schemaRenameInputRef.current) {
      schemaRenameInputRef.current.focus();
      schemaRenameInputRef.current.select();
    }
  }, [renamingSchema]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Sidebar resize listeners
  useEffect(() => {
    if (isResizingSidebar) {
      document.addEventListener('mousemove', handleSidebarMouseMove);
      document.addEventListener('mouseup', handleSidebarMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleSidebarMouseMove);
        document.removeEventListener('mouseup', handleSidebarMouseUp);
      };
    }
  }, [isResizingSidebar]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenTableMenu(null);
      setOpenColumnMenu(null);
    };
    
    if (openTableMenu || openColumnMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openTableMenu, openColumnMenu]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Load database tables
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 10;

    const loadDatabase = async () => {
      try {
        setIsLoading(true);
        await initializeDatabase(dbId);

        while (isMounted && retryCount < maxRetries) {
          const tableNames = await getTables(dbId);
          
          if (tableNames && tableNames.length > 0) {
            const loadedTables: Table[] = [];
            const detectedRelations: Relation[] = [];
            
            for (let i = 0; i < tableNames.length; i++) {
              const tableName = tableNames[i];
              const schema = getTableSchema(tableName, dbId);
              
              const columns: Column[] = schema.map((col: any) => ({
                cid: col[0],
                name: col[1],
                type: col[2],
                notnull: col[3],
                dflt_value: col[4],
                pk: col[5],
                isFK: col[6],
                fkTable: col[7],
                fkColumn: col[8]
              }));

              // Auto-detect foreign key relationships
              columns.forEach(col => {
                if (col.isFK && col.fkTable && col.fkColumn) {
                  const relationId = `${tableName}_${col.name}_${col.fkTable}_${col.fkColumn}`;
                  if (!detectedRelations.find(r => r.id === relationId)) {
                    detectedRelations.push({
                      id: relationId,
                      sourceTable: tableName,
                      sourceColumn: col.name,
                      targetTable: col.fkTable,
                      targetColumn: col.fkColumn,
                      cardinality: 'N:1'
                    });
                  }
                }
              });

              // Position tables in a grid layout within public box
              const cols = Math.min(5, Math.ceil(Math.sqrt(tableNames.length))); // Max 5 columns
              const row = Math.floor(i / cols);
              const col = i % cols;

              loadedTables.push({
                name: tableName,
                position: { x: 30 + col * 280, y: 40 + row * 260 },
                columns,
                schemaId: 'public',
                visible: true
              });
            }

            if (isMounted) {
              const newData = {
                ...workspaceData[selectedWorkspace],
                tables: loadedTables,
                relations: detectedRelations,
                schemas: workspaceData[selectedWorkspace].schemas.map(s => 
                  s.id === 'public' ? { ...s, isExpanded: true } : s
                )
              };
              updateWorkspaceData(() => newData);
              
              // Initialize history with loaded data
              setHistory([JSON.parse(JSON.stringify(newData))]);
              setHistoryIndex(0);
              
              setIsLoading(false);
            }
            return;
          }

          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading database:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDatabase();
    return () => { isMounted = false; };
  }, [dbId]);

  // Render SVG relations between tables
  const renderRelations = () => {
    return relations.map((relation) => {
      const sourceTable = tables.find(t => t.name === relation.sourceTable);
      const targetTable = tables.find(t => t.name === relation.targetTable);
      
      if (!sourceTable || !targetTable) return null;

      const x1 = sourceTable.position.x + 130;
      const y1 = sourceTable.position.y + 40;
      const x2 = targetTable.position.x + 130;
      const y2 = targetTable.position.y + 40;

      // Calculate midpoint for label
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Relation label text
      const labelText = `${relation.sourceColumn} → ${relation.targetColumn}`;
      const cardinalityText = `[${relation.cardinality}]`;

      return (
        <g key={relation.id}>
          {/* Relation line */}
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#9ca3af"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            opacity="0.6"
          />
          
          {/* Background for label */}
          <rect
            x={midX - 60}
            y={midY - 18}
            width="120"
            height="36"
            fill="white"
            stroke="#d1d5db"
            strokeWidth="1"
            rx="4"
            opacity="0.95"
          />
          
          {/* Relation label */}
          <text
            x={midX}
            y={midY - 4}
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            fill="#374151"
            fontWeight="500"
          >
            {labelText}
          </text>
          
          {/* Cardinality label */}
          <text
            x={midX}
            y={midY + 10}
            textAnchor="middle"
            fontSize="9"
            fill="#14b8a6"
            fontWeight="600"
          >
            {cardinalityText}
          </text>
        </g>
      );
    });
  };

  // Filter tables based on search
  const getFilteredTables = (schemaId: string) => {
    let filtered = tables.filter(t => t.schemaId === schemaId);
    if (sidebarSearchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  // Save current state to history
  const saveToHistory = () => {
    const currentData = workspaceData[selectedWorkspace];
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(currentData)));
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  };

  // Undo action
  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setWorkspaceData(prev => ({
        ...prev,
        [selectedWorkspace]: JSON.parse(JSON.stringify(previousState))
      }));
      setHistoryIndex(historyIndex - 1);
      showNotification('Undo successful', 'info');
    }
  };

  // Redo action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setWorkspaceData(prev => ({
        ...prev,
        [selectedWorkspace]: JSON.parse(JSON.stringify(nextState))
      }));
      setHistoryIndex(historyIndex + 1);
      showNotification('Redo successful', 'info');
    }
  };

  // Toggle table visibility
  const toggleTableVisibility = (tableName: string) => {
    updateWorkspaceData(data => ({
      ...data,
      tables: data.tables.map(t => 
        t.name === tableName ? { ...t, visible: t.visible === false ? true : false } : t
      )
    }));
  };

  // Create new relation
  const handleCreateRelation = () => {
    if (newRelationSourceTable && newRelationSourceColumn && newRelationTargetTable && newRelationTargetColumn) {
      const newRelation: Relation = {
        id: `rel_${Date.now()}`,
        sourceTable: newRelationSourceTable,
        sourceColumn: newRelationSourceColumn,
        targetTable: newRelationTargetTable,
        targetColumn: newRelationTargetColumn,
        cardinality: newRelationCardinality
      };
      updateWorkspaceData(data => ({
        ...data,
        relations: [...data.relations, newRelation]
      }));
      showNotification('Relation created successfully!', 'success');
      // Reset form
      setNewRelationSourceTable('');
      setNewRelationSourceColumn('');
      setNewRelationTargetTable('');
      setNewRelationTargetColumn('');
      setNewRelationCardinality('1:N');
    } else {
      showNotification('Please fill all fields', 'error');
    }
  };

  // Delete relation
  const handleDeleteRelation = (relationId: string) => {
    updateWorkspaceData(data => ({
      ...data,
      relations: data.relations.filter(r => r.id !== relationId)
    }));
    showNotification('Relation deleted', 'info');
  };

  // Add new enum
  const handleAddEnum = () => {
    setShowAddEnumModal(true);
    setNewEnumName('');
    setNewEnumValues('');
  };

  const confirmAddEnum = () => {
    if (newEnumName && newEnumName.trim()) {
      const values = newEnumValues.split(',').map(v => v.trim()).filter(v => v);
      const newEnum: Enum = {
        id: `enum_${Date.now()}`,
        name: newEnumName.trim(),
        values: values
      };
      updateWorkspaceData(data => ({
        ...data,
        enums: [...data.enums, newEnum]
      }));
      showNotification(`Enum "${newEnumName.trim()}" created successfully!`, 'success');
      setNewEnumName('');
      setNewEnumValues('');
      setShowAddEnumModal(false);
    }
  };

  // Delete enum
  const handleDeleteEnum = (enumId: string) => {
    updateWorkspaceData(data => ({
      ...data,
      enums: data.enums.filter(e => e.id !== enumId)
    }));
    showNotification('Enum deleted', 'info');
  };

  // Add new area
  const handleAddArea = () => {
    setShowAddAreaModal(true);
    setNewAreaName('');
  };

  const confirmAddArea = () => {
    if (newAreaName && newAreaName.trim()) {
      // Generate random color for the area
      const colors = [
        '#6366f1', // indigo
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#14b8a6', // teal
        '#3b82f6', // blue
        '#f59e0b', // amber
        '#10b981', // emerald
        '#06b6d4'  // cyan
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newArea: Area = {
        id: `area_${Date.now()}`,
        name: newAreaName.trim(),
        position: { x: 400, y: 200 },
        size: { width: 500, height: 400 },
        color: randomColor,
        tableIds: []
      };
      updateWorkspaceData(data => ({
        ...data,
        areas: [...data.areas, newArea]
      }));
      showNotification(`Area "${newAreaName.trim()}" created successfully!`, 'success');
      setNewAreaName('');
      setShowAddAreaModal(false);
    }
  };

  // Delete area
  const handleDeleteArea = (areaId: string) => {
    updateWorkspaceData(data => ({
      ...data,
      areas: data.areas.filter(a => a.id !== areaId)
    }));
    showNotification('Area deleted', 'info');
  };

  // Add new note
  const handleAddNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      content: '',
      position: { x: 600, y: 300 }
    };
    updateWorkspaceData(data => ({
      ...data,
      notes: [...data.notes, newNote]
    }));
    setEditingNote(newNote.id);
    showNotification('Note created successfully!', 'success');
  };

  // Delete note
  const handleDeleteNote = (noteId: string) => {
    updateWorkspaceData(data => ({
      ...data,
      notes: data.notes.filter(n => n.id !== noteId)
    }));
    showNotification('Note deleted', 'info');
  };

  // Update note content
  const handleUpdateNoteContent = (noteId: string, content: string) => {
    updateWorkspaceData(data => ({
      ...data,
      notes: data.notes.map(n => n.id === noteId ? { ...n, content } : n)
    }));
  };

  // Handle area drag start
  const handleAreaMouseDown = (e: React.MouseEvent, areaId: string) => {
    if (!containerRef.current) return;
    const area = areas.find(a => a.id === areaId);
    if (!area) return;
    
    // Use the tableIds stored in the area
    setTablesInDraggedArea(area.tableIds);
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const containerCenterX = rect.width / 2;
    const containerCenterY = rect.height / 2;
    
    const relativeX = e.clientX - rect.left - containerCenterX;
    const relativeY = e.clientY - rect.top - containerCenterY;
    
    setDraggingArea(areaId);
    setPrevAreaPosition({ x: area.position.x, y: area.position.y });
    setDragOffset({
      x: relativeX - area.position.x * (zoom / 100),
      y: relativeY - area.position.y * (zoom / 100)
    });
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle note drag start
  const handleNoteMouseDown = (e: React.MouseEvent, noteId: string) => {
    if (!containerRef.current || editingNote === noteId) return;
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const containerCenterX = rect.width / 2;
    const containerCenterY = rect.height / 2;
    
    const relativeX = e.clientX - rect.left - containerCenterX;
    const relativeY = e.clientY - rect.top - containerCenterY;
    
    setDraggingNote(noteId);
    setDragOffset({
      x: relativeX - note.position.x * (zoom / 100),
      y: relativeY - note.position.y * (zoom / 100)
    });
    e.preventDefault();
    e.stopPropagation();
  };

  // Auto-arrange tables vertically within schema boundaries
  const autoArrangeTables = () => {
    saveToHistory();
    
    // Group tables by schema
    const tablesBySchema: Record<string, Table[]> = {};
    tables.forEach(table => {
      if (!tablesBySchema[table.schemaId]) {
        tablesBySchema[table.schemaId] = [];
      }
      tablesBySchema[table.schemaId].push(table);
    });

    const arrangedTables: Table[] = [];
    let schemaOffsetY = 50; // Start with some padding from top

    // Arrange each schema's tables vertically within their schema box
    schemas.forEach(schema => {
      const schemaTables = tablesBySchema[schema.id] || [];
      const schemaHeight = Math.max(400, schemaTables.length * 280 + 80);
      
      let tableYOffset = 60; // Start position within schema box (leaves room for schema label)
      
      schemaTables.forEach(table => {
        arrangedTables.push({
          ...table,
          position: { 
            x: 90, // Left padding inside schema box
            y: schemaOffsetY + tableYOffset 
          }
        });
        tableYOffset += 280; // Vertical spacing between tables
      });
      
      schemaOffsetY += schemaHeight + 40; // Move to next schema position
    });

    updateWorkspaceData(data => ({
      ...data,
      tables: arrangedTables
    }));
    
    showNotification('Tables auto-arranged vertically!', 'success');
  };

  // Generate DBML markup language
  const generateDBML = (): string => {
    let dbml = '';

    // Generate enum definitions
    if (enums.length > 0) {
      enums.forEach(enumItem => {
        dbml += `enum ${enumItem.name} {\n`;
        enumItem.values.forEach(value => {
          dbml += `  ${value}\n`;
        });
        dbml += `}\n\n`;
      });
    }

    // Generate table definitions
    tables.forEach(table => {
      const schema = schemas.find(s => s.id === table.schemaId);
      const schemaName = schema?.name || 'public';
      
      dbml += `Table "${schemaName}.${table.name}" {\n`;
      
      table.columns.forEach(col => {
        const constraints: string[] = [];
        
        if (col.pk === 1) {
          constraints.push('pk');
        }
        if (col.notnull === 1) {
          constraints.push('not null');
        }
        
        const constraintStr = constraints.length > 0 ? ` [${constraints.join(', ')}]` : '';
        dbml += `  ${col.name} ${col.type.toLowerCase()}${constraintStr}\n`;
      });
      
      dbml += `}\n\n`;
    });

    // Generate relationships
    if (relations.length > 0) {
      relations.forEach(rel => {
        let symbol = '>';
        
        // Map cardinality to DBML symbols
        switch (rel.cardinality) {
          case '1:1':
            symbol = '-';
            break;
          case '1:N':
            symbol = '>';
            break;
          case 'N:1':
            symbol = '<';
            break;
          case 'N:N':
            symbol = '<>';
            break;
        }
        
        dbml += `Ref: ${rel.sourceTable}.${rel.sourceColumn} ${symbol} ${rel.targetTable}.${rel.targetColumn}\n`;
      });
    }

    return dbml || '// No tables defined yet';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading database schema...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainContainerRef} className="flex h-full bg-white relative">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 min-w-[300px] animate-[slideIn_0.3s_ease-out] ${
              notif.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              notif.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {notif.type === 'success' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {notif.type === 'error' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {notif.type === 'info' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm font-medium flex-1">{notif.message}</span>
          </div>
        ))}
      </div>

      {/* Add Schema Modal */}
      {showAddSchemaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" onClick={() => setShowAddSchemaModal(false)}>
          <div 
            className="bg-gradient-to-br from-teal-50/95 to-cyan-100/90 backdrop-blur-xl border border-teal-200 rounded-2xl shadow-2xl p-6 w-96"
            style={{
              background: 'linear-gradient(135deg, rgba(243, 142, 27, 0.95) 0%, rgba(243, 142, 27, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Schema</h3>
            <input
              type="text"
              value={addSchemaInput}
              onChange={(e) => setAddSchemaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmAddSchema();
                if (e.key === 'Escape') setShowAddSchemaModal(false);
              }}
              placeholder="Enter schema name..."
              className="w-full px-3 py-2 border border-teal-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddSchemaModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddSchema}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-md"
              >
                Add Schema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Workspace Modal */}
      {showAddWorkspaceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" onClick={() => setShowAddWorkspaceModal(false)}>
          <div 
            className="bg-gradient-to-br from-blue-50/95 to-indigo-100/90 backdrop-blur-xl border border-blue-200 rounded-2xl shadow-2xl p-6 w-96"
            style={{
              background: 'linear-gradient(135deg, rgba(239,246,255,0.95) 0%, rgba(224,231,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Workspace</h3>
            <input
              type="text"
              value={addWorkspaceInput}
              onChange={(e) => setAddWorkspaceInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmAddWorkspace();
                if (e.key === 'Escape') setShowAddWorkspaceModal(false);
              }}
              placeholder="Enter workspace name..."
              className="w-full px-3 py-2 border border-blue-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddWorkspaceModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddWorkspace}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md"
              >
                Add Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" onClick={() => setShowAddTableModal(false)}>
          <div 
            className="bg-gradient-to-br from-emerald-50/95 to-teal-100/90 backdrop-blur-xl border border-emerald-200 rounded-2xl shadow-2xl p-6 w-96"
            style={{
              background: 'linear-gradient(135deg, rgba(236,253,245,0.95) 0%, rgba(204,251,241,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Table</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Table Name</label>
                <input
                  type="text"
                  value={newTableInput}
                  onChange={(e) => setNewTableInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmAddTable();
                    if (e.key === 'Escape') setShowAddTableModal(false);
                  }}
                  placeholder="Enter table name..."
                  className="w-full px-3 py-2 border border-emerald-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schema</label>
                <select
                  value={newTableSchema}
                  onChange={(e) => setNewTableSchema(e.target.value)}
                  className="w-full px-3 py-2 border border-emerald-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  {schemas.map(schema => (
                    <option key={schema.id} value={schema.id}>{schema.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setShowAddTableModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddTable}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-md"
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Area Modal */}
      {showAddAreaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" onClick={() => setShowAddAreaModal(false)}>
          <div 
            className="bg-gradient-to-br from-purple-50/95 to-violet-100/90 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-2xl p-6 w-96"
            style={{
              background: 'linear-gradient(135deg, rgba(250,245,255,0.95) 0%, rgba(237,233,254,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Area</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area Name</label>
              <input
                type="text"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmAddArea();
                  if (e.key === 'Escape') setShowAddAreaModal(false);
                }}
                placeholder="e.g., New Area"
                className="w-full px-3 py-2 border border-purple-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                autoFocus
              />
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setShowAddAreaModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddArea}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-md"
              >
                Add Area
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Enum Modal */}
      {showAddEnumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" onClick={() => setShowAddEnumModal(false)}>
          <div 
            className="bg-gradient-to-br from-orange-50/95 to-amber-100/90 backdrop-blur-xl border border-orange-200 rounded-2xl shadow-2xl p-6 w-96"
            style={{
              background: 'linear-gradient(135deg, rgba(255,247,237,0.95) 0%, rgba(254,243,199,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Enum</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enum Name</label>
                <input
                  type="text"
                  value={newEnumName}
                  onChange={(e) => setNewEnumName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newEnumName && newEnumValues) confirmAddEnum();
                    if (e.key === 'Escape') setShowAddEnumModal(false);
                  }}
                  placeholder="e.g., status"
                  className="w-full px-3 py-2 border border-orange-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Values (comma-separated)</label>
                <input
                  type="text"
                  value={newEnumValues}
                  onChange={(e) => setNewEnumValues(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newEnumName && newEnumValues) confirmAddEnum();
                    if (e.key === 'Escape') setShowAddEnumModal(false);
                  }}
                  placeholder="e.g., active, inactive, pending"
                  className="w-full px-3 py-2 border border-orange-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setShowAddEnumModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddEnum}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-md"
              >
                Add Enum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" onClick={() => setShowAddFieldModal(false)}>
          <div 
            className="bg-gradient-to-br from-purple-50/95 to-pink-100/90 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-2xl p-6 w-96"
            style={{
              background: 'linear-gradient(135deg, rgba(250,245,255,0.95) 0%, rgba(252,231,243,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Field to "{addFieldTableName}"</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmAddField();
                    if (e.key === 'Escape') setShowAddFieldModal(false);
                  }}
                  placeholder="Enter field name..."
                  className="w-full px-3 py-2 border border-purple-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                >
                  <option value="TEXT">TEXT</option>
                  <option value="INTEGER">INTEGER</option>
                  <option value="REAL">REAL</option>
                  <option value="BLOB">BLOB</option>
                  <option value="VARCHAR">VARCHAR</option>
                  <option value="DATE">DATE</option>
                  <option value="DATETIME">DATETIME</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setShowAddFieldModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddField}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-md"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Attributes Panel */}
      {selectedColumn && (() => {
        const table = tables.find(t => t.name === selectedColumn.tableName);
        const column = table?.columns.find(c => c.name === selectedColumn.columnName);
        if (!column || !editingColumnData) return null;

        const handleSaveColumnAttributes = () => {
          updateWorkspaceData(data => ({
            ...data,
            tables: data.tables.map(t => 
              t.name === selectedColumn.tableName
                ? { 
                    ...t, 
                    columns: t.columns.map(c => 
                      c.name === selectedColumn.columnName ? editingColumnData : c
                    )
                  }
                : t
            )
          }));
          showNotification(`Column "${editingColumnData.name}" updated successfully!`, 'success');
          setSelectedColumn(null);
          setEditingColumnData(null);
        };

        return (
          <div className="fixed inset-0 bg-black/30 flex items-start justify-end z-[9998]" onClick={() => { setSelectedColumn(null); setEditingColumnData(null); }}>
            <div 
              className="w-96 h-full shadow-2xl overflow-y-auto backdrop-blur-xl border-l border-cyan-200"
              style={{
                background: 'linear-gradient(135deg, rgba(236,254,255,0.95) 0%, rgba(207,250,254,0.9) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-cyan-50/80 backdrop-blur-md border-b border-cyan-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Field Attributes</h3>
                <button onClick={() => { setSelectedColumn(null); setEditingColumnData(null); }} className="p-1 hover:bg-white/60 rounded transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-4 space-y-6">
                {/* Column Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Column Name</label>
                  <input
                    type="text"
                    value={editingColumnData.name}
                    onChange={(e) => setEditingColumnData({ ...editingColumnData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-cyan-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  />
                </div>

                {/* Data Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                  <select 
                    value={editingColumnData.type}
                    onChange={(e) => setEditingColumnData({ ...editingColumnData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-cyan-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  >
                    <option value="TEXT">TEXT</option>
                    <option value="INTEGER">INTEGER</option>
                    <option value="REAL">REAL</option>
                    <option value="BLOB">BLOB</option>
                    <option value="VARCHAR">VARCHAR</option>
                    <option value="DATE">DATE</option>
                    <option value="DATETIME">DATETIME</option>
                    <option value="BOOLEAN">BOOLEAN</option>
                  </select>
                </div>

                {/* Not Null */}
                <div className="flex items-center justify-between py-3 border-b border-cyan-200/50">
                  <span className="text-sm font-medium text-gray-700">Not Null</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingColumnData.notnull === 1}
                      onChange={(e) => setEditingColumnData({ ...editingColumnData, notnull: e.target.checked ? 1 : 0 })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
                </div>

                {/* Primary Key */}
                <div className="flex items-center justify-between py-3 border-b border-cyan-200/50">
                  <span className="text-sm font-medium text-gray-700">Primary Key</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingColumnData.pk === 1}
                      onChange={(e) => setEditingColumnData({ ...editingColumnData, pk: e.target.checked ? 1 : 0 })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* Default Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Value</label>
                  <input
                    type="text"
                    value={editingColumnData.dflt_value || ''}
                    onChange={(e) => setEditingColumnData({ ...editingColumnData, dflt_value: e.target.value || null })}
                    placeholder="No default"
                    className="w-full px-3 py-2 border border-cyan-300 bg-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  />
                </div>

                {/* Save Changes Button */}
                <button
                  onClick={handleSaveColumnAttributes}
                  className="w-full px-4 py-2.5 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>

                {/* Delete Column Button */}
                <button
                  onClick={handleDeleteColumn}
                  className="w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-white/70 border border-red-300 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Column
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" onClick={() => setShowDeleteModal(null)}>
          <div 
            className="bg-gradient-to-br from-rose-50/95 to-red-100/90 backdrop-blur-xl border border-rose-200 rounded-2xl shadow-2xl p-6 w-96"
            style={{
              background: 'linear-gradient(135deg, rgba(255,241,242,0.95) 0%, rgba(254,226,226,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-4">
              {showDeleteModal.type === 'schema' 
                ? `Are you sure you want to delete the schema "${schemas.find(s => s.id === showDeleteModal.id)?.name}"? This will also delete all tables in this schema.`
                : 'Are you sure you want to delete this workspace?'
              }
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div className="fixed inset-0 z-[9997]" onClick={() => setShowFiltersPanel(false)}>
          <div 
            className="absolute top-16 right-4 w-80 bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <span className="text-sm text-teal-600 font-medium">Visibility</span>
                </div>
                <button 
                  onClick={() => setShowFiltersPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Schema Groups */}
              <div className="space-y-3 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {schemas.map(schema => {
                  const schemaTables = tables.filter(t => t.schemaId === schema.id);
                  const visibleCount = schemaTables.filter(t => t.visible !== false).length;
                  
                  return (
                    <div key={schema.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Schema Header */}
                      <div className="bg-gray-50 px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getSchemaDotColor(schema.id)}`}></div>
                          <span className="text-sm font-semibold text-gray-800">{schema.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{visibleCount}/{schemaTables.length}</span>
                      </div>

                      {/* Tables List */}
                      <div className="divide-y divide-gray-100">
                        {schemaTables.map(table => (
                          <div 
                            key={table.name} 
                            className="px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm text-gray-700">{table.name}</span>
                            <button
                              onClick={() => toggleTableVisibility(table.name)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title={table.visible === false ? 'Show table' : 'Hide table'}
                            >
                              {table.visible === false ? (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Vertical Icon Sidebar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4">
        <button
          onClick={() => setActiveTab('tables')}
          className={`p-3 rounded-lg transition-colors ${
            activeTab === 'tables' ? 'bg-teal-100 text-teal-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="Tables"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </button>

        <button
          onClick={() => setActiveTab('refs')}
          className={`p-3 rounded-lg transition-colors ${
            activeTab === 'refs' ? 'bg-teal-100 text-teal-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="Refs"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        <button
          onClick={() => setActiveTab('types')}
          className={`p-3 rounded-lg transition-colors ${
            activeTab === 'types' ? 'bg-teal-100 text-teal-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="Types"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        <button
          onClick={() => setActiveTab('visuals')}
          className={`p-3 rounded-lg transition-colors ${
            activeTab === 'visuals' ? 'bg-teal-100 text-teal-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="Visuals"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <button
          onClick={() => setActiveTab('dbml')}
          className={`p-3 rounded-lg transition-colors ${
            activeTab === 'dbml' ? 'bg-teal-100 text-teal-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="DBML"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>

      {/* Main Content Sidebar */}
      <div 
        className="bg-white border-r border-gray-200 flex flex-col relative"
        style={{ width: isFullscreen ? `${sidebarWidth}px` : '320px' }}
      >
        {/* Workspace Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <select 
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {workspaces.map(ws => (
              <option key={ws} value={ws}>{ws}</option>
            ))}
          </select>
          <button 
            onClick={handleAddWorkspace}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
            title="Add workspace"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button 
            onClick={() => setShowDeleteModal({ type: 'workspace' })}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
            title="Delete workspace"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'tables' && (
            <div className="p-4">
              {/* Add Schema Button */}
              <button 
                onClick={handleAddSchema}
                className="w-full mb-4 px-4 py-2.5 border-2 border-dashed border-gray-300 hover:border-teal-400 text-gray-600 hover:text-teal-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add schema
              </button>

              {/* Search Bar */}
              <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Filter tables..."
                    value={sidebarSearchQuery}
                    onChange={(e) => setSidebarSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button 
                  onClick={handleAddTable}
                  className="px-3 py-2 border border-gray-300 hover:border-teal-400 hover:bg-teal-50 rounded-lg transition-colors"
                  title="Add table"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Schemas List */}
              <div className="space-y-2">
                {schemas.map((schema) => {
                  const schemaTables = getFilteredTables(schema.id);
                  
                  return (
                    <div 
                      key={schema.id}
                      className="rounded-xl bg-gradient-to-br from-teal-50/80 to-cyan-50/60 backdrop-blur-md border border-teal-200/50 shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(204,251,241,0.8) 0%, rgba(207,250,254,0.6) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                    >
                      {/* Schema Header */}
                      <div 
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl group transition-all ${
                          schema.isExpanded ? 'bg-teal-100/40' : 'hover:bg-teal-100/30'
                        }`}
                      >
                        <button className="flex-shrink-0 p-0.5 opacity-50 hover:opacity-100">
                          <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => toggleSchema(schema.id)}
                          className="flex-shrink-0"
                        >
                          <svg className={`w-3.5 h-3.5 text-gray-700 transition-transform ${schema.isExpanded ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full ${getSchemaDotColor(schema.id)}`}></div>
                        {renamingSchema === schema.id ? (
                          <>
                            <input
                              ref={schemaRenameInputRef}
                              type="text"
                              value={newSchemaName}
                              onChange={(e) => setNewSchemaName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRenameSchema();
                                if (e.key === 'Escape') handleCancelSchemaRename();
                              }}
                              className="flex-1 text-sm font-medium text-gray-800 bg-white border border-teal-400 rounded px-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRenameSchema();
                              }}
                              className="p-0.5 hover:bg-green-100 rounded transition-colors"
                              title="Save"
                            >
                              <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelSchemaRename();
                              }}
                              className="p-0.5 hover:bg-red-100 rounded transition-colors"
                              title="Cancel"
                            >
                              <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm font-medium text-gray-700 flex-1">{schema.name}</span>
                            <span className="text-xs text-gray-500 font-medium">{schemaTables.length}</span>
                          </>
                        )}
                        {renamingSchema !== schema.id && (
                          <>
                            {schema.isDefault ? (
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDoubleClickSchema(schema.id);
                                  }}
                                  className="p-0.5 hover:bg-white/80 rounded transition-colors"
                                  title="Edit schema name"
                                >
                                  <svg className="w-3.5 h-3.5 text-gray-500 hover:text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSchema(schema.id);
                                  }}
                                  className="p-0.5 hover:bg-white/80 rounded transition-colors"
                                  title="Delete schema"
                                >
                                  <svg className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </>
                            )}
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="p-0.5 hover:bg-white/80 rounded transition-colors"
                            >
                              <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Tables in Schema */}
                      {schema.isExpanded && (
                        <div className="ml-3 mt-2 mr-2 space-y-1.5 pb-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-transparent">
                          {schemaTables.map((table) => (
                            <div 
                              key={table.name}
                              className="rounded-lg bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-sm border border-teal-200/40 shadow-sm"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(240,253,250,0.5) 100%)',
                                backdropFilter: 'blur(6px)',
                                WebkitBackdropFilter: 'blur(6px)',
                              }}
                            >
                              <div 
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer group/table transition-all ${
                                  selectedTable === table.name ? 'bg-teal-50/50' : 'hover:bg-teal-50/30'
                                }`}
                              >
                                <button className="flex-shrink-0 p-0.5 opacity-50 hover:opacity-100">
                                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => toggleTableExpansion(table.name)}
                                  className="flex-shrink-0"
                                >
                                  <svg className={`w-3 h-3 text-gray-600 transition-transform ${expandedTables.has(table.name) ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${getDotColor(table.name)}`}></div>
                                
                                {renamingTable === table.name ? (
                                  <>
                                    <input
                                      ref={renameInputRef}
                                      type="text"
                                      value={newTableName}
                                      onChange={(e) => setNewTableName(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRenameTable();
                                        if (e.key === 'Escape') handleCancelRename();
                                      }}
                                      className="flex-1 text-sm font-medium text-gray-800 bg-white border border-teal-400 rounded px-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRenameTable();
                                      }}
                                      className="p-0.5 hover:bg-green-100 rounded transition-colors"
                                      title="Save"
                                    >
                                      <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelRename();
                                      }}
                                      className="p-0.5 hover:bg-red-100 rounded transition-colors"
                                      title="Cancel"
                                    >
                                      <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span 
                                      className="text-sm font-medium text-gray-800 flex-1 truncate min-w-0"
                                      onClick={() => setSelectedTable(table.name)}
                                      title={table.name}
                                    >
                                      {table.name}
                                    </span>
                                    <span className="text-xs text-gray-500 flex-shrink-0">{table.columns.length}</span>
                                  </>
                                )}
                                
                                {renamingTable !== table.name && (
                                  <>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDoubleClickTable(table.name);
                                      }}
                                      className="p-0.5 opacity-0 group-hover/table:opacity-100 hover:bg-white/80 rounded transition-all"
                                  title="Edit table name"
                                >
                                  <svg className="w-3 h-3 text-gray-400 hover:text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <div className="relative">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenTableMenu(openTableMenu === table.name ? null : table.name);
                                    }}
                                    className="p-0.5 opacity-0 group-hover/table:opacity-100 hover:bg-white/80 rounded transition-all"
                                  >
                                    <svg className="w-3 h-3 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                  </button>

                                  {/* Three-dot Menu Dropdown */}
                                  {openTableMenu === table.name && (
                                    <div 
                                      className="absolute right-0 top-6 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        onClick={() => handleAddField(table.name)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Field
                                      </button>
                                      <button
                                        onClick={() => handleDuplicateTable(table.name)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Duplicate Table
                                      </button>
                                      <button
                                        onClick={() => handleChangeSchema(table.name)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        Change Schema
                                        <svg className="w-3 h-3 text-gray-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                      <div className="border-t border-gray-200 my-1"></div>
                                      <button
                                        onClick={() => handleDeleteTable(table.name)}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Table
                                      </button>
                                    </div>
                                  )}
                                </div>
                                  </>
                                )}
                              </div>

                              {/* Table Columns (expanded) */}
                              {expandedTables.has(table.name) && (
                                <div className="ml-5 mt-1 mr-2 mb-2 space-y-0.5 max-h-64 overflow-y-auto">
                                  {table.columns.map((col) => (
                                    <div 
                                      key={col.name}
                                      className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-teal-50/40 group/col transition-colors text-xs"
                                    >
                                      <button className="flex-shrink-0 p-0.5 opacity-50 hover:opacity-100">
                                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                        </svg>
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setSelectedColumn({ tableName: table.name, columnName: col.name });
                                          setEditingColumnData({ ...col });
                                        }}
                                        className="p-0.5 opacity-0 group-hover/col:opacity-100 hover:bg-white/80 rounded transition-all flex-shrink-0"
                                        title="Edit column"
                                      >
                                        <svg className="w-2.5 h-2.5 text-gray-400 hover:text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </button>
                                      <span className={`text-xs flex-1 truncate min-w-0 ${
                                        col.pk ? 'font-semibold text-gray-800' : 'text-gray-700'
                                      }`} title={col.name}>
                                        {col.name}
                                      </span>
                                      {col.pk && (
                                        <span title="Primary Key">
                                          <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75l.607.607a.5.5 0 00.707-.707l-2-2a.5.5 0 00-.707 0l-2 2a.5.5 0 00.707.707l.607-.607A3.001 3.001 0 0110 2z" />
                                          </svg>
                                        </span>
                                      )}
                                      <div className="relative flex-shrink-0">
                                        <select 
                                          className="text-[9px] text-gray-600 bg-white/50 border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-500 uppercase cursor-pointer min-w-[60px] max-w-[80px]"
                                          value={col.type}
                                        >
                                          <option value="TEXT">TEXT</option>
                                          <option value="INTEGER">INT</option>
                                          <option value="REAL">REAL</option>
                                          <option value="BLOB">BLOB</option>
                                          <option value="VARCHAR">VARCHAR</option>
                                          <option value="CHAR">CHAR</option>
                                          <option value="DATE">DATE</option>
                                          <option value="TIME">TIME</option>
                                          <option value="TIMESTAMP">TIMESTAMP</option>
                                        </select>
                                      </div>
                                      {col.notnull === 0 && (
                                        <span className="text-[10px] font-bold text-orange-500" title="Nullable">
                                          N
                                        </span>
                                      )}
                                      <div className="relative">
                                        <button 
                                          onClick={() => setOpenColumnMenu(openColumnMenu === col.name ? null : col.name)}
                                          className="p-0.5 opacity-0 group-hover/col:opacity-100 hover:bg-white/80 rounded transition-all"
                                        >
                                          <svg className="w-3 h-3 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                          </svg>
                                        </button>

                                        {/* Column Menu Dropdown */}
                                        {openColumnMenu === col.name && (
                                          <div 
                                            className="absolute right-0 top-6 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <button
                                              onClick={() => {
                                                setSelectedColumn({ tableName: table.name, columnName: col.name });
                                                setEditingColumnData({ ...col });
                                                setOpenColumnMenu(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                              Edit Field
                                            </button>
                                            <button
                                              onClick={() => {
                                                showNotification(`Column "${col.name}" deleted!`, 'success');
                                                setOpenColumnMenu(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                            >
                                              Delete Field
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Add Field Button */}
                                  <button
                                    onClick={() => handleAddField(table.name)}
                                    className="flex items-center gap-1.5 px-2 py-1.5 mt-1 w-full text-xs text-teal-600 hover:bg-teal-50/50 rounded transition-colors border border-dashed border-teal-300 hover:border-teal-400"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Field
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'refs' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Relations
                  </h3>
                </div>
                <span className="text-sm text-gray-500">{relations.length}</span>
              </div>

              {/* Create Relation Form */}
              <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Create relation</h4>
                
                {/* Source Table */}
                <div className="mb-3">
                  <label className="text-xs text-gray-600 mb-1 block">Source table</label>
                  <select
                    value={newRelationSourceTable}
                    onChange={(e) => {
                      setNewRelationSourceTable(e.target.value);
                      setNewRelationSourceColumn('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select table</option>
                    {tables.map(table => (
                      <option key={table.name} value={table.name}>{table.name}</option>
                    ))}
                  </select>
                </div>

                {/* Source Column */}
                <div className="mb-3">
                  <label className="text-xs text-gray-600 mb-1 block">Source column</label>
                  <select
                    value={newRelationSourceColumn}
                    onChange={(e) => setNewRelationSourceColumn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={!newRelationSourceTable}
                  >
                    <option value="">Select column</option>
                    {newRelationSourceTable && tables.find(t => t.name === newRelationSourceTable)?.columns.map(col => (
                      <option key={col.name} value={col.name}>{col.name} ({col.type})</option>
                    ))}
                  </select>
                </div>

                {/* Target Table */}
                <div className="mb-3">
                  <label className="text-xs text-gray-600 mb-1 block">Target table</label>
                  <select
                    value={newRelationTargetTable}
                    onChange={(e) => {
                      setNewRelationTargetTable(e.target.value);
                      setNewRelationTargetColumn('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select table</option>
                    {tables.map(table => (
                      <option key={table.name} value={table.name}>{table.name}</option>
                    ))}
                  </select>
                </div>

                {/* Target Column */}
                <div className="mb-3">
                  <label className="text-xs text-gray-600 mb-1 block">Target column</label>
                  <select
                    value={newRelationTargetColumn}
                    onChange={(e) => setNewRelationTargetColumn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={!newRelationTargetTable}
                  >
                    <option value="">Select column</option>
                    {newRelationTargetTable && tables.find(t => t.name === newRelationTargetTable)?.columns.map(col => (
                      <option key={col.name} value={col.name}>{col.name} ({col.type})</option>
                    ))}
                  </select>
                </div>

                {/* Cardinality */}
                <div className="mb-4">
                  <label className="text-xs text-gray-600 mb-1 block">Cardinality</label>
                  <select
                    value={newRelationCardinality}
                    onChange={(e) => setNewRelationCardinality(e.target.value as '1:1' | '1:N' | 'N:1' | 'N:N')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="1:N">1:N</option>
                    <option value="1:1">1:1</option>
                    <option value="N:1">N:1</option>
                    <option value="N:N">N:N</option>
                  </select>
                </div>

                {/* Create Button */}
                <button
                  onClick={handleCreateRelation}
                  className="w-full px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>

              {/* Relations List */}
              {relations.length > 0 ? (
                <div className="space-y-2">
                  {relations.map((rel) => (
                    <div key={rel.id} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition-colors group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-900">{rel.sourceTable}</span>
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-900">{rel.targetTable}</span>
                          </div>
                          <div className="text-xs font-mono text-gray-600">
                            {rel.sourceColumn} → {rel.targetColumn}
                          </div>
                          <div className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded">
                            {rel.cardinality}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteRelation(rel.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                          title="Delete relation"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p className="text-sm text-gray-500">No relations yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'types' && (
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Types</h3>
                </div>
                <span className="text-xs text-gray-500">{enums.length} Enums</span>
              </div>

              {/* Enums Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Enums</h4>
                  <button
                    onClick={handleAddEnum}
                    className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Enum
                  </button>
                </div>

                {/* Enums List */}
                {enums.length > 0 ? (
                  <div className="space-y-2">
                    {enums.map((enumItem) => (
                      <div key={enumItem.id} className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900">{enumItem.name}</span>
                            </div>
                            {enumItem.values.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {enumItem.values.map((value, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-white text-gray-700 text-xs font-mono rounded border border-gray-200">
                                    {value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteEnum(enumItem.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                            title="Delete enum"
                          >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400">No enums yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'visuals' && (
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Visuals</h3>
                </div>
                <span className="text-xs text-gray-500">{areas.length} Areas · {notes.length} Notes</span>
              </div>

              {/* Areas Section */}
              <div 
                className="space-y-3 mb-6 rounded-xl backdrop-blur-md border shadow-lg p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(221,214,254,0.8) 0%, rgba(233,213,255,0.6) 100%)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderColor: 'rgba(168,85,247,0.3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-purple-900">Areas</h4>
                  <button
                    onClick={handleAddArea}
                    className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Area
                  </button>
                </div>
                <p className="text-xs text-purple-700">Areas group tables visually on the canvas.</p>

                {/* Areas List */}
                {areas.length > 0 ? (
                  <div className="space-y-2">
                    {areas.map((area) => (
                      <div key={area.id} className="relative p-4 bg-gradient-to-br from-white/70 via-white/50 to-white/30 backdrop-blur-xl rounded-xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] hover:border-white/90 transition-all duration-300 group overflow-hidden">
                        {/* Glassmorphism overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 via-transparent to-indigo-400/10 pointer-events-none"></div>
                        
                        <div className="relative flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-3.5 h-3.5 rounded-full shadow-md ring-2 ring-white/50" style={{ backgroundColor: area.color }}></div>
                              <span className="text-sm font-semibold text-gray-900">{area.name}</span>
                            </div>
                            {area.tableIds && area.tableIds.length > 0 && (
                              <div className="ml-5 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/60 text-gray-700 backdrop-blur-sm">
                                  {area.tableIds.length} table{area.tableIds.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteArea(area.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all backdrop-blur-sm"
                            title="Delete area"
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-purple-400">No areas yet</p>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              <div 
                className="space-y-3 rounded-xl backdrop-blur-md border shadow-lg p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(254,243,199,0.8) 0%, rgba(253,230,138,0.6) 100%)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderColor: 'rgba(251,191,36,0.3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-amber-900">Notes</h4>
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Note
                  </button>
                </div>
                <p className="text-xs text-amber-700">Notes are text blocks you place on the canvas.</p>

                {/* Notes List */}
                {notes.length > 0 ? (
                  <div className="space-y-2">
                    {notes.map((note) => (
                      <div key={note.id} className="relative p-4 bg-gradient-to-br from-white/70 via-white/50 to-white/30 backdrop-blur-xl rounded-xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] hover:border-white/90 transition-all duration-300 group overflow-hidden">
                        {/* Glassmorphism overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-amber-400/10 pointer-events-none"></div>
                        
                        <div className="relative flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-base">📝</span>
                              <span className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Note</span>
                            </div>
                            <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
                              {note.content || <span className="text-gray-500 italic">Empty note</span>}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all ml-2 flex-shrink-0 backdrop-blur-sm"
                            title="Delete note"
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-amber-400">No notes yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dbml' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">DBML</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateDBML());
                    showNotification('DBML copied to clipboard!', 'success');
                  }}
                  className="text-xs px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-xs text-green-400 font-mono whitespace-pre">
                  {generateDBML()}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            <span>{tables.length} Tables</span>
          </div>
          <span>{relations.length} Relations</span>
        </div>

        {/* Resize Handle (only in fullscreen) */}
        {isFullscreen && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-teal-400 transition-colors group"
            onMouseDown={handleSidebarMouseDown}
          >
            <div className="absolute inset-y-0 -right-1 w-3"></div>
            {isResizingSidebar && (
              <div className="absolute inset-y-0 right-0 w-0.5 bg-teal-500"></div>
            )}
          </div>
        )}
      </div>

      {/* Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 relative bg-gray-50 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Canvas Zoom Container */}
        <div
          className="relative w-full h-full"
          style={{
            transform: `scale(${zoom / 100}) translate(${canvasPan.x / (zoom / 100)}px, ${canvasPan.y / (zoom / 100)}px)`,
            transformOrigin: 'center center',
            transition: draggingTable || isDraggingCanvas ? 'none' : 'transform 0.2s'
          }}
        >
          <div 
            ref={canvasRef} 
            className="relative w-full h-full canvas-draggable"
            onMouseDown={handleCanvasMouseDown}
            style={{ minHeight: '800px', paddingTop: '20px', paddingBottom: '20px' }}
          >
          {/* Dynamic Schema Boxes */}
          {(() => {
            // First pass: calculate all schema boxes
            const schemaBoxes = schemas.map(schema => {
              const schemaTables = tables.filter(t => t.schemaId === schema.id && t.visible !== false);
              
              // Calculate bounding box of all tables in this schema
              let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
              const padding = 40; // Padding around tables
              const tableWidth = 260;
              
              if (schemaTables.length > 0) {
                schemaTables.forEach(table => {
                  // Calculate actual table height based on columns
                  const headerHeight = 40;
                  const columnHeight = table.columns.length * 28;
                  const footerHeight = 35;
                  const tableHeight = headerHeight + columnHeight + footerHeight;
                  
                  minX = Math.min(minX, table.position.x);
                  minY = Math.min(minY, table.position.y);
                  maxX = Math.max(maxX, table.position.x + tableWidth);
                  maxY = Math.max(maxY, table.position.y + tableHeight);
                });
                
                // Add padding
                minX = Math.max(0, minX - padding);
                minY = Math.max(0, minY - padding);
                maxX = maxX + padding;
                maxY = maxY + padding;
              } else {
                // Default size for empty schemas
                minX = 50;
                minY = 0;
                maxX = 1450;
                maxY = 400;
              }
              
              return {
                schema,
                minX,
                minY,
                maxX,
                maxY,
                width: maxX - minX,
                height: maxY - minY
              };
            });
            
            // Second pass: stack schemas vertically if they would overlap
            schemaBoxes.forEach((box, index) => {
              if (index > 0) {
                const prevBox = schemaBoxes[index - 1];
                // If this schema's tables start before previous schema ends, stack it
                if (box.minY < prevBox.maxY + 40) {
                  const offset = (prevBox.maxY + 40) - box.minY;
                  box.minY += offset;
                  box.maxY += offset;
                }
              }
            });
            
            return schemaBoxes.map((box) => {
              return (
                <div 
                  key={box.schema.id}
                  className="absolute border-2 border-dashed border-gray-400 rounded-lg canvas-draggable" 
                  style={{ 
                    left: `${box.minX}px`,
                    top: `${box.minY}px`,
                    width: `${box.width}px`,
                    height: `${box.height}px`,
                    minWidth: '1400px',
                    minHeight: '400px'
                  }}
                >
                  <div className="absolute left-3 top-3 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded shadow-sm z-10">
                    {box.schema.name}
                  </div>
                </div>
              );
            });
          })()}

          {/* SVG for relations */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
              </marker>
            </defs>
            {renderRelations()}
          </svg>

          {/* Areas - Render behind tables to group them visually */}
          {areas.map((area) => (
            <div
              key={area.id}
              style={{
                position: 'absolute',
                left: `${area.position.x}px`,
                top: `${area.position.y}px`,
                width: `${area.size.width}px`,
                height: `${area.size.height}px`,
                userSelect: 'none',
                zIndex: 0
              }}
              className={`transition-all ${
                draggingArea === area.id 
                  ? 'cursor-grabbing' 
                  : 'cursor-grab hover:opacity-90'
              }`}
              onMouseDown={(e) => handleAreaMouseDown(e, area.id)}
            >
              {/* Area background with semi-transparent color */}
              <div 
                className="absolute inset-0 rounded-xl border-2 border-dashed transition-all"
                style={{
                  backgroundColor: area.color,
                  opacity: 0.15,
                  borderColor: area.color.replace('0.15', '0.5')
                }}
              />
              
              {/* Area border glow effect */}
              <div 
                className="absolute inset-0 rounded-xl border-2 pointer-events-none"
                style={{
                  borderColor: area.color,
                  opacity: 0.4,
                  boxShadow: `inset 0 0 20px ${area.color}`
                }}
              />
              
              {/* Area name label */}
              <div
                className="absolute left-3 top-3 px-3 py-1.5 rounded-lg shadow-lg font-semibold text-xs flex items-center gap-2 pointer-events-none"
                style={{
                  backgroundColor: area.color,
                  color: 'white',
                  opacity: 0.95
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                <span>{area.name}</span>
                {area.tableIds && area.tableIds.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px]">
                    {area.tableIds.length}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Notes - Render on top of everything */}
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                position: 'absolute',
                left: `${note.position.x}px`,
                top: `${note.position.y}px`,
                width: '200px',
                minHeight: '150px',
                userSelect: 'none',
                zIndex: 100
              }}
              className={`bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg shadow-lg border-2 transition-all ${
                draggingNote === note.id 
                  ? 'border-yellow-400 shadow-2xl' 
                  : 'border-yellow-300 hover:border-yellow-400 hover:shadow-xl'
              }`}
            >
              <div
                className="px-3 py-2 bg-yellow-300 text-yellow-800 text-xs font-bold rounded-t-lg flex items-center justify-between"
                style={{
                  cursor: draggingNote === note.id ? 'grabbing' : (editingNote === note.id ? 'default' : 'grab')
                }}
                onMouseDown={(e) => {
                  // Only allow dragging from the header, not from buttons
                  if (editingNote !== note.id && (e.target as HTMLElement).tagName !== 'BUTTON' && !(e.target as HTMLElement).closest('button')) {
                    handleNoteMouseDown(e, note.id);
                  }
                }}
              >
                <span>📝 NOTE</span>
                <div className="flex items-center gap-1">
                  {editingNote === note.id ? (
                    <button
                      onClick={() => setEditingNote(null)}
                      className="p-0.5 hover:bg-yellow-400 rounded transition-colors"
                      title="Minimize"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingNote(note.id)}
                      className="p-0.5 hover:bg-yellow-400 rounded transition-colors"
                      title="Edit"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-0.5 hover:bg-red-400 rounded transition-colors"
                    title="Delete"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-3">
                {editingNote === note.id ? (
                  <textarea
                    value={note.content}
                    onChange={(e) => handleUpdateNoteContent(note.id, e.target.value)}
                    placeholder="Type a note..."
                    className="w-full h-32 bg-transparent text-gray-800 text-sm resize-none focus:outline-none placeholder-gray-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div 
                    className="text-sm text-gray-800 whitespace-pre-wrap min-h-[80px] cursor-pointer"
                    onClick={() => setEditingNote(note.id)}
                  >
                    {note.content || <span className="text-gray-500 italic">Click to edit...</span>}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Tables - Render above areas but below notes */}
          {tables.map((table) => {
            // Filter by search query
            if (canvasSearchQuery && !table.name.toLowerCase().includes(canvasSearchQuery.toLowerCase())) {
              return null;
            }

            // Filter by visibility
            if (table.visible === false) {
              return null;
            }

            return (
              <div
                key={table.name}
                style={{
                  position: 'absolute',
                  left: `${table.position.x}px`,
                  top: `${table.position.y}px`,
                  width: '260px',
                  userSelect: 'none',
                  zIndex: draggingTable === table.name ? 50 : 10
                }}
                className={`bg-white rounded-lg shadow-md border-2 ${
                  selectedTable === table.name ? 'border-teal-400 ring-2 ring-teal-200' : 'border-gray-200'
                } ${
                  draggingTable === table.name ? 'shadow-2xl' : 'transition-all hover:shadow-lg'
                }`}
              >
                {/* Table Header */}
                <div 
                  className={`px-3 py-2 bg-gradient-to-r ${getTableColor(table.name)} text-white rounded-t-lg flex items-center justify-between group ${
                    renamingTable === table.name || editingTable === table.name ? '' : 'cursor-grab active:cursor-grabbing'
                  } hover:opacity-95 transition-opacity`}
                  onMouseDown={(e) => {
                    if (renamingTable !== table.name && editingTable !== table.name) {
                      handleTableMouseDown(e, table.name);
                    }
                  }}
                  title={renamingTable === table.name || editingTable === table.name ? "" : "Drag to move table"}
                >
                  {renamingTable === table.name ? (
                    <>
                      <div className="flex items-center gap-2 flex-1">
                        <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                        <input
                          ref={renameInputRef}
                          type="text"
                          value={newTableName}
                          onChange={(e) => setNewTableName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameTable();
                            if (e.key === 'Escape') handleCancelRename();
                          }}
                          className="flex-1 text-sm font-semibold bg-white/20 text-white placeholder-white/50 border border-white/30 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-white/50"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameTable();
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-green-500/30 rounded transition-colors"
                          title="Save"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelRename();
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-red-500/30 rounded transition-colors"
                          title="Cancel"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                        <span className="font-semibold text-sm select-none">{table.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnterEditMode(table.name);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Edit table"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTable(table.name);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Delete table"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Table Columns */}
                <div 
                  className="bg-white max-h-64 overflow-y-auto scrollbar-hide"
                  onClick={() => setSelectedTable(table.name)}
                >
                  {editingTable === table.name ? (
                    // EDIT MODE - Show editable fields
                    editingColumns.map((col, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 transition-colors group/row ${
                          idx === editingColumns.length - 1 ? '' : 'border-b border-gray-100'
                        }`}
                      >
                        {/* PK/FK Icon */}
                        <div className="flex-shrink-0 w-3.5">
                          {col.pk || col.isFK ? (
                            <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75l.607.607a.5.5 0 00.707-.707l-2-2a.5.5 0 00-.707 0l-2 2a.5.5 0 00.707.707l.607-.607A3.001 3.001 0 0110 2z" />
                            </svg>
                          ) : (
                            <div className="w-3.5">
                              <svg className="w-2.5 h-2.5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="2.5" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Edit icon (visual only in edit mode) */}
                        <div className="flex-shrink-0 w-3">
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>

                        {/* Editable Column name */}
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) => handleColumnFieldChange(idx, 'name', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs ${col.pk ? 'font-semibold text-gray-800' : 'text-gray-700'} truncate flex-1 min-w-0 bg-white border border-blue-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        />

                        {/* Editable Data type */}
                        <select
                          value={col.type}
                          onChange={(e) => handleColumnFieldChange(idx, 'type', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-gray-700 uppercase font-mono flex-shrink-0 bg-white border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="INTEGER">INTEGER</option>
                          <option value="TEXT">TEXT</option>
                          <option value="REAL">REAL</option>
                          <option value="BLOB">BLOB</option>
                          <option value="VARCHAR">VARCHAR</option>
                          <option value="DATE">DATE</option>
                          <option value="DATETIME">DATETIME</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                        </select>

                        {/* Editable Nullable toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColumnFieldChange(idx, 'notnull', col.notnull === 1 ? 0 : 1);
                          }}
                          className={`text-[10px] font-bold flex-shrink-0 w-4 h-4 flex items-center justify-center rounded ${
                            col.notnull === 0 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
                          }`}
                          title={col.notnull === 0 ? 'Nullable' : 'Not Null'}
                        >
                          N
                        </button>

                        {/* More options */}
                        <button className="flex-shrink-0 w-3 transition-opacity">
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    // NORMAL MODE - Show read-only fields
                    table.columns.map((col, idx) => (
                      <div 
                        key={col.name} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 transition-colors group/row ${
                          idx === table.columns.length - 1 ? '' : 'border-b border-gray-100'
                        }`}
                      >
                        {/* PK/FK Icon */}
                        <div className="flex-shrink-0 w-3.5">
                          {col.pk || col.isFK ? (
                            <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75l.607.607a.5.5 0 00.707-.707l-2-2a.5.5 0 00-.707 0l-2 2a.5.5 0 00.707.707l.607-.607A3.001 3.001 0 0110 2z" />
                            </svg>
                          ) : (
                            <div className="w-3.5 opacity-0 group-hover/row:opacity-100">
                              <svg className="w-2.5 h-2.5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="2.5" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Edit icon */}
                        <button className="flex-shrink-0 w-3 opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Column name */}
                        <span className={`text-xs ${col.pk ? 'font-semibold text-gray-800' : 'text-gray-700'} truncate flex-1 min-w-0`}>
                          {col.name}
                        </span>

                        {/* Data type */}
                        <span className="text-[10px] text-gray-500 uppercase font-mono flex-shrink-0">
                          {col.type}
                        </span>

                        {/* Nullable */}
                        {col.notnull === 0 && (
                          <span className="text-[10px] font-bold text-orange-500 flex-shrink-0">
                            N
                          </span>
                        )}

                        {/* More options */}
                        <button className="flex-shrink-0 w-3 opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Table Footer */}
                {editingTable === table.name ? (
                  // EDIT MODE - Show Save/Cancel buttons
                  <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-lg border-t border-blue-200 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveTableEdits();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save All Changes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelTableEdit();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                ) : (
                  // NORMAL MODE - Show field count
                  <div className="px-3 py-1.5 bg-gray-50 text-[10px] text-gray-500 rounded-b-lg border-t border-gray-200">
                    {table.columns.length} Field{table.columns.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>

          {/* Minimap - Fixed position */}
          <div className="absolute bottom-28 right-10 w-36 h-28 bg-white/95 border-2 border-gray-300 rounded-lg shadow-xl overflow-hidden backdrop-blur-md z-40">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50"></div>
            <div className="relative w-full h-full p-2">
              {tables.slice(0, 6).map((table, idx) => {
                const row = Math.floor(idx / 3);
                const col = idx % 3;
                return (
                  <div
                    key={table.name}
                    className={`absolute rounded ${DOT_COLORS[idx % DOT_COLORS.length]} opacity-60`}
                    style={{
                      left: `${15 + col * 35}%`,
                      top: `${20 + row * 40}%`,
                      width: '20px',
                      height: '16px'
                    }}
                  />
                );
              })}
            </div>
          </div>

        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2.5 flex items-center justify-center">
          <div className="flex items-center gap-3 max-w-5xl w-full">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Filter tables..."
                value={canvasSearchQuery}
                onChange={(e) => setCanvasSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`p-1.5 rounded transition-colors ${showFiltersPanel ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Filters Panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>

              <button 
                onClick={autoArrangeTables}
                className="p-1.5 hover:bg-gray-100 rounded" 
                title="Auto-arrange Tables Vertically"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>

              <div className="w-px h-5 bg-gray-300 mx-1"></div>

              {/* Undo/Redo Buttons */}
              <button 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className={`p-1.5 rounded transition-colors ${historyIndex <= 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Undo (Ctrl + Z)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>

              <button 
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className={`p-1.5 rounded transition-colors ${historyIndex >= history.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Redo (Ctrl + Y)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </button>

              <div className="w-px h-5 bg-gray-300 mx-1"></div>

              <button 
                onClick={() => setZoom(Math.max(zoom - 10, 10))}
                className="p-1.5 hover:bg-gray-100 rounded"
                title="Zoom Out (Ctrl + -)"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              <span className="text-xs font-medium text-gray-700 min-w-[2.5rem] text-center">{zoom}%</span>

              <button 
                onClick={() => setZoom(Math.min(zoom + 10, 200))}
                className="p-1.5 hover:bg-gray-100 rounded"
                title="Zoom In (Ctrl + +)"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <button 
                onClick={() => setZoom(50)}
                className="px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-100 rounded"
                title="Reset Zoom (50%)"
              >
                Reset
              </button>

              <div className="w-px h-5 bg-gray-300 mx-1"></div>

              <button 
                onClick={toggleFullscreen}
                className="p-1.5 hover:bg-gray-100 rounded"
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen (F11)"}
              >
                {isFullscreen ? (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelateDBView;
