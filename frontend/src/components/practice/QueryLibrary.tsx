import React, { useState, useEffect } from "react";
import { usePracticeDatabase } from "../../context/PracticeDatabaseContext";
import { getTables } from "../playground/compiler";

interface QueryTemplate {
  category: string;
  name: string;
  description: string;
  query: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const QueryLibrary: React.FC<{ onView?: () => void }> = ({ onView }) => {
  const isFullscreen = !onView;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copied, setCopied] = useState<number | null>(null);
  const { databaseInfo, isLoading } = usePracticeDatabase();
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const loadTables = async () => {
      try {
        if (isLoading || !databaseInfo) return;
        const tableList = await getTables();
        setTables(tableList);
      } catch (err) {
        console.error("Failed to load tables:", err);
      }
    };
    loadTables();
  }, [databaseInfo, isLoading]);

  // Get first table name for example queries
  const sampleTable = tables.length > 0 ? tables[0] : "TableName";
  const sampleTable2 = tables.length > 1 ? tables[1] : "TableName2";

  const queryTemplates: QueryTemplate[] = [
    {
      category: "Basic",
      name: "Select All Records",
      description: "Retrieve all columns from a table",
      query: `SELECT * FROM ${sampleTable} LIMIT 10;`,
      difficulty: "Easy",
    },
    {
      category: "Basic",
      name: "Filter with WHERE",
      description: "Filter records based on conditions",
      query: `SELECT * FROM ${sampleTable} WHERE id > 10;`,
      difficulty: "Easy",
    },
    {
      category: "Aggregation",
      name: "Count Records",
      description: "Count total number of records",
      query: `SELECT COUNT(*) as total FROM ${sampleTable};`,
      difficulty: "Easy",
    },
    {
      category: "Aggregation",
      name: "Group By with Count",
      description: "Count records grouped by a column",
      query: `SELECT column_name, COUNT(*) as count\nFROM ${sampleTable}\nGROUP BY column_name;`,
      difficulty: "Medium",
    },
    {
      category: "Join",
      name: "Inner Join Two Tables",
      description: "Join two tables",
      query: `SELECT a.*, b.column_name\nFROM ${sampleTable} a\nJOIN ${sampleTable2} b ON a.id = b.foreign_id;`,
      difficulty: "Medium",
    },
    {
      category: "Sorting",
      name: "Order By Column",
      description: "Sort results by a column",
      query: `SELECT * FROM ${sampleTable}\nORDER BY id DESC;`,
      difficulty: "Easy",
    },
    {
      category: "Advanced",
      name: "Limit Results",
      description: "Limit number of returned rows",
      query: `SELECT * FROM ${sampleTable}\nLIMIT 5;`,
      difficulty: "Easy",
    },
  ];

  const categories = ["All", ...Array.from(new Set(queryTemplates.map((q) => q.category)))];

  const filteredQueries =
    selectedCategory === "All"
      ? queryTemplates
      : queryTemplates.filter((q) => q.category === selectedCategory);

  const copyQuery = (query: string, index: number) => {
    navigator.clipboard.writeText(query);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-300 border border-green-400/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30";
      case "Hard":
        return "bg-red-500/20 text-red-300 border border-red-400/30";
      default:
        return "bg-white/10 text-white/60 border border-white/20";
    }
  };

  return (
    <div className={`p-4 rounded h-full flex flex-col overflow-hidden`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`font-semibold ${isFullscreen ? 'text-xl' : 'text-lg'} text-white flex items-center gap-2`}>
          📚 Query Library
        </h2>
        {onView && (
          <button onClick={onView} className="text-orange-400 text-sm hover:text-orange-300 transition-colors font-medium">
            View All →
          </button>
        )}
      </div>

      {/* Category Filter */}
      {isFullscreen && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 border border-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Query Templates */}
      <div className={`space-y-3 flex-1 overflow-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
        {(isFullscreen ? filteredQueries : filteredQueries.slice(0, 3)).map((template, i) => (
          <div key={i} className="border border-white/20 rounded-lg p-3 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:border-orange-400/40 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white">{template.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-lg ${getDifficultyColor(
                      template.difficulty
                    )}`}
                  >
                    {template.difficulty}
                  </span>
                </div>
                <p className="text-xs text-white/60">{template.description}</p>
              </div>
              <button
                onClick={() => copyQuery(template.query, i)}
                className="text-xs text-orange-400 hover:text-orange-300 transition-colors ml-2 font-medium"
              >
                {copied === i ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <pre className="text-xs bg-black/40 border border-white/10 text-orange-400 p-2 rounded-lg overflow-x-auto font-mono [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {template.query}
            </pre>
          </div>
        ))}
      </div>

      {!isFullscreen && (
        <p className="text-xs text-white/50 mt-3 italic flex-shrink-0">
          Click View All to see {queryTemplates.length} query templates
        </p>
      )}
    </div>
  );
};

export default QueryLibrary;
