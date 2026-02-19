import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  dbReady: boolean;
}

const PlaygroundHeader: React.FC<Props> = ({ dbReady }) => {
  const navigate = useNavigate();
  const [isCompressed, setIsCompressed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompressed(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handlePracticeClick = () => {
    navigate('/practice');
  };
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-4 transition-all">
        <div
          className={`mx-auto transition-all ${
            isCompressed
              ? "max-w-[85%] w-[76%] rounded-2xl shadow-lg"
              : "max-w-full w-full"
          }`}
          style={{ background: "white" }}
        >
          <div className="flex justify-between items-center px-6 py-3 min-h-[64px]">
            {/* Logo */}
            <div className="flex items-center cursor-pointer">
              <span
                className="text-[#E67350] text-2xl font-bold"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                SQL Playground
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                className="text-[#555] px-3 py-1.5 text-sm font-medium hover:text-black transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Schema
              </button>
              <button
                onClick={handlePracticeClick}
                className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white px-4 py-1.5 text-sm font-medium rounded-lg hover:from-[#4F46E5] hover:to-[#4338CA] transition-all shadow-sm hover:shadow-md"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Practice
              </button>
              <button
                className="text-[#555] px-3 py-1.5 text-sm font-medium hover:text-black transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Tables
              </button>
              <button
                className="text-[#555] px-3 py-1.5 text-sm font-medium hover:text-black transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Documentation
              </button>
              <button
                className="text-[#555] px-3 py-1.5 text-sm font-medium hover:text-black transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Examples
              </button>
              <div className="flex items-center gap-2 ml-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    dbReady
                      ? "bg-black/5 text-black/80"
                      : "bg-[#E67350]/10 text-[#E67350]"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      dbReady ? "bg-black/40" : "bg-[#E67350] animate-pulse"
                    }`}
                  ></div>
                  <span>{dbReady ? "Ready" : "Loading..."}</span>
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 cursor-pointer"
              onClick={toggleDrawer}
            >
              {isDrawerOpen ? (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1099] md:hidden transition-opacity"
          onClick={toggleDrawer}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 w-[280px] h-full bg-white shadow-2xl z-[1100] transition-transform duration-300 md:hidden overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="mb-4 pb-4 border-b border-black/10">
            <span
              className="text-[#E67350] text-xl font-bold"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              SQL Playground
            </span>
          </div>
          <button
            className="w-full text-left px-4 py-3 text-base bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white hover:from-[#4F46E5] hover:to-[#4338CA] transition-all rounded-lg font-medium"
            style={{ fontFamily: "'Syne', sans-serif" }}
            onClick={() => {
              handlePracticeClick();
              toggleDrawer();
            }}
          >
            Practice
          </button>
          <button
            className="w-full text-left px-4 py-3 text-base text-[#333] hover:bg-black/5 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
            onClick={toggleDrawer}
          >
            Schema
          </button>
          <button
            className="w-full text-left px-4 py-3 text-base text-[#333] hover:bg-black/5 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
            onClick={toggleDrawer}
          >
            Tables
          </button>
          <button
            className="w-full text-left px-4 py-3 text-base text-[#333] hover:bg-black/5 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
            onClick={toggleDrawer}
          >
            Documentation
          </button>
          <button
            className="w-full text-left px-4 py-3 text-base text-[#333] hover:bg-black/5 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
            onClick={toggleDrawer}
          >
            Examples
          </button>
          <div className="border-t border-black/10 my-2"></div>
          <div className="px-4 py-3">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium ${
                dbReady
                  ? "bg-black/5 text-black/80"
                  : "bg-[#E67350]/10 text-[#E67350]"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  dbReady ? "bg-black/40" : "bg-[#E67350] animate-pulse"
                }`}
              ></div>
              <span>{dbReady ? "Database Ready" : "Loading Database..."}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaygroundHeader;
