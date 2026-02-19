import React from "react";

interface Props {
  onRun: () => void;
  onReset: () => void;
  onFormat: () => void;
  disabled?: boolean;
}


const Toolbar: React.FC<Props> = ({ onRun, onReset, onFormat, disabled }) => {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onReset}
        className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md text-sm font-medium transition-all"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        ⟳ Reset
      </button>

      <div className="flex gap-3">
        <button
          onClick={onFormat}
          className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md text-sm font-medium transition-all"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          ✨ Format
        </button>

       <button
         onClick={onRun}
        disabled={disabled}
         className="bg-[#E67350] hover:bg-[#d4633c] text-white px-6 py-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all shadow-sm hover:shadow-md disabled:hover:shadow-sm"
         data-testid="run-button"
         style={{ fontFamily: "'Syne', sans-serif" }}
       >
         ▶ Run Query
       </button>  
      </div>
    </div>
  );
};

export default Toolbar;
