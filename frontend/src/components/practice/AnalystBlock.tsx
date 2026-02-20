import React from "react";

const AnalystBlock: React.FC<{ onView?: () => void }> = ({ onView }) => {
  const isFullscreen = !onView;
  
  const tips = [
    "Use SELECT * to see all columns",
    "WHERE clause filters rows based on conditions",
    "JOIN combines multiple tables based on relationships",
    "GROUP BY aggregates data into groups",
    "ORDER BY sorts results in ascending or descending order",
    "COUNT() returns the number of rows",
    "SUM() calculates the total of numeric columns",
    "AVG() calculates the average value",
    "MAX() and MIN() find extreme values",
    "DISTINCT removes duplicate rows",
    "LIMIT restricts the number of results",
    "LIKE performs pattern matching with wildcards",
    "IN checks if a value exists in a list",
    "BETWEEN filters values within a range",
    "AS creates aliases for columns or tables",
    "HAVING filters grouped results",
  ];

  return (
    <div className={`bg-white p-4 rounded shadow ${!isFullscreen ? 'mb-4' : 'h-full overflow-auto'}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`font-semibold ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
          {isFullscreen ? '' : '💡 SQL Tips'}
        </h2>
        {onView && (
          <button onClick={onView} className="text-blue-500 text-sm hover:underline">
            View All
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {(isFullscreen ? tips : tips.slice(0, 4)).map((tip, i) => (
          <li key={i} className="text-sm text-gray-700 flex items-start">
            <span className="text-blue-500 mr-2">→</span>
            {tip}
          </li>
        ))}
      </ul>

      {!isFullscreen && (
        <p className="text-xs text-gray-500 mt-3 italic">
          Click View All to see more SQL tips and tricks
        </p>
      )}
    </div>
  );
};

export default AnalystBlock;
