import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PracticeTerminal from "../../components/practice/PracticeTerminal";
import DataPreview from "../../components/practice/DataPreview";
import ERBlock from "../../components/practice/ERBlock";
import ERDiagramGenerator from "../../components/practice/ERDiagramGenerator";
import JoinPathFinder from "../../components/practice/JoinPathFinder";
import QueryLibrary from "../../components/practice/QueryLibrary";
import AnalystBlock from "../../components/practice/AnalystBlock";
import { ArrowLeftIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { CircleStackIcon } from "@heroicons/react/24/solid";
import { PracticeDatabaseProvider, usePracticeDatabase } from "../../context/PracticeDatabaseContext";

const PracticePageContent: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string | null>(null);
  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useState(false);
  const { databaseInfo, isLoading, error } = usePracticeDatabase();

  useEffect(() => {
    if (!isLoading && !error && !databaseInfo) {
      navigate('/practice');
    }
  }, [isLoading, error, databaseInfo, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-center">
          <CircleStackIcon className="w-16 h-16 mx-auto mb-4 text-white/20 animate-pulse" />
          <p className="text-white/60">Loading database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-center">
          <CircleStackIcon className="w-16 h-16 mx-auto mb-4 text-red-500/40" />
          <p className="text-red-400">Error: {error}</p>
          <button
            onClick={() => navigate('/practice')}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  if (!databaseInfo) {
    return null;
  }

  const thumbnail = databaseInfo.id === 'ecommerce' 
    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    : databaseInfo.id === 'university'
    ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    : databaseInfo.id === 'hr'
    ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    : "linear-gradient(135deg, #fa709a 0%, #fee140 100%)";

  const category = databaseInfo.id === 'ecommerce' 
    ? 'Retail'
    : databaseInfo.id === 'university'
    ? 'Education'
    : databaseInfo.id === 'hr'
    ? 'Business'
    : 'Finance';

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0A0A0F] via-[#0F0F0F] to-[#1A0A1F]" style={{ fontFamily: "'Syne', sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-b border-white/20 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/practice')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-105 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </button>
            
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: thumbnail }}
            >
              <CircleStackIcon className="w-7 h-7 text-white" />
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-3">
                {databaseInfo.name}
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30">
                  {databaseInfo.difficulty}
                </span>
              </h1>
              <p className="text-sm text-white/50 mt-1">{databaseInfo.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-white/60">
              <span className="font-medium text-white/80">{databaseInfo.tables}</span> Tables
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-white/70 border border-white/10">
              {category}
            </div>
          </div>
        </div>
      </div>

      {/* TOP ROW - Data Preview & Terminal */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Data Preview - Left Half */}
        <div className="w-1/2 min-h-0">
          <div className="h-full bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 shadow-lg overflow-hidden">
            <DataPreview onView={() => setActiveView("data")} />
          </div>
        </div>

        {/* Terminal with Output - Right Half */}
        <div className="w-1/2 min-w-0">
          <div className="h-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 shadow-lg overflow-hidden">
            <PracticeTerminal />
          </div>
        </div>
      </div>

      {/* BOTTOM ROW - 4 Blocks with Collapse */}
      <div className="relative">
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsBottomPanelCollapsed(!isBottomPanelCollapsed)}
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-[#1A1A1A] border border-white/10 rounded-t-lg hover:bg-[#222222] transition-all group flex items-center gap-2 text-white/60 hover:text-white"
        >
          {isBottomPanelCollapsed ? (
            <>
              <ChevronUpIcon className="w-4 h-4" />
              <span className="text-xs font-medium">Show Tools</span>
              <ChevronUpIcon className="w-4 h-4" />
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4" />
              <span className="text-xs font-medium">Hide Tools</span>
              <ChevronDownIcon className="w-4 h-4" />
            </>
          )}
        </button>

        <div 
          className={`grid grid-cols-4 gap-4 px-4 pb-4 bg-gradient-to-b from-transparent via-black/20 to-black/40 border-t border-white/10 transition-all duration-300 ${
            isBottomPanelCollapsed ? 'h-0 pb-0' : 'h-[280px]'
          }`}
        >
          <div className="min-h-0">
            <div className="h-full bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1 transform shadow-lg overflow-hidden">
              <JoinPathFinder onView={() => setActiveView("joins")} />
            </div>
          </div>

          <div className="min-h-0">
            <div className="h-full bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-yellow-500/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-1 transform shadow-lg overflow-hidden">
              <QueryLibrary onView={() => setActiveView("library")} />
            </div>
          </div>

          <div className="min-h-0">
            <div className="h-full bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-violet-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1 transform shadow-lg overflow-hidden">
              <ERBlock onView={() => setActiveView("er")} />
            </div>
          </div>

          <div className="min-h-0">
            <div className="h-full bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-red-500/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-pink-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-1 transform shadow-lg overflow-hidden">
              <AnalystBlock onView={() => setActiveView("analyst")} />
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN VIEW */}
      {activeView && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex justify-center items-center z-50 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-slate-900/80 backdrop-blur-2xl w-[95%] h-[95%] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/30 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-lg">
              <h3 className="font-semibold text-lg text-white flex items-center gap-3">
                {activeView === "data" && (
                  <>
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      📊
                    </span>
                    Data Preview & Schema
                  </>
                )}
                {activeView === "er" && (
                  <>
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      🗂️
                    </span>
                    Interactive ER Diagram
                  </>
                )}
                {activeView === "joins" && (
                  <>
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      🔗
                    </span>
                    Join Path Finder
                  </>
                )}
                {activeView === "library" && (
                  <>
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      📚
                    </span>
                    Query Library
                  </>
                )}
                {activeView === "analyst" && (
                  <>
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                      💡
                    </span>
                    SQL Tips & Tricks
                  </>
                )}
              </h3>
              <button
                onClick={() => setActiveView(null)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-all hover:scale-105 border border-red-500/30"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-gradient-to-b from-black/40 via-black/20 to-black/40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

const PracticePage: React.FC = () => {
  const { dbId } = useParams<{ dbId: string }>();

  return (
    <PracticeDatabaseProvider dbId={dbId}>
      <PracticePageContent />
    </PracticeDatabaseProvider>
  );
};

export default PracticePage;
