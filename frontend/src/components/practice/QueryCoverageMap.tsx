import React, { useState } from "react";

interface CoverageItem {
  concept: string;
  description: string;
  queries: string[];
  covered: boolean;
}

const QueryCoverageMap: React.FC<{ onView?: () => void }> = ({ onView }) => {
  const isFullscreen = !onView;
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  const coverageItems: CoverageItem[] = [
    {
      concept: "SELECT Basics",
      description: "Retrieve data from tables",
      queries: ["SELECT *", "SELECT specific columns", "SELECT DISTINCT"],
      covered: true,
    },
    {
      concept: "WHERE Clause",
      description: "Filter records with conditions",
      queries: ["WHERE =", "WHERE >/<", "WHERE LIKE", "WHERE IN"],
      covered: true,
    },
    {
      concept: "JOIN Operations",
      description: "Combine data from multiple tables",
      queries: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
      covered: false,
    },
    {
      concept: "Aggregation",
      description: "Perform calculations on data",
      queries: ["COUNT()", "SUM()", "AVG()", "MAX()", "MIN()"],
      covered: true,
    },
    {
      concept: "GROUP BY",
      description: "Group rows by column values",
      queries: ["GROUP BY single", "GROUP BY multiple", "HAVING clause"],
      covered: false,
    },
    {
      concept: "ORDER BY",
      description: "Sort query results",
      queries: ["ORDER BY ASC", "ORDER BY DESC", "ORDER BY multiple columns"],
      covered: true,
    },
    {
      concept: "Subqueries",
      description: "Nested queries for complex logic",
      queries: ["Subquery in WHERE", "Subquery in SELECT", "Correlated subqueries"],
      covered: false,
    },
    {
      concept: "Window Functions",
      description: "Advanced analytics over rows",
      queries: ["ROW_NUMBER()", "RANK()", "PARTITION BY"],
      covered: false,
    },
    {
      concept: "String Functions",
      description: "Manipulate text data",
      queries: ["UPPER/LOWER", "CONCAT", "SUBSTRING", "TRIM"],
      covered: false,
    },
    {
      concept: "Date Functions",
      description: "Work with date and time",
      queries: ["DATE()", "NOW()", "DATE_ADD", "DATEDIFF"],
      covered: false,
    },
  ];

  const coveragePercentage = (
    (coverageItems.filter((item) => item.covered).length / coverageItems.length) *
    100
  ).toFixed(0);

  return (
    <div className={`bg-white p-4 rounded shadow ${!isFullscreen ? 'mb-4' : 'h-full flex flex-col'}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`font-semibold ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
          📍 Query Coverage Map
        </h2>
        {onView && (
          <button onClick={onView} className="text-blue-500 text-sm hover:underline">
            View Full
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-600">Overall Progress</span>
          <span className="text-xs font-bold text-blue-600">{coveragePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
            style={{ width: `${coveragePercentage}%` }}
          />
        </div>
      </div>

      {/* Coverage Items */}
      <div className={`space-y-2 ${isFullscreen ? 'flex-1 overflow-auto' : ''}`}>
        {(isFullscreen ? coverageItems : coverageItems.slice(0, 4)).map((item, i) => (
          <div
            key={i}
            className={`border rounded p-3 cursor-pointer transition ${
              selectedConcept === item.concept
                ? "border-blue-400 bg-blue-50"
                : "hover:border-gray-300"
            }`}
            onClick={() => setSelectedConcept(item.concept === selectedConcept ? null : item.concept)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.covered ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">{item.concept}</h3>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {selectedConcept === item.concept ? "▲" : "▼"}
              </span>
            </div>

            {selectedConcept === item.concept && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs font-semibold text-gray-600 mb-2">Required Queries:</div>
                <div className="space-y-1">
                  {item.queries.map((query, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400">•</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">{query}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!isFullscreen && (
        <p className="text-xs text-gray-500 mt-3 italic">
          Click View Full to see all {coverageItems.length} SQL concepts
        </p>
      )}
    </div>
  );
};

export default QueryCoverageMap;
