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
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">🗂️ ER Diagram</h2>
        {onView && (
          <button onClick={onView} className="text-blue-500 text-sm hover:underline">
            View Full
          </button>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded border text-center">
        <p className="text-sm text-gray-600 mb-2">Database Structure</p>
        {tables.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {tables.map((table) => (
              <div
                key={table}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-mono"
              >
                {table}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No tables available</p>
        )}
        <p className="text-xs text-gray-500 mt-3">
          Click View Full to see complete ER diagram with relationships
        </p>
      </div>
    </div>
  );
};

export default ERBlock;
