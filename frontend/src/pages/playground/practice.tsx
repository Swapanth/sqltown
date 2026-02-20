import React, { useState } from "react";
import PracticeTerminal from "../../components/practice/PracticeTerminal";
import DataPreview from "../../components/practice/DataPreview";
import ERBlock from "../../components/practice/ERBlock";
import ERDiagramGenerator from "../../components/practice/ERDiagramGenerator";
import JoinPathFinder from "../../components/practice/JoinPathFinder";
import QueryLibrary from "../../components/practice/QueryLibrary";
import AnalystBlock from "../../components/practice/AnalystBlock";

const PracticePage: React.FC = () => {
  const [activeView, setActiveView] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col">
      {/* TOP ROW - Data Preview & Terminal */}
<div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Data Preview - Left Half */}
        <div className="w-1/2 overflow-auto">
          <DataPreview onView={() => setActiveView("data")} />
        </div>

        {/* Terminal with Output - Right Half */}
<div className="w-1/2 border rounded flex min-w-0">
  <PracticeTerminal />
</div>

      </div>

      {/* BOTTOM ROW - 4 Blocks */}
      <div className="h-[280px] grid grid-cols-4 gap-4 p-4 bg-gray-50 border-t">
        <div className="overflow-auto">
          <JoinPathFinder onView={() => setActiveView("joins")} />
        </div>

        <div className="overflow-auto">
          <QueryLibrary onView={() => setActiveView("library")} />
        </div>

        <div className="overflow-auto">
          <ERBlock onView={() => setActiveView("er")} />
        </div>

        <div className="overflow-auto">
          <AnalystBlock onView={() => setActiveView("analyst")} />
        </div>
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
                {activeView === "analyst" && "💡 SQL Tips & Tricks"}
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
              {activeView === "analyst" && <AnalystBlock />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
