import React, { useEffect, useState } from "react";
import { getTables } from "../playground/compiler";

const ERBlock: React.FC<{ onView?: () => void; dbId?: string }> = ({ onView, dbId }) => {
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const tableList = await getTables(dbId);
        setTables(tableList);
      } catch (err) {
        console.error("Failed to load tables:", err);
      }
    };
    loadTables();
  }, [dbId]);

  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-xs text-gray-800">ER Diagram</h3>
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

      <div className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-100 text-center overflow-hidden">
        <p className="text-xs text-gray-600 mb-1.5">Database Structure</p>
        {tables.length > 0 ? (
          <div className="flex flex-wrap gap-1 justify-center mb-1.5 overflow-y-auto mb-1.5">
            {tables.slice(0, 6).map((table) => (
              <div
                key={table}
                className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium"
              >
                {table}
              </div>
            ))}
            {tables.length > 6 && (
              <div className="text-xs text-gray-500">+{tables.length - 6} more</div>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 mb-2">No tables available</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Click View Full for complete diagram
        </p>
      </div>
    </div>
  );
};

export default ERBlock;
