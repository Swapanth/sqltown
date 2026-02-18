import React from "react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: "schema" | "data" | "output") => void;
}

const Tabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabStyle = (tab: string) =>
    `px-5 py-3 text-sm font-medium border-b-2 transition ${
      activeTab === tab
        ? "border-black text-black bg-white"
        : "border-transparent text-gray-500 hover:text-black"
    }`;

  return (
    <div className="flex border-b bg-gray-100">
      <button className={tabStyle("schema")} onClick={() => setActiveTab("schema")}>
        Schema
      </button>
      <button className={tabStyle("data")} onClick={() => setActiveTab("data")}>
        Data
      </button>
      <button className={tabStyle("output")} onClick={() => setActiveTab("output")}>
        Output
      </button>
    </div>
  );
};

export default Tabs;
