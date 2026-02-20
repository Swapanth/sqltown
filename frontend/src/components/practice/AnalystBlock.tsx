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
    <div className={`p-4 rounded h-full flex flex-col overflow-hidden`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`font-semibold ${isFullscreen ? 'text-xl' : 'text-lg'} text-white flex items-center gap-2`}>
          {isFullscreen ? '💡 SQL Tips & Tricks' : '💡 SQL Tips'}
        </h2>
        {onView && (
          <button onClick={onView} className="text-pink-400 text-sm hover:text-pink-300 transition-colors font-medium">
            View All →
          </button>
        )}
      </div>

      <ul className="space-y-2 flex-1 overflow-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {(isFullscreen ? tips : tips.slice(0, 4)).map((tip, i) => (
          <li key={i} className="text-sm text-white/80 flex items-start p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-pink-400/30 hover:bg-white/10 transition-all">
            <span className="text-pink-400 mr-2 font-bold">→</span>
            {tip}
          </li>
        ))}
      </ul>

      {!isFullscreen && (
        <p className="text-xs text-white/50 mt-3 italic flex-shrink-0">
          Click View All to see more SQL tips and tricks
        </p>
      )}
    </div>
  );
};

export default AnalystBlock;
