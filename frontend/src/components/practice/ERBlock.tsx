import React, { useEffect, useState } from "react";
import { getTables, initializeDatabase } from "../playground/compiler";

const ERBlock: React.FC<{ onView?: () => void; dbId?: string; onInteractiveView?: () => void }> = ({ onView, dbId, onInteractiveView }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 10;
    
    const loadTables = async () => {
      try {
        console.log('🔍 ERBlock: Starting to load tables for dbId:', dbId);
        setIsLoading(true);
        
        // Wait for database initialization to complete
        console.log('⏳ ERBlock: Waiting for database initialization...');
        await initializeDatabase(dbId);
        
        // Retry logic to wait for tables to be available
        while (isMounted && retryCount < maxRetries) {
          console.log(`✓ ERBlock: Attempt ${retryCount + 1} - Fetching tables...`);
          const tableList = await getTables(dbId);
          
          if (tableList && tableList.length > 0) {
            console.log('✅ ERBlock: Loaded tables:', tableList);
            if (isMounted) {
              setTables(tableList);
              setIsLoading(false);
            }
            return;
          }
          
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`⏳ ERBlock: No tables found, retrying in 500ms... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        // If we get here, no tables were found after all retries
        console.log('⚠️ ERBlock: No tables found after retries');
        if (isMounted) {
          setTables([]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("❌ ERBlock: Failed to load tables:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadTables();
    
    return () => {
      isMounted = false;
    };
  }, [dbId]);

  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-xs text-gray-800">ER Diagram</h3>
        <div className="flex gap-1">
          {onInteractiveView && (
            <button 
              onClick={onInteractiveView} 
              className="text-xs text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 font-medium transition-all flex items-center gap-1 px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105"
              title="Interactive Designer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="font-semibold">Design</span>
            </button>
          )}
          {onView && (
            <button 
              onClick={onView} 
              className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
              title="View Full Diagram"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-100 text-center overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-xs text-gray-500">Loading tables...</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-600 mb-1.5">Database Structure</p>
            {tables.length > 0 ? (
              <div className="flex flex-wrap gap-1 justify-center mb-1.5 overflow-y-auto mb-1.5">
                {tables.slice(0, 6).map((table) => (
                  <div
                    key={table}
                    className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium"
                  >
                    {table}
                  </div>
                ))}
                {tables.length > 6 && (
                  <div className="text-xs text-gray-500">+{tables.length - 6} more</div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-2">No tables available</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Click View Full for complete diagram
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ERBlock;
