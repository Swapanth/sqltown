import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface SQLTestCase {
  id: number;
  description: string;
  expectedOutput: string[][];
  expectedColumns: string[];
}

interface SQLProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies?: string[];
  acceptance: number;
  description: string;
  schema: {
    tables: {
      name: string;
      columns: {
        name: string;
        type: string;
        constraints?: string[];
      }[];
      sampleData: string[][];
    }[];
  };
  examples: {
    description: string;
    expectedOutput: string[][];
    expectedColumns: string[];
    explanation?: string;
  }[];
  testCases: SQLTestCase[];
  solution?: string;
  hints?: string[];
}

const mockSQLProblems: { [key: number]: SQLProblem } = {
  1: {
    id: 1,
    title: "Find the top 3 customers by total order value",
    difficulty: "Easy",
    topics: ['JOIN', 'GROUP BY', 'ORDER BY'],
    companies: ['Google', 'Amazon'],
    acceptance: 78.5,
    description: `Write a SQL query to find the top 3 customers by their total order value. 

Return the customer name and their total order value, ordered by total value in descending order.`,
    schema: {
      tables: [
        {
          name: "customers",
          columns: [
            { name: "customer_id", type: "INT", constraints: ["PRIMARY KEY"] },
            { name: "customer_name", type: "VARCHAR(100)" },
            { name: "email", type: "VARCHAR(100)" }
          ],
          sampleData: [
            ["1", "John Doe", "john@email.com"],
            ["2", "Jane Smith", "jane@email.com"],
            ["3", "Bob Johnson", "bob@email.com"],
            ["4", "Alice Brown", "alice@email.com"],
            ["5", "Charlie Wilson", "charlie@email.com"]
          ]
        },
        {
          name: "orders",
          columns: [
            { name: "order_id", type: "INT", constraints: ["PRIMARY KEY"] },
            { name: "customer_id", type: "INT", constraints: ["FOREIGN KEY"] },
            { name: "order_date", type: "DATE" },
            { name: "total_amount", type: "DECIMAL(10,2)" }
          ],
          sampleData: [
            ["1", "1", "2024-01-15", "150.00"],
            ["2", "2", "2024-01-16", "200.00"],
            ["3", "1", "2024-01-17", "75.00"],
            ["4", "3", "2024-01-18", "300.00"],
            ["5", "2", "2024-01-19", "125.00"],
            ["6", "4", "2024-01-20", "180.00"],
            ["7", "1", "2024-01-21", "95.00"]
          ]
        }
      ]
    },
    examples: [
      {
        description: "Expected output showing top 3 customers by total order value",
        expectedColumns: ["customer_name", "total_order_value"],
        expectedOutput: [
          ["Jane Smith", "325.00"],
          ["John Doe", "320.00"],
          ["Bob Johnson", "300.00"]
        ],
        explanation: "Jane Smith has orders totaling $325, John Doe has $320, and Bob Johnson has $300."
      }
    ],
    testCases: [
      {
        id: 1,
        description: "Top 3 customers by total order value",
        expectedColumns: ["customer_name", "total_order_value"],
        expectedOutput: [
          ["Jane Smith", "325.00"],
          ["John Doe", "320.00"],
          ["Bob Johnson", "300.00"]
        ]
      }
    ],
    solution: `SELECT 
    c.customer_name,
    SUM(o.total_amount) as total_order_value
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
ORDER BY total_order_value DESC
LIMIT 3;`,
    hints: [
      "You'll need to JOIN the customers and orders tables",
      "Use GROUP BY to aggregate orders per customer",
      "Use SUM() to calculate total order value",
      "Don't forget to ORDER BY and LIMIT the results"
    ]
  },
  2: {
    id: 2,
    title: "Calculate running total of sales by month",
    difficulty: "Medium",
    topics: ['Window Functions', 'Aggregation'],
    companies: ['Microsoft', 'Meta'],
    acceptance: 65.2,
    description: `Write a SQL query to calculate the running total of sales by month.

Return the month, monthly sales, and running total, ordered by month.`,
    schema: {
      tables: [
        {
          name: "sales",
          columns: [
            { name: "sale_id", type: "INT", constraints: ["PRIMARY KEY"] },
            { name: "sale_date", type: "DATE" },
            { name: "amount", type: "DECIMAL(10,2)" }
          ],
          sampleData: [
            ["1", "2024-01-15", "1000.00"],
            ["2", "2024-01-20", "1500.00"],
            ["3", "2024-02-10", "2000.00"],
            ["4", "2024-02-25", "1200.00"],
            ["5", "2024-03-05", "1800.00"],
            ["6", "2024-03-15", "900.00"]
          ]
        }
      ]
    },
    examples: [
      {
        description: "Running total of sales by month",
        expectedColumns: ["month", "monthly_sales", "running_total"],
        expectedOutput: [
          ["2024-01", "2500.00", "2500.00"],
          ["2024-02", "3200.00", "5700.00"],
          ["2024-03", "2700.00", "8400.00"]
        ]
      }
    ],
    testCases: [
      {
        id: 1,
        description: "Running total by month",
        expectedColumns: ["month", "monthly_sales", "running_total"],
        expectedOutput: [
          ["2024-01", "2500.00", "5700.00"],
          ["2024-02", "3200.00", "5700.00"],
          ["2024-03", "2700.00", "8400.00"]
        ]
      }
    ],
    solution: `SELECT 
    DATE_FORMAT(sale_date, '%Y-%m') as month,
    SUM(amount) as monthly_sales,
    SUM(SUM(amount)) OVER (ORDER BY DATE_FORMAT(sale_date, '%Y-%m')) as running_total
FROM sales
GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
ORDER BY month;`,
    hints: [
      "Use DATE_FORMAT to extract year-month",
      "GROUP BY month to get monthly totals",
      "Use window functions with SUM() OVER() for running total",
      "Order the window function by month"
    ]
  }
};

const ProblemSolvePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  const questionId = parseInt(id || '1');
  const problem = mockSQLProblems[questionId] || mockSQLProblems[1];
  
  console.log('Problem ID:', id); // Use id parameter

  const handleRunCode = () => {
    setIsRunning(true);
    setTestResult(null);
    
    // Simulate SQL execution
    setTimeout(() => {
      if (sqlCode.trim().toLowerCase().includes('select')) {
        setTestResult(`Query executed successfully!
        
Returned 3 rows in 0.02ms

Expected Output:
${problem.examples[0].expectedColumns.join(' | ')}
${problem.examples[0].expectedOutput.map(row => row.join(' | ')).join('\n')}`);
      } else {
        setTestResult("Please write a valid SQL SELECT query");
      }
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmit = () => {
    // Handle SQL submission logic
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
                {problem.id}. {problem.title}
              </h1>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex flex-wrap gap-1">
                  {problem.topics.map(topic => (
                    <span key={topic} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
                {problem.companies && (
                  <div className="flex flex-wrap gap-1">
                    {problem.companies.map(company => (
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
                  {problem.schema.tables.map((table, index) => (
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
                            {table.columns.map((column, colIndex) => (
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
                      <div className="border-t bg-gray-50 px-3 py-2">
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Sample Data:</h6>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-gray-100">
                                {table.columns.map((column, colIndex) => (
                                  <th key={colIndex} className="px-2 py-1 text-left font-medium text-gray-700">
                                    {column.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {table.sampleData.slice(0, 5).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {row.map((cell, cellIndex) => (
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expected Output Example */}
            <div className="space-y-4">
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Expected Output:</h4>
                  <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                  <div className="bg-white rounded border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          {example.expectedColumns.map((column, colIndex) => (
                            <th key={colIndex} className="px-3 py-2 text-left font-medium text-gray-700">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {example.expectedOutput.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
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

            {/* Hints */}
            {problem.hints && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">💡 Hints</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {problem.hints.map((hint, index) => (
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
      
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Left Panel - Problem Description */}
          <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              {[
                { key: 'description', label: 'Description', icon: '📄' },
                { key: 'editorial', label: 'Editorial', icon: '📝' },
                { key: 'solutions', label: 'Solutions', icon: '💡' },
                { key: 'submissions', label: 'Submissions', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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
            <div className="flex-1 overflow-y-auto p-6">
              {renderTabContent()}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-1/2 bg-white flex flex-col">
            {/* Code Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">SQL Query</span>
                <select
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MySQL">MySQL</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="SQLite">SQLite</option>
                  <option value="SQL Server">SQL Server</option>
                </select>
                <span className="text-sm text-gray-500">Auto</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700" title="Settings">
                  <span className="text-lg">⚙️</span>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700" title="Fullscreen">
                  <span className="text-lg">↗️</span>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700" title="Reset">
                  <span className="text-lg">🔄</span>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700" title="Copy">
                  <span className="text-lg">📋</span>
                </button>
              </div>
            </div>

            {/* SQL Editor */}
            <div className="flex-1 flex flex-col">
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
                  className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none bg-gray-900 text-gray-100"
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
                {/* Line numbers could be added here */}
              </div>

              {/* Test Results Panel */}
              <div className="border-t border-gray-200">
                <div className="flex items-center justify-between p-3 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Query Result</span>
                    <span className="text-sm text-gray-500">Test Output</span>
                  </div>
                </div>
                <div className="p-4 bg-white min-h-[120px]">
                  {testResult ? (
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
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
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isRunning ? 'Running...' : 'Run SQL'}
                  </button>
                  <span className="text-sm text-gray-500">Ctrl + Enter</span>
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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