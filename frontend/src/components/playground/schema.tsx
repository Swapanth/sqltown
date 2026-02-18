import React, { useEffect, useState } from "react";
import { getTables, getTableSchema } from "./compiler";

interface Props {
  dbReady: boolean;
}

const Schema: React.FC<Props> = ({ dbReady }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [schema, setSchema] = useState<any[]>([]);

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

    const schemaData = getTableSchema(selectedTable);
    setSchema(schemaData);
  }, [selectedTable, dbReady]);

  if (!dbReady) {
    return <div className="p-4">Loading database...</div>;
  }

  if (!Array.isArray(schema)) {
    return <div className="p-4">No schema available.</div>;
  }

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

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Column</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Not Null</th>
            <th className="p-2 border">Primary Key</th>
          </tr>
        </thead>
        <tbody>
          {schema.map((col, i) => (
            <tr key={i}>
              <td className="p-2 border">{col[1]}</td>
              <td className="p-2 border">{col[2]}</td>
              <td className="p-2 border">{col[3] ? "YES" : "NO"}</td>
              <td className="p-2 border">{col[5] ? "YES" : "NO"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schema;
