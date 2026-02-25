import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestionById } from "../../services/questionService";

interface SQLProblem {
  id: number;
  title: string;
  difficulty: string;
  topics: string[];
  companies: string[];
  acceptance: number;
  description: string;
  schema: {
    tables: any[];
  };
  examples: any[];
  testCases: any[];
  solution: string;
  hints: string[];
}

const ProblemSolvePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'solutions' | 'submissions'>('description');
  const [sqlCode, setSqlCode] = useState(`-- Write your SQL query here
SELECT 
    
FROM 
    
WHERE 
    
ORDER BY 
    ;`);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSchema, setShowSchema] = useState(true);

  // Get the problem based on the ID from the interview questions
  useEffect(() => {
  if (!id) return;

  console.log("Route changed. New ID:", id);

  // 🔥 RESET EVERYTHING WHEN ID CHANGES
  setProblem(null);
  setTestResult(null);
  setSqlCode(`-- Write your SQL query here
SELECT 
    
FROM 
    
WHERE 
    
ORDER BY 
    ;`);

  fetchQuestionById(Number(id))
    .then((data) => {
      console.log("API DATA:", data);

      const formattedProblem: SQLProblem = {
        id: data.id,
        title: data.title,
        difficulty: data.difficulty,
        topics: data.topics || [],
        companies: data.companies || [],
        acceptance: 75,
        description: data.description,
        schema: {
          tables: data.schema?.tables || []
        },
        examples: data.examples || [],
        testCases: (data.test_cases || []).map((tc: any) => ({
          setupSql: tc.setup_sql,
          expectedOutput: tc.expected_output
        })),
        solution: data.solution || "",
        hints: data.hints || []
      };

      setProblem(formattedProblem);
    })
    .catch((err) => {
      console.error("Error fetching problem:", err);
      setProblem(null);
    });

}, [id]);

  if (!problem) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading problem...</p>
      </div>
    </div>
  );

  const safeProblem = {
  ...problem,
  schema: problem.schema || { tables: [] },
  examples: problem.examples || [],
  hints: problem.hints || [],
  companies: problem.companies || [],
  testCases: problem.testCases || []   // ✅ ADD THIS
};

  console.log('Problem ID:', id);

 const handleRunCode = () => {
  setIsRunning(true);
  setTestResult(null);

  setTimeout(() => {
    if (!sqlCode.toLowerCase().includes("select")) {
      setTestResult("Please write a valid SQL SELECT query.");
      setIsRunning(false);
      return;
    }

    if (!safeProblem.testCases.length) {
      setTestResult("No test cases available.");
      setIsRunning(false);
      return;
    }

   const testCase = safeProblem.testCases[0];

const rows = testCase.expectedOutput;

if (!rows || rows.length === 0) {
  setTestResult("No expected output defined.");
  setIsRunning(false);
  return;
}

const columns = Object.keys(rows[0]);

setTestResult(`
Query executed successfully!

Returned ${rows.length} rows

Expected Output:
${columns.join(" | ")}

${rows.map((row: any) => 
  columns.map(col => row[col]).join(" | ")
).join("\n")}
`);

    setIsRunning(false);
  }, 700);
};

  const handleSubmit = () => {
    console.log('Submitting SQL:', sqlCode);
    alert('SQL query submitted for evaluation!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-6">
            {/* Problem Title and Difficulty */}
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">
                {safeProblem.id}. {safeProblem.title}
              </h1>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getDifficultyColor(safeProblem.difficulty)}`}>
                {safeProblem.difficulty}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex flex-wrap gap-1">
                  {safeProblem.topics.map((topic: string) => (
                    <span key={topic} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
                {safeProblem.companies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {safeProblem.companies.map((company: string) => (
                      <span key={company} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {company}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="text-sm text-gray-600">
              Acceptance Rate: <span className="font-medium text-green-600">{problem.acceptance}%</span>
            </div>

            {/* Problem Description */}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {problem.description}
              </p>
            </div>

            {/* Database Schema */}
            {safeProblem.schema.tables.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Database Schema</h4>
                  <button
                    onClick={() => setShowSchema(!showSchema)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showSchema ? 'Hide' : 'Show'} Schema
                  </button>
                </div>
                
                {showSchema && (
                  <div className="space-y-4">
                    {safeProblem.schema.tables.map((table: any, index: number) => (
                      <div key={index} className="bg-white rounded border">
                        <div className="bg-gray-100 px-3 py-2 border-b">
                          <h5 className="font-medium text-gray-900">{table.name}</h5>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium text-gray-700">Column</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-700">Type</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-700">Constraints</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {table.columns.map((column: any, colIndex: number) => (
                                <tr key={colIndex}>
                                  <td className="px-3 py-2 font-mono text-blue-600">{column.name}</td>
                                  <td className="px-3 py-2 font-mono text-gray-600">{column.type}</td>
                                  <td className="px-3 py-2 text-gray-600">
                                    {column.constraints?.join(', ') || '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Sample Data */}
                        {table.sampleData && table.sampleData.length > 0 && (
                          <div className="border-t bg-gray-50 px-3 py-2">
                            <h6 className="text-xs font-medium text-gray-700 mb-2">Sample Data:</h6>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-gray-100">
                                    {table.columns.map((column: any, colIndex: number) => (
                                      <th key={colIndex} className="px-2 py-1 text-left font-medium text-gray-700">
                                        {column.name}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {table.sampleData.slice(0, 5).map((row: any[], rowIndex: number) => (
                                    <tr key={rowIndex}>
                                      {row.map((cell: any, cellIndex: number) => (
                                        <td key={cellIndex} className="px-2 py-1 font-mono text-gray-600">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Expected Output Example */}
            {safeProblem.examples.length > 0 && (
              <div className="space-y-4">
                {safeProblem.examples.map((example: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Expected Output:</h4>
                    <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                    <div className="bg-white rounded border overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            {example.expectedColumns.map((column: string, colIndex: number) => (
                              <th key={colIndex} className="px-3 py-2 text-left font-medium text-gray-700">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {example.expectedOutput.map((row: any[], rowIndex: number) => (
                            <tr key={rowIndex}>
                              {row.map((cell: any, cellIndex: number) => (
                                <td key={cellIndex} className="px-3 py-2 font-mono text-gray-600">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {example.explanation && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Explanation:</span> {example.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hints */}
            {safeProblem.hints.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">💡 Hints</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {safeProblem.hints.map((hint: string, index: number) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'editorial':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Solution Approach</h3>
            {problem.solution ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">SQL Solution:</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
                  <code>{problem.solution}</code>
                </pre>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Editorial content coming soon...
              </div>
            )}
          </div>
        );
      
      case 'solutions':
        return (
          <div className="text-center py-12 text-gray-500">
            Community solutions coming soon...
          </div>
        );
      
      case 'submissions':
        return (
          <div className="text-center py-12 text-gray-500">
            Your submissions will appear here...
          </div>
        );
      
      default:
        return null;
    }
  };
  if (!problem) {
  return <div className="p-10 text-center">Problem not found.</div>;
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => navigate('/interview')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span>←</span>
          <span className="text-sm">Back to Problems</span>
        </button>
      </div>
      
      <div className="w-full lg:max-w-7xl lg:mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
          {/* Left Panel - Problem Description */}
          <div className="w-full lg:w-1/2 bg-white lg:border-r border-gray-200 flex flex-col">
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
              {[
                { key: 'description', label: 'Description', icon: '📄' },
                { key: 'editorial', label: 'Editorial', icon: '📝' },
                { key: 'solutions', label: 'Solutions', icon: '💡' },
                { key: 'submissions', label: 'Submissions', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-[50vh] lg:max-h-none">
              {renderTabContent()}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-full lg:w-1/2 bg-white flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200">
            {/* Code Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 flex-wrap gap-2">
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-xs sm:text-sm font-medium text-gray-700">SQL Query</span>
                <select
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MySQL">MySQL</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="SQLite">SQLite</option>
                  <option value="SQL Server">SQL Server</option>
                </select>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button className="p-1 sm:p-2 text-gray-500 hover:text-gray-700" title="Settings">
                  <span className="text-base sm:text-lg">⚙️</span>
                </button>
                <button className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 hidden sm:inline-block" title="Fullscreen">
                  <span className="text-base sm:text-lg">↗️</span>
                </button>
                <button
                  onClick={() => setSqlCode(`-- Write your SQL query here
SELECT 
    
FROM 
    
WHERE 
    
ORDER BY 
    ;`)}
                  className="p-2 text-gray-500 hover:text-gray-700" 
                  title="Reset"
                >
                  <span className="text-lg">🔄</span>
                </button>
              </div>
            </div>

            {/* SQL Editor */}
            <div className="flex-1 flex flex-col min-h-[300px] lg:min-h-0">
              <div className="flex-1 relative">
                <textarea
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      e.preventDefault();
                      handleRunCode();
                    }
                  }}
                  className="w-full h-full p-3 sm:p-4 font-mono text-xs sm:text-sm resize-none border-none outline-none bg-gray-900 text-gray-100"
                  style={{ 
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    lineHeight: '1.5'
                  }}
                  placeholder="-- Write your SQL query here
SELECT 
    column1,
    column2
FROM 
    table_name
WHERE 
    condition
ORDER BY 
    column1;"
                />
              </div>

              {/* Test Results Panel */}
              <div className="border-t border-gray-200">
                <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm font-medium">Query Result</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-white min-h-[100px] sm:min-h-[120px] max-h-[150px] sm:max-h-[200px] overflow-y-auto">
                  {testResult ? (
                    <pre className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {testResult}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Run your SQL query to see results
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-2 justify-between sm:justify-start">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    {isRunning ? 'Running...' : 'Run SQL'}
                  </button>
                  <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">Ctrl + Enter</span>
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm w-full sm:w-auto"
                >
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvePage;

