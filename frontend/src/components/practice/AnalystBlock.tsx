import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { initializeDatabase, getTables, getTableSchema, executeQuery } from "../playground/compiler";

const COLORS = ["#8b5cf6", "#22c55e", "#eab308", "#ef4444", "#3b82f6", "#f97316", "#06b6d4", "#ec4899"];

interface TableStats {
  name: string;
  rowCount: number;
  columnCount: number;
  size: number;
}

interface ColumnTypeStats {
  type: string;
  count: number;
}

interface DataQuality {
  table: string;
  completeness: number;
  nullCount: number;
  totalCells: number;
}

interface RelationshipStats {
  name: string;
  value: number;
}

const AnalystBlock: React.FC<{ onView?: () => void; dbId?: string }> = ({ onView, dbId }) => {
  const isFullscreen = !onView;
  const [isLoading, setIsLoading] = useState(true);
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [columnTypeStats, setColumnTypeStats] = useState<ColumnTypeStats[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality[]>([]);
  const [relationshipStats, setRelationshipStats] = useState<RelationshipStats[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [totalTables, setTotalTables] = useState(0);
  const [avgCompleteness, setAvgCompleteness] = useState(0);

  useEffect(() => {
    const analyzeDatabase = async () => {
      try {
        setIsLoading(true);
        await initializeDatabase(dbId);
        const tables = await getTables(dbId);
        
        if (!tables || tables.length === 0) {
          setIsLoading(false);
          return;
        }

        setTotalTables(tables.length);

        // Analyze each table
        const stats: TableStats[] = [];
        const typeMap: Map<string, number> = new Map();
        const qualityData: DataQuality[] = [];
        const relationshipMap: Map<string, number> = new Map();
        let totalRowCount = 0;

        for (const tableName of tables) {
          // Get row count by selecting all rows
          const countResult = await executeQuery(`SELECT * FROM ${tableName}`, dbId);
          
          // FIX: Extract actual data from nested structure
          // Data structure is: [{columns: [...], values: [...]}]
          // We need the values array which contains the actual rows
          let allRows: any[] = [];
          
          if (countResult.data && Array.isArray(countResult.data) && countResult.data.length > 0) {
            const firstItem = countResult.data[0];
            
            // Check if it has the nested structure with 'values'
            if (firstItem && typeof firstItem === 'object' && 'values' in firstItem && Array.isArray(firstItem.values)) {
              // Get the values array (actual row data)
              const values = firstItem.values;
              const columns = firstItem.columns || [];
              
              // Convert values array to array of objects with column names as keys
              allRows = values.map((row: any[]) => {
                const rowObj: any = {};
                columns.forEach((col: string, index: number) => {
                  rowObj[col] = row[index];
                });
                return rowObj;
              });
              
              console.log(`📦 ${tableName}: Extracted ${allRows.length} rows from nested structure`);
            } else {
              // Fallback: assume data is already in correct format
              allRows = countResult.data;
            }
          }
          
          const rowCount = allRows.length || 0;
          totalRowCount += rowCount;

          // Get schema
          const schema = getTableSchema(tableName, dbId);
          const columnCount = schema.length;

          stats.push({
            name: tableName,
            rowCount,
            columnCount,
            size: rowCount * columnCount,
          });

          // Analyze column types
          schema.forEach((col: any) => {
            const type = col[2] || 'UNKNOWN';
            typeMap.set(type, (typeMap.get(type) || 0) + 1);

            // Track relationships
            if (col[6] === 1) { // isFK
              relationshipMap.set('Foreign Keys', (relationshipMap.get('Foreign Keys') || 0) + 1);
            }
            if (col[5] === 1) { // isPK
              relationshipMap.set('Primary Keys', (relationshipMap.get('Primary Keys') || 0) + 1);
            }
          });

          // Analyze data quality (null counts) - reuse already fetched data
          if (rowCount > 0 && allRows.length > 0) {
            let nullCount = 0;
            let totalCells = rowCount * columnCount;

            // Count nulls across all columns using the data we already have
            schema.forEach((col: any) => {
              const colName = col[1];
              try {
                // Count ONLY actual nulls (not empty strings, those are valid data)
                const nullsInColumn = allRows.filter((row: any) => {
                  const value = row[colName];
                  // Only count null and undefined, NOT empty strings or 0
                  return value === null || value === undefined;
                }).length;
                nullCount += nullsInColumn;
                
                if (nullsInColumn > 0) {
                  console.log(`  └─ ${colName}: ${nullsInColumn} nulls`);
                }
              } catch (err) {
                console.error(`Error checking nulls for ${tableName}.${colName}:`, err);
              }
            });

            const completeness = totalCells > 0 ? ((totalCells - nullCount) / totalCells) * 100 : 100;
            
            console.log(`📊 ${tableName}: ${rowCount} rows × ${columnCount} cols = ${totalCells} cells, ${nullCount} nulls → ${Math.round(completeness)}% complete`);
            
            qualityData.push({
              table: tableName,
              completeness: Math.round(completeness),
              nullCount,
              totalCells,
            });
          }
        }

        console.log('💾 Quality Data Summary:', qualityData);

        setTotalRows(totalRowCount);
        setTableStats(stats);
        
        // Convert type map to array
        const typeStats: ColumnTypeStats[] = Array.from(typeMap.entries()).map(([type, count]) => ({
          type,
          count,
        }));
        setColumnTypeStats(typeStats);
        
        setDataQuality(qualityData);
        
        // Calculate average completeness
        const avgComp = qualityData.length > 0
          ? qualityData.reduce((sum, d) => sum + d.completeness, 0) / qualityData.length
          : 100;
        setAvgCompleteness(Math.round(avgComp));

        // Convert relationship map to array
        const relStats: RelationshipStats[] = Array.from(relationshipMap.entries()).map(([name, value]) => ({
          name,
          value,
        }));
        setRelationshipStats(relStats);

        setIsLoading(false);
      } catch (error) {
        console.error('Error analyzing database:', error);
        setIsLoading(false);
      }
    };

    if (dbId) {
      analyzeDatabase();
    }
  }, [dbId]);

  if (!isFullscreen) {
    return (
      <div className="h-full flex flex-col p-3 bg-gradient-to-br from-purple-50/50 to-blue-50/50 backdrop-blur-sm rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Data Analyst</h3>
          </div>
          {onView && (
            <button 
              onClick={onView} 
              className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-all hover:scale-110"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-purple-300 opacity-20"></div>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-2 text-xs overflow-y-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span className="text-gray-700">{totalTables} tables analyzed</span>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-gray-700">{totalRows.toLocaleString()} total rows</span>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                <span className="text-gray-700">{relationshipStats.reduce((sum, r) => sum + r.value, 0)} relationships</span>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-gray-700">{columnTypeStats.length} data types</span>
              </div>
            </div>
            <div className="mt-3 bg-gradient-to-br from-orange-50 to-orange-100/80 backdrop-blur-sm rounded-xl p-3 border border-orange-200/50 shadow-sm">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {avgCompleteness}%
              </div>
              <div className="text-xs text-orange-700 mt-1">Data Completeness</div>
              <div className="mt-2 h-1.5 bg-orange-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${avgCompleteness}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="text-center bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-purple-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-purple-300 opacity-20 mx-auto"></div>
          </div>
          <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Analyzing database...
          </p>
          <p className="text-xs text-gray-500 mt-2">Processing tables and relationships</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      {/* Database Overview Stats - Moved to top for better UX */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-xs text-purple-600 font-medium">Total Tables</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
            {totalTables}
          </div>
        </div>
        
        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="text-xs text-green-600 font-medium">Total Rows</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            {totalRows.toLocaleString()}
          </div>
        </div>
        
        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="text-xs text-blue-600 font-medium">Total Columns</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            {columnTypeStats.reduce((sum, t) => sum + t.count, 0)}
          </div>
        </div>
        
        <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs text-orange-600 font-medium">Completeness</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
            {avgCompleteness}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Table Sizes - Row Count */}
        <div className="col-span-2 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Table Sizes (Row Count)
            </h3>
          </div>
          <div className="h-64 bg-white/50 rounded-xl p-2">
            {tableStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tableStats}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="rowCount" fill="url(#colorGradient)" name="Rows" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No table data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column Type Distribution */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Column Types
            </h3>
          </div>
          <div className="h-64 bg-white/50 rounded-xl p-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={columnTypeStats} 
                  dataKey="count" 
                  nameKey="type" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80}
                  label={(entry: any) => `${entry.type}: ${entry.count}`}
                  labelLine={{ stroke: '#666', strokeWidth: 1 }}
                >
                  {columnTypeStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Quality - Completeness */}
        <div className="col-span-2 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Data Quality (Completeness)
            </h3>
          </div>
          <div className="h-64 bg-white/50 rounded-xl p-2">
            {dataQuality.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataQuality}>
                  <XAxis dataKey="table" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completeness" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    name="Completeness %" 
                    dot={{ fill: '#22c55e', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No quality data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Database Relationships */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Relationships
            </h3>
          </div>
          <div className="h-64 bg-white/50 rounded-xl p-2 flex items-center justify-center">
            {relationshipStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={relationshipStats} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80}
                    label={(entry: any) => `${entry.name}: ${entry.value}`}
                    labelLine={{ stroke: '#666', strokeWidth: 1 }}
                  >
                    {relationshipStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-gray-500 text-sm">No relationships detected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystBlock;
