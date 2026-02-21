import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import PracticeTerminal from "../../components/practice/PracticeTerminal";
import PracticePlayground from "../../components/practice/PracticePlayground";
import DataPreview from "../../components/practice/DataPreview";
import ERBlock from "../../components/practice/ERBlock";
import ERDiagramGenerator from "../../components/practice/ERDiagramGenerator";
import JoinPathFinder from "../../components/practice/JoinPathFinder";
import QueryLibrary from "../../components/practice/QueryLibrary";
import AnalystBlock from "../../components/practice/AnalystBlock";

const PracticePage: React.FC = () => {
  const [activeView, setActiveView] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { dbId } = useParams();

  const handleBackToPracticeList = () => {
    navigate('/practice');
  };

  const handleExpand = (viewType: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveView(viewType);
      setIsAnimating(false);
    }, 300);
  };

  const handleCollapse = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveView(null);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Navigation Header */}
        <div className="mb-6">
          <button
            onClick={handleBackToPracticeList}
            className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-orange-100 rounded-full transition-colors duration-200 group"
          >
            <ArrowLeftIcon className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
          </button>
        </div>

        <div className="space-y-6 relative">
          {/* Compact Grid View */}
          {!activeView && (
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {/* TOP ROW - Data Preview & Terminal */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Data Preview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition-all duration-300  hover:shadow">
                  <DataPreview dbId={dbId} onView={() => handleExpand("data")} />
                </div>

                {/* Terminal */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition-all duration-300  hover:shadow">
                  <PracticeTerminal dbId={dbId} onView={() => handleExpand("terminal")} />
                </div>
              </div>

              {/* BOTTOM ROW - 4 Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-55 transform transition-all duration-300  hover:shadow">
                  <JoinPathFinder onView={() => handleExpand("joins")} />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-55 transform transition-all duration-300  hover:shadow">
                  <QueryLibrary onView={() => handleExpand("library")} />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-55 transform transition-all duration-300  hover:shadow">
                  <ERBlock onView={() => handleExpand("er")} />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-55 transform transition-all duration-300  hover:shadow">
                  <AnalystBlock onView={() => handleExpand("analyst")} />
                </div>
              </div>
            </div>
          )}

          {/* Expanded View */}
          {activeView && (
            <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="flex items-center justify-between px-6 py-4">
                <h3 className="font-semibold text-lg text-gray-800">
                
                </h3>
                <button
                  onClick={handleCollapse}
                  className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                 X
                </button>
              </div>
              <div className="min-h-[70vh] overflow-auto">
                {activeView === "data" && <DataPreview dbId={dbId} />}
                {activeView === "terminal" && <PracticePlayground dbId={dbId} />}
                {activeView === "er" && <ERDiagramGenerator dbId={dbId} />}
                {activeView === "joins" && <JoinPathFinder dbId={dbId} />}
                {activeView === "library" && <QueryLibrary dbId={dbId} />}
                {activeView === "analyst" && <AnalystBlock dbId={dbId} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
