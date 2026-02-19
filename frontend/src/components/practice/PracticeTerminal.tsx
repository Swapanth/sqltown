import React, { useState } from "react";

const PracticeTerminal: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col h-full">
      <textarea
        className="flex-1 p-4 border-b font-mono text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write SQL query..."
      />

      <div className="p-4">
        <button className="px-4 py-2 bg-black text-white rounded">
          Run
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        Output area
      </div>
    </div>
  );
};

export default PracticeTerminal;
