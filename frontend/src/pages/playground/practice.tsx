import React, { useState } from "react";
import PracticeTerminal from "../../components/practice/PracticeTerminal";
import DataPreview from "../../components/practice/DataPreview";
import ERBlock from "../../components/practice/ERBlock";
import ERDiagramGenerator from "../../components/practice/ERDiagramGenerator";
import JoinPathFinder from "../../components/practice/JoinPathFinder";
import QueryLibrary from "../../components/practice/QueryLibrary";
import QueryCoverageMap from "../../components/practice/QueryCoverageMap";

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
      className="bg-gray-100 p-4 flex flex-col gap-4"
      style={{ width: `${100 - rightWidth}%` }}
    >
      {/* TOP SECTION - Data Preview */}
      <div className="flex-1 overflow-auto">
        <DataPreview onView={() => setActiveView("data")} />
      </div>

      {/* BOTTOM SECTION - 3 BLOCKS */}
      <div className="grid grid-cols-3 gap-4 h-[40%]">
        <div className="overflow-auto">
          <JoinPathFinder onView={() => setActiveView("joins")} />
        </div>

        <div className="overflow-auto">
          <QueryLibrary onView={() => setActiveView("library")} />
        </div>

        <div className="overflow-auto">
          <ERBlock onView={() => setActiveView("er")} />
        </div>
      </div>
    </div>

    {/* DRAG DIVIDER */}
    <div
      className="w-2 bg-gray-300 cursor-col-resize hover:bg-gray-400"
      onMouseDown={() => setIsDragging(true)}
    />

    {/* RIGHT PANEL - SQL Editor */}
    <div
      className="bg-white border-l"
      style={{ width: `${rightWidth}%` }}
    >
      <PracticeTerminal />
    </div>

    {/* FULLSCREEN VIEW */}
    {activeView && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white w-[95%] h-[95%] rounded-lg shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-lg">
              {activeView === "data" && "📊 Data Preview & Schema"}
              {activeView === "er" && "🗂️ Interactive ER Diagram"}
              {activeView === "joins" && "🔗 Join Path Finder"}
              {activeView === "library" && "📚 Query Library"}
              {activeView === "coverage" && "📍 Query Coverage Map"}
            </h3>
            <button
              onClick={() => setActiveView(null)}
              className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {activeView === "data" && <DataPreview />}
            {activeView === "er" && <ERDiagramGenerator />}
            {activeView === "joins" && <JoinPathFinder />}
            {activeView === "library" && <QueryLibrary />}
            {activeView === "coverage" && <QueryCoverageMap />}
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default PracticePage;
