import React from "react";

interface Props {
  onRun: () => void;
  onReset: () => void;
  onFormat: () => void;
  disabled?: boolean;
}


const Toolbar: React.FC<Props> = ({ onRun, onReset, onFormat, disabled }) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
      <button
        onClick={onReset}
        className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
      >
        ⟳ Reset
      </button>

      <div className="flex gap-3">
        <button
          onClick={onFormat}
          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
        >
          ✨ Format
        </button>

       <button
         onClick={onRun}
        disabled={disabled}
         className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
         data-testid="run-button"
       >
         ▶ Run
       </button>  
      </div>
    </div>
  );
};

export default Toolbar;
