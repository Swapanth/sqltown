import React from "react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: "schema" | "data" | "output") => void;
}

const Tabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabStyle = (tab: string) =>
    `px-6 py-4 text-sm font-medium border-b-2 transition-all ${
      activeTab === tab
        ? "border-[#E67350] text-black bg-white"
        : "border-transparent text-black/50 hover:text-black/80 hover:border-black/10"
    }`;

  return (
    <div className="flex bg-white">
      <button 
        className={tabStyle("schema")} 
        onClick={() => setActiveTab("schema")}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Schema
      </button>
      <button 
        className={tabStyle("data")} 
        onClick={() => setActiveTab("data")}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Data
      </button>
      <button 
        className={tabStyle("output")} 
        onClick={() => setActiveTab("output")}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Output
      </button>
    </div>
  );
};

export default Tabs;
