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
      <div className="text-black/40 p-12 text-center">
        <div className="text-4xl mb-3">👉</div>
        <p className="text-base" style={{ fontFamily: "'Syne', sans-serif" }}>
          Write a query and click Run to see results
        </p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="bg-[#FF5F57]/10 border border-[#FF5F57]/20 text-[#FF5F57] p-5 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">❌</span>
          <span className="font-medium" style={{ fontFamily: "'Syne', sans-serif" }}>
            {result.error}
          </span>
        </div>
      </div>
    );
  }

  if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
    return (
      <div className="bg-[#28C840]/10 border border-[#28C840]/20 text-[#28C840] p-5 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span className="font-medium" style={{ fontFamily: "'Syne', sans-serif" }}>
            Query executed successfully.
          </span>
        </div>
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
          <div key={index} className="space-y-3">
            <div className="text-sm text-black/60 flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              <span className="font-medium text-black/80">Result {index + 1}</span>
              <span>•</span>
              <span>{table.values.length} rows</span>
              <span>•</span>
              <span className="font-mono text-xs bg-black/5 px-2 py-0.5 rounded" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {result.executionTime}
              </span>
            </div>

            <div className="overflow-auto border border-black/10 rounded-lg shadow-sm">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-black/5">
                  <tr>
                    {columns.map((col: string, i: number) => (
                      <th 
                        key={i} 
                        className="px-4 py-3 border-b border-black/10 text-left font-semibold text-black/80"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {table.values.map((row: any[], i: number) => (
                    <tr key={i} className="hover:bg-black/2 transition-colors">
                      {row.map((cell, j) => (
                        <td 
                          key={j} 
                          className="px-4 py-3 border-b border-black/5 text-black/70"
                          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}
                        >
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
