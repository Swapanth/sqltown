import React, { useState, useEffect } from "react";
import { initializeDatabase, getTables, getTableSchema } from "../playground/compiler";

interface QueryTemplate {
  category: string;
  name: string;
  description: string;
  query: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface TableInfo {
  name: string;
  columns: any[];
  pkColumns: string[];
  fkColumns: { column: string; refTable?: string }[];
  numericColumns: string[];
  textColumns: string[];
  dateColumns: string[];
}

const QueryLibrary: React.FC<{ onView?: () => void; dbId?: string }> = ({ onView, dbId }) => {
  const isFullscreen = !onView;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copied, setCopied] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedQueries, setGeneratedQueries] = useState<QueryTemplate[]>([]);

  // Load database and generate queries
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 10;
    
    const loadAndGenerateQueries = async () => {
      try {
        console.log('📚 QueryLibrary: Starting to load database for dbId:', dbId);
        if (isMounted) setIsLoading(true);
        
        // Initialize database
        console.log('⏳ QueryLibrary: Waiting for database initialization...');
        await initializeDatabase(dbId);
        
        // Retry logic to wait for tables
        let tableList = null;
        while (isMounted && retryCount < maxRetries) {
          console.log(`✓ QueryLibrary: Attempt ${retryCount + 1} - Fetching tables...`);
          tableList = await getTables(dbId);
          
          if (tableList && tableList.length > 0) {
            console.log('✅ QueryLibrary: Loaded tables:', tableList);
            break;
          }
          
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`⏳ QueryLibrary: No tables found, retrying in 500ms... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (!isMounted) return;
        
        if (!tableList || tableList.length === 0) {
          console.log('⚠️ QueryLibrary: No tables found after retries');
          if (isMounted) setIsLoading(false);
          return;
        }

        // Analyze tables
        const tableInfoList: TableInfo[] = [];
        for (const tableName of tableList) {
          const schema = getTableSchema(tableName, dbId);
          
          const pkColumns = schema.filter((col: any) => col[5] === 1).map((col: any) => col[1]);
          const fkColumns = schema.filter((col: any) => col[6] === 1).map((col: any) => ({
            column: col[1],
            refTable: col[7] // FK reference table if available
          }));
          
          const numericColumns = schema
            .filter((col: any) => ['INTEGER', 'INT', 'REAL', 'DECIMAL', 'NUMERIC', 'FLOAT'].includes(col[2].toUpperCase()))
            .map((col: any) => col[1]);
          
          const textColumns = schema
            .filter((col: any) => ['TEXT', 'VARCHAR', 'CHAR', 'STRING'].includes(col[2].toUpperCase()))
            .map((col: any) => col[1]);
            
          const dateColumns = schema
            .filter((col: any) => ['DATE', 'DATETIME', 'TIMESTAMP', 'TIME'].includes(col[2].toUpperCase()))
            .map((col: any) => col[1]);
          
          tableInfoList.push({
            name: tableName,
            columns: schema,
            pkColumns,
            fkColumns,
            numericColumns,
            textColumns,
            dateColumns
          });
        }
        
        if (isMounted) {
          const queries = generateQueriesFromSchema(tableInfoList);
          setGeneratedQueries(queries);
          setIsLoading(false);
          console.log('✅ QueryLibrary: Generated', queries.length, 'queries');
        }
      } catch (err) {
        console.error("❌ QueryLibrary: Failed to load:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadAndGenerateQueries();
    
    return () => {
      isMounted = false;
    };
  }, [dbId]);

  // Generate queries based on actual database schema
  const generateQueriesFromSchema = (tableInfoList: TableInfo[]): QueryTemplate[] => {
    const queries: QueryTemplate[] = [];
    
    if (tableInfoList.length === 0) return queries;
    
    // Get first few tables for examples
    const mainTable = tableInfoList[0];
    const secondTable = tableInfoList.length > 1 ? tableInfoList[1] : null;
    
    // 1. Basic SELECT
    queries.push({
      category: "Basic",
      name: `Select from ${mainTable.name}`,
      description: `Retrieve all records from ${mainTable.name}`,
      query: `SELECT * FROM ${mainTable.name} LIMIT 10;`,
      difficulty: "Easy"
    });
    
    // 2. SELECT specific columns
    if (mainTable.columns.length >= 3) {
      const cols = mainTable.columns.slice(0, 3).map((col: any) => col[1]).join(', ');
      queries.push({
        category: "Basic",
        name: `Select Specific Columns`,
        description: `Retrieve specific columns from ${mainTable.name}`,
        query: `SELECT ${cols}\nFROM ${mainTable.name}\nLIMIT 10;`,
        difficulty: "Easy"
      });
    }
    
    // 3. WHERE with text column
    if (mainTable.textColumns.length > 0) {
      const col = mainTable.textColumns[0];
      queries.push({
        category: "Basic",
        name: `Filter with WHERE`,
        description: `Filter ${mainTable.name} by ${col}`,
        query: `SELECT * FROM ${mainTable.name}\nWHERE ${col} LIKE '%search%'\nLIMIT 10;`,
        difficulty: "Easy"
      });
    }
    
    // 4. WHERE with numeric column
    if (mainTable.numericColumns.length > 0) {
      const col = mainTable.numericColumns[0];
      queries.push({
        category: "Basic",
        name: `Numeric Filter`,
        description: `Filter ${mainTable.name} by ${col}`,
        query: `SELECT * FROM ${mainTable.name}\nWHERE ${col} > 0\nLIMIT 10;`,
        difficulty: "Easy"
      });
    }
    
    // 5. COUNT
    queries.push({
      category: "Aggregation",
      name: `Count Records in ${mainTable.name}`,
      description: `Count total records in ${mainTable.name}`,
      query: `SELECT COUNT(*) as total\nFROM ${mainTable.name};`,
      difficulty: "Easy"
    });
    
    // 6. GROUP BY with text column
    if (mainTable.textColumns.length > 0) {
      const col = mainTable.textColumns[0];
      queries.push({
        category: "Aggregation",
        name: `Group By ${col}`,
        description: `Count records grouped by ${col}`,
        query: `SELECT ${col}, COUNT(*) as count\nFROM ${mainTable.name}\nGROUP BY ${col}\nORDER BY count DESC;`,
        difficulty: "Medium"
      });
    }
    
    // 7. AVG on numeric column
    if (mainTable.numericColumns.length > 0) {
      const col = mainTable.numericColumns[0];
      queries.push({
        category: "Aggregation",
        name: `Average ${col}`,
        description: `Calculate average ${col} in ${mainTable.name}`,
        query: `SELECT AVG(${col}) as avg_${col}\nFROM ${mainTable.name};`,
        difficulty: "Easy"
      });
    }
    
    // 8. SUM on numeric column
    if (mainTable.numericColumns.length > 0) {
      const col = mainTable.numericColumns[0];
      queries.push({
        category: "Aggregation",
        name: `Sum ${col}`,
        description: `Calculate total ${col} in ${mainTable.name}`,
        query: `SELECT SUM(${col}) as total_${col}\nFROM ${mainTable.name};`,
        difficulty: "Easy"
      });
    }
    
    // 9. MIN/MAX
    if (mainTable.numericColumns.length > 0) {
      const col = mainTable.numericColumns[0];
      queries.push({
        category: "Aggregation",
        name: `Min/Max ${col}`,
        description: `Find min and max ${col}`,
        query: `SELECT MIN(${col}) as min_${col}, MAX(${col}) as max_${col}\nFROM ${mainTable.name};`,
        difficulty: "Easy"
      });
    }
    
    // 10. ORDER BY
    if (mainTable.columns.length > 0) {
      const col = mainTable.columns[0][1];
      queries.push({
        category: "Sorting",
        name: `Order By ${col}`,
        description: `Sort ${mainTable.name} by ${col}`,
        query: `SELECT * FROM ${mainTable.name}\nORDER BY ${col} DESC\nLIMIT 10;`,
        difficulty: "Easy"
      });
    }
    
    // 11. ORDER BY multiple columns
    if (mainTable.columns.length >= 2) {
      const col1 = mainTable.columns[0][1];
      const col2 = mainTable.columns[1][1];
      queries.push({
        category: "Sorting",
        name: `Multi-Column Sort`,
        description: `Sort by ${col1} and ${col2}`,
        query: `SELECT * FROM ${mainTable.name}\nORDER BY ${col1} ASC, ${col2} DESC\nLIMIT 10;`,
        difficulty: "Medium"
      });
    }
    
    // 12. JOIN if FK exists
    if (mainTable.fkColumns.length > 0 && secondTable) {
      const fk = mainTable.fkColumns[0];
      const refTable = fk.refTable || secondTable.name;
      
      queries.push({
        category: "Join",
        name: `Join ${mainTable.name} with ${refTable}`,
        description: `Inner join on ${fk.column}`,
        query: `SELECT a.*, b.*\nFROM ${mainTable.name} a\nJOIN ${refTable} b ON a.${fk.column} = b.${secondTable.pkColumns[0] || 'id'}\nLIMIT 10;`,
        difficulty: "Medium"
      });
    } else if (secondTable) {
      // Generic join if no FK info
      queries.push({
        category: "Join",
        name: `Join ${mainTable.name} with ${secondTable.name}`,
        description: `Join two tables`,
        query: `SELECT a.*, b.*\nFROM ${mainTable.name} a\nJOIN ${secondTable.name} b ON a.${mainTable.pkColumns[0] || 'id'} = b.${mainTable.pkColumns[0] || 'id'}\nLIMIT 10;`,
        difficulty: "Medium"
      });
    }
    
    // 13. DISTINCT
    if (mainTable.textColumns.length > 0) {
      const col = mainTable.textColumns[0];
      queries.push({
        category: "Basic",
        name: `Distinct ${col}`,
        description: `Get unique values of ${col}`,
        query: `SELECT DISTINCT ${col}\nFROM ${mainTable.name};`,
        difficulty: "Easy"
      });
    }
    
    // 14. Subquery
    if (mainTable.numericColumns.length > 0) {
      const col = mainTable.numericColumns[0];
      queries.push({
        category: "Subquery",
        name: `Above Average Subquery`,
        description: `Find records with ${col} above average`,
        query: `SELECT * FROM ${mainTable.name}\nWHERE ${col} > (\n  SELECT AVG(${col}) FROM ${mainTable.name}\n)\nLIMIT 10;`,
        difficulty: "Hard"
      });
    }
    
    // 15. HAVING clause
    if (mainTable.textColumns.length > 0 && mainTable.numericColumns.length > 0) {
      const groupCol = mainTable.textColumns[0];
      const aggCol = mainTable.numericColumns[0];
      queries.push({
        category: "Advanced",
        name: `GROUP BY with HAVING`,
        description: `Group by ${groupCol} and filter groups`,
        query: `SELECT ${groupCol}, COUNT(*) as count, AVG(${aggCol}) as avg_value\nFROM ${mainTable.name}\nGROUP BY ${groupCol}\nHAVING count > 1\nORDER BY count DESC;`,
        difficulty: "Hard"
      });
    }
    
    // 16. Date filtering if date column exists
    if (mainTable.dateColumns.length > 0) {
      const col = mainTable.dateColumns[0];
      queries.push({
        category: "Basic",
        name: `Date Range Filter`,
        description: `Filter by ${col} date range`,
        query: `SELECT * FROM ${mainTable.name}\nWHERE ${col} >= '2024-01-01'\nLIMIT 10;`,
        difficulty: "Easy"
      });
    }
    
    // 17. CASE statement
    if (mainTable.numericColumns.length > 0) {
      const col = mainTable.numericColumns[0];
      queries.push({
        category: "Advanced",
        name: `CASE Statement`,
        description: `Categorize ${col} values`,
        query: `SELECT *,\n  CASE\n    WHEN ${col} > 100 THEN 'High'\n    WHEN ${col} > 50 THEN 'Medium'\n    ELSE 'Low'\n  END as category\nFROM ${mainTable.name}\nLIMIT 10;`,
        difficulty: "Medium"
      });
    }
    
    // 18. Multiple WHERE conditions
    if (mainTable.columns.length >= 2) {
      const col1 = mainTable.columns[0][1];
      const col2 = mainTable.columns[1][1];
      queries.push({
        category: "Basic",
        name: `Multiple Conditions`,
        description: `Filter with AND/OR conditions`,
        query: `SELECT * FROM ${mainTable.name}\nWHERE ${col1} IS NOT NULL\n  AND ${col2} IS NOT NULL\nLIMIT 10;`,
        difficulty: "Easy"
      });
    }
    
    return queries;
  };

  const queryTemplates: QueryTemplate[] = [
    {
      category: "Basic",
      name: "Select All Records",
      description: "Retrieve all columns from a table",
      query: "SELECT * FROM Customers LIMIT 10;",
      difficulty: "Easy",
    },
    {
      category: "Basic",
      name: "Filter with WHERE",
      description: "Filter records based on conditions",
      query: "SELECT * FROM Restaurants WHERE rating > 4.0;",
      difficulty: "Easy",
    },
    {
      category: "Aggregation",
      name: "Count Records",
      description: "Count total number of records",
      query: "SELECT COUNT(*) as total FROM Orders;",
      difficulty: "Easy",
    },
    {
      category: "Aggregation",
      name: "Group By with Count",
      description: "Count records grouped by category",
      query: "SELECT category, COUNT(*) as count\nFROM MenuItems\nGROUP BY category;",
      difficulty: "Medium",
    },
    {
      category: "Aggregation",
      name: "Average Calculation",
      description: "Calculate average rating",
      query: "SELECT AVG(rating) as avg_rating FROM Restaurants;",
      difficulty: "Easy",
    },
    {
      category: "Join",
      name: "Inner Join Two Tables",
      description: "Join orders with customers",
      query: "SELECT o.*, c.first_name, c.last_name\nFROM Orders o\nJOIN Customers c ON o.customer_id = c.customer_id;",
      difficulty: "Medium",
    },
    {
      category: "Join",
      name: "Multiple Joins",
      description: "Join orders with customers and restaurants",
      query: "SELECT o.order_id, c.first_name, r.name as restaurant\nFROM Orders o\nJOIN Customers c ON o.customer_id = c.customer_id\nJOIN Restaurants r ON o.restaurant_id = r.restaurant_id;",
      difficulty: "Hard",
    },
    {
      category: "Subquery",
      name: "Subquery in WHERE",
      description: "Find customers with orders above average",
      query: "SELECT * FROM Customers\nWHERE customer_id IN (\n  SELECT customer_id FROM Orders\n  WHERE total_amount > (SELECT AVG(total_amount) FROM Orders)\n);",
      difficulty: "Hard",
    },
    {
      category: "Sorting",
      name: "Order By Single Column",
      description: "Sort results by rating",
      query: "SELECT * FROM Restaurants\nORDER BY rating DESC;",
      difficulty: "Easy",
    },
    {
      category: "Sorting",
      name: "Order By Multiple Columns",
      description: "Sort by category and price",
      query: "SELECT * FROM MenuItems\nORDER BY category ASC, price DESC;",
      difficulty: "Medium",
    },
    {
      category: "Advanced",
      name: "Window Function",
      description: "Rank restaurants by rating",
      query: "SELECT name, rating,\n  RANK() OVER (ORDER BY rating DESC) as rank\nFROM Restaurants;",
      difficulty: "Hard",
    },
    {
      category: "Advanced",
      name: "Common Table Expression",
      description: "Use CTE for complex queries",
      query: "WITH HighValueOrders AS (\n  SELECT * FROM Orders WHERE total_amount > 100\n)\nSELECT * FROM HighValueOrders\nORDER BY total_amount DESC;",
      difficulty: "Hard",
    },
  ];

  // Use generated queries in fullscreen, static templates in compact view
  const activeQueries = isFullscreen && generatedQueries.length > 0 ? generatedQueries : queryTemplates;
  
  const categories = ["All", ...Array.from(new Set(activeQueries.map((q) => q.category)))];

  const filteredQueries =
    selectedCategory === "All"
      ? activeQueries
      : activeQueries.filter((q) => q.category === selectedCategory);

  const copyQuery = (query: string, index: number) => {
    navigator.clipboard.writeText(query);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-xs text-gray-800">Query Library</h3>
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

      {/* Loading State for Fullscreen */}
      {isLoading && isFullscreen ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-3"></div>
          <p className="text-sm text-gray-600">Generating queries from database...</p>
        </div>
      ) : (
        <>
          {/* Category Filter - Only in Fullscreen */}
          {isFullscreen && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat} ({cat === "All" ? activeQueries.length : activeQueries.filter(q => q.category === cat).length})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Query Templates */}
          <div className={`flex-1 overflow-y-auto ${isFullscreen ? 'space-y-3' : 'space-y-1.5'}`}>
            {(isFullscreen ? filteredQueries : filteredQueries.slice(0, 2)).map((template, i) => (
              <div key={i} className={`border border-gray-200 rounded-lg ${isFullscreen ? 'p-3' : 'p-1.5'} hover:border-orange-300 transition-colors bg-white`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`${isFullscreen ? 'text-sm' : 'text-xs'} font-semibold text-gray-800 ${!isFullscreen && 'truncate'}`}>
                        {template.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${getDifficultyColor(
                          template.difficulty
                        )}`}
                      >
                        {template.difficulty}
                      </span>
                    </div>
                    <p className={`text-xs text-gray-600 ${!isFullscreen && 'line-clamp-1'}`}>
                      {template.description}
                    </p>
                  </div>
                  <button
                    onClick={() => copyQuery(template.query, i)}
                    className={`text-xs text-orange-600 hover:text-orange-700 font-medium ml-2 transition-colors flex-shrink-0 ${isFullscreen ? 'px-3' : 'px-2'} py-1 rounded hover:bg-orange-50`}
                  >
                    {copied === i ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <pre className={`text-xs bg-gray-900 text-green-400 ${isFullscreen ? 'p-3' : 'p-1.5'} rounded overflow-x-auto font-mono ${!isFullscreen && 'max-h-12'}`}>
                  {isFullscreen ? template.query : template.query.split('\n')[0] + '...'}
                </pre>
              </div>
            ))}
          </div>

          {!isFullscreen && (
            <p className="text-xs text-gray-500 mt-2">
              Click View Full to see {activeQueries.length} database-specific queries
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default QueryLibrary;
