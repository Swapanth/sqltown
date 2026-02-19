import React from "react";

interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  executionTime?: string;
}

interface Props {
  result: QueryResult | null;
}




const Output: React.FC<{ result: any }> = ({ result }) => {
  if (!result) {
    return (
      <div className="text-gray-400 p-10 text-center">
        👉 Write a query and click Run to see results
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="text-red-600 bg-red-100 p-4 rounded">
        ❌ {result.error}
      </div>
    );
  }

  if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
    return (
      <div className="text-green-600 bg-green-100 p-4 rounded">
        ✅ Query executed successfully.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {result.data.map((table: any, index: number) => {
        // SQL.js uses 'lc' for columns, not 'columns'
        if (!table || !table.lc || !table.values) return null;

        const columns = table.lc; // Extract columns from 'lc' property

        return (
          <div key={index}>
            <div className="text-sm text-gray-500 mb-2">
              Result {index + 1} • {table.values.length} rows •{" "}
              {result.executionTime}
            </div>

            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col: string, i: number) => (
                      <th key={i} className="p-2 border text-left">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {table.values.map((row: any[], i: number) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="p-2 border">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Output;
