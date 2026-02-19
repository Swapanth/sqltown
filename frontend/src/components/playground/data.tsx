import React, { useEffect, useState } from "react";
import { getTables, getTableData } from "./compiler";

interface Props {
  dbReady: boolean;
}

const Data: React.FC<Props> = ({ dbReady }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!dbReady) return;

    const tableList = getTables();
    setTables(tableList);

    if (tableList.length > 0) {
      setSelectedTable(tableList[0]);
    }
  }, [dbReady]);

  useEffect(() => {
    if (!dbReady || !selectedTable) return;

    const tableData = getTableData(selectedTable);
    setData(tableData);
  }, [selectedTable, dbReady]);

  if (!dbReady) {
    return <div className="p-4">Loading database...</div>;
  }

  if (!data || !data.columns || !data.values) {
    return <div className="p-4">No data available.</div>;
  }

  const { columns, values } = data;

  return (
    <div>
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {tables.map((table) => (
          <option key={table} value={table}>
            {table}
          </option>
        ))}
      </select>

      <div className="overflow-auto border rounded max-h-[400px]">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col: string, index: number) => (
                <th key={index} className="p-2 border text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {values.map((row: any[], i: number) => (
              <tr key={i}>
                {row.map((cell: any, j: number) => (
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
};

export default Data;
