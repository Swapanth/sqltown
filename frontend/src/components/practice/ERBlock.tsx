import React, { useEffect, useState } from "react";
import { getTables } from "../playground/compiler";

const ERBlock: React.FC<{ onView?: () => void }> = ({ onView }) => {
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const tableList = await getTables();
        setTables(tableList);
      } catch (err) {
        console.error("Failed to load tables:", err);
      }
    };
    loadTables();
  }, []);

  return (
    <div className="p-4 rounded h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-white flex items-center gap-2">🗂️ ER Diagram</h2>
        {onView && (
          <button onClick={onView} className="text-violet-400 text-sm hover:text-violet-300 transition-colors font-medium">
            View Full →
          </button>
        )}
      </div>

      <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 text-center">
        <p className="text-sm text-white/70 mb-2">Database Structure</p>
        {tables.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {tables.map((table) => (
              <div
                key={table}
                className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-sm text-violet-300 px-3 py-1 rounded-lg text-xs font-mono border border-violet-400/30 shadow-lg shadow-violet-500/10"
              >
                {table}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/40">No tables available</p>
        )}
        {onView && (
          <p className="text-xs text-white/50 mt-3 flex-shrink-0">
            Click View Full to see complete ER diagram with relationships
          </p>
        )}
      </div>
    </div>
  );
};

export default ERBlock;
