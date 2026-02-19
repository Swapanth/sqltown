import React from "react";

const TablesBlock: React.FC<{ onView?: () => void }> = ({ onView }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Tables</h2>
        {onView && (
          <button
            onClick={onView}
            className="text-blue-500 text-sm"
          >
            View
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Displays database tables and structure.
      </p>
    </div>
  );
};

export default TablesBlock;
