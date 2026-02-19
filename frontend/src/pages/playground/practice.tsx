import React, { useState } from "react";
import PracticeTerminal from "../../components/practice/PracticeTerminal";
import TablesBlock from "../../components/practice/TablesBlock";
import AnalystBlock from "../../components/practice/AnalystBlock";
import ERBlock from "../../components/practice/ERBlock";
import InterestBlock from "../../components/practice/InterestBlock";

const PracticePage: React.FC = () => {
  const [activeView, setActiveView] = useState<string | null>(null);
  const [rightWidth, setRightWidth] = useState<number>(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const percentage = (e.clientX / window.innerWidth) * 100;
    setRightWidth(100 - percentage);
  };

  return (
    <div
      className="flex h-screen"
      onMouseMove={handleDrag}
      onMouseUp={() => setIsDragging(false)}
    >
      {/* LEFT PANEL */}
      <div
        className="bg-gray-100 p-4 overflow-auto"
        style={{ width: `${100 - rightWidth}%` }}
      >
        <TablesBlock onView={() => setActiveView("tables")} />
        <AnalystBlock onView={() => setActiveView("analyst")} />
        <ERBlock onView={() => setActiveView("er")} />
        <InterestBlock onView={() => setActiveView("interest")} />
      </div>

      {/* DRAG DIVIDER */}
      <div
        className="w-2 bg-gray-300 cursor-col-resize"
        onMouseDown={() => setIsDragging(true)}
      />

      {/* RIGHT PANEL */}
      <div
        className="bg-white border-l"
        style={{ width: `${rightWidth}%` }}
      >
        <PracticeTerminal />
      </div>

      {/* FULLSCREEN VIEW */}
      {activeView && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 w-3/4 h-3/4 rounded shadow-lg overflow-auto">
            <button
              onClick={() => setActiveView(null)}
              className="mb-4 px-3 py-1 bg-red-500 text-white rounded"
            >
              Close
            </button>

            {activeView === "tables" && <TablesBlock />}
            {activeView === "analyst" && <AnalystBlock />}
            {activeView === "er" && <ERBlock />}
            {activeView === "interest" && <InterestBlock />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
