import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Treemap,
} from "recharts";

const severityData = [
  { time: "00:00", Critical: 48, High: 40, Medium: 44, Low: 10 },
  { time: "04:00", Critical: 52, High: 43, Medium: 47, Low: 15 },
  { time: "08:00", Critical: 46, High: 35, Medium: 39, Low: 8 },
  { time: "12:00", Critical: 45, High: 38, Medium: 31, Low: 20 },
];

const confidenceData = [
  { time: "00:00", risk: 70, falsePos: 65, accuracy: 85 },
  { time: "04:00", risk: 60, falsePos: 68, accuracy: 82 },
  { time: "08:00", risk: 66, falsePos: 62, accuracy: 88 },
  { time: "12:00", risk: 58, falsePos: 64, accuracy: 80 },
];

const sourceData = [
  { name: "Slack", value: 35 },
  { name: "Jira", value: 25 },
  { name: "Drive", value: 20 },
  { name: "GitHub", value: 12 },
  { name: "Zendesk", value: 8 },
];

const treeData = [
  {
    name: "Events",
    children: [
      { name: "Posture", size: 8 },
      { name: "Discovery", size: 3 },
      { name: "Classification", size: 1 },
      { name: "Exfiltration", size: 6 },
    ],
  },
];

const COLORS = ["#8b5cf6", "#22c55e", "#eab308", "#ef4444", "#3b82f6"];

const AnalystBlock: React.FC<{ onView?: () => void; dbId?: string }> = ({ onView, dbId }) => {
  const isFullscreen = !onView;

  if (!isFullscreen) {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Data Analyst</h3>
          {onView && (
            <button 
              onClick={onView} 
              className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            </button>
          )}
        </div>
        <div className="flex-1 space-y-2 text-xs text-gray-600 overflow-y-auto">
          <p>• Monitor SQL query performance</p>
          <p>• Analyze dataset distributions</p>
          <p>• Track joins & aggregations usage</p>
          <p>• Identify anomaly patterns</p>
          <div className="mt-3 p-2 bg-gray-50 rounded text-center">
            <div className="text-lg font-bold text-orange-600">84%</div>
            <div className="text-xs text-gray-500">Query Success Rate</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {/* Event Severity */}
      <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Severity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Critical" stackId="a" />
              <Bar dataKey="High" stackId="a" />
              <Bar dataKey="Medium" stackId="a" />
              <Bar dataKey="Low" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Source Distribution */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Sources</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sourceData} dataKey="value" nameKey="name" outerRadius={80}>
                {sourceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detection Confidence */}
      <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detection Confidence</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={confidenceData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#8b5cf6" />
              <Line type="monotone" dataKey="falsePos" stroke="#ef4444" />
              <Line type="monotone" dataKey="accuracy" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Event Tree */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Types</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap data={treeData} dataKey="size" aspectRatio={1} stroke="#fff" fill="#3b82f6" />
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalystBlock;
