import React, { useState } from "react";

interface QueryTemplate {
  category: string;
  name: string;
  description: string;
  query: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const QueryLibrary: React.FC<{ onView?: () => void; dbId?: string }> = ({ onView, dbId }) => {
  const isFullscreen = !onView;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copied, setCopied] = useState<number | null>(null);

  const queryTemplates: QueryTemplate[] = [
    {
      category: "Basic",
      name: "Select All Records",
      description: "Retrieve all columns from a table",
      query: "SELECT * FROM Customers LIMIT 10;",
      difficulty: "Easy",
    },
    {
      category: "Basic",
      name: "Filter with WHERE",
      description: "Filter records based on conditions",
      query: "SELECT * FROM Restaurants WHERE rating > 4.0;",
      difficulty: "Easy",
    },
    {
      category: "Aggregation",
      name: "Count Records",
      description: "Count total number of records",
      query: "SELECT COUNT(*) as total FROM Orders;",
      difficulty: "Easy",
    },
    {
      category: "Aggregation",
      name: "Group By with Count",
      description: "Count records grouped by category",
      query: "SELECT category, COUNT(*) as count\nFROM MenuItems\nGROUP BY category;",
      difficulty: "Medium",
    },
    {
      category: "Aggregation",
      name: "Average Calculation",
      description: "Calculate average rating",
      query: "SELECT AVG(rating) as avg_rating FROM Restaurants;",
      difficulty: "Easy",
    },
    {
      category: "Join",
      name: "Inner Join Two Tables",
      description: "Join orders with customers",
      query: "SELECT o.*, c.first_name, c.last_name\nFROM Orders o\nJOIN Customers c ON o.customer_id = c.customer_id;",
      difficulty: "Medium",
    },
    {
      category: "Join",
      name: "Multiple Joins",
      description: "Join orders with customers and restaurants",
      query: "SELECT o.order_id, c.first_name, r.name as restaurant\nFROM Orders o\nJOIN Customers c ON o.customer_id = c.customer_id\nJOIN Restaurants r ON o.restaurant_id = r.restaurant_id;",
      difficulty: "Hard",
    },
    {
      category: "Subquery",
      name: "Subquery in WHERE",
      description: "Find customers with orders above average",
      query: "SELECT * FROM Customers\nWHERE customer_id IN (\n  SELECT customer_id FROM Orders\n  WHERE total_amount > (SELECT AVG(total_amount) FROM Orders)\n);",
      difficulty: "Hard",
    },
    {
      category: "Sorting",
      name: "Order By Single Column",
      description: "Sort results by rating",
      query: "SELECT * FROM Restaurants\nORDER BY rating DESC;",
      difficulty: "Easy",
    },
    {
      category: "Sorting",
      name: "Order By Multiple Columns",
      description: "Sort by category and price",
      query: "SELECT * FROM MenuItems\nORDER BY category ASC, price DESC;",
      difficulty: "Medium",
    },
    {
      category: "Advanced",
      name: "Window Function",
      description: "Rank restaurants by rating",
      query: "SELECT name, rating,\n  RANK() OVER (ORDER BY rating DESC) as rank\nFROM Restaurants;",
      difficulty: "Hard",
    },
    {
      category: "Advanced",
      name: "Common Table Expression",
      description: "Use CTE for complex queries",
      query: "WITH HighValueOrders AS (\n  SELECT * FROM Orders WHERE total_amount > 100\n)\nSELECT * FROM HighValueOrders\nORDER BY total_amount DESC;",
      difficulty: "Hard",
    },
  ];

  const categories = ["All", ...Array.from(new Set(queryTemplates.map((q) => q.category)))];

  const filteredQueries =
    selectedCategory === "All"
      ? queryTemplates
      : queryTemplates.filter((q) => q.category === selectedCategory);

  const copyQuery = (query: string, index: number) => {
    navigator.clipboard.writeText(query);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-xs text-gray-800"> Query Library</h3>
        {onView && (
          <button 
            onClick={onView} 
            className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        )}
      </div>

      {/* Query Templates */}
      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {filteredQueries.slice(0, 2).map((template, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-1.5 hover:border-orange-300 transition-colors">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <h4 className="text-xs font-semibold text-gray-800 truncate">{template.name}</h4>
                  <span
                    className={`text-xs px-1 py-0.5 rounded font-medium ${getDifficultyColor(
                      template.difficulty
                    )}`}
                  >
                    {template.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1">{template.description}</p>
              </div>
              <button
                onClick={() => copyQuery(template.query, i)}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium ml-2 transition-colors flex-shrink-0"
              >
                {copied === i ? "✓" : "Copy"}
              </button>
            </div>
            <pre className="text-xs bg-gray-900 text-green-400 p-1.5 rounded overflow-x-auto font-mono max-h-12">
              {template.query.split('\n')[0]}...
            </pre>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Click View All to see {queryTemplates.length} templates
      </p>
    </div>
  );
};

export default QueryLibrary;
