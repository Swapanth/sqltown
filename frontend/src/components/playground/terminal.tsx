import React from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const Terminal: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="h-full w-full">
      <textarea
        className="w-full h-full resize-none outline-none p-4 font-mono text-sm bg-gray-50"
        placeholder="Write your SQL query here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Terminal;