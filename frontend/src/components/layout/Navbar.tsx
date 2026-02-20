import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/interview', label: 'Interview' },
    { path: '/documentation', label: 'Documentation' },
    { path: '/playground', label: 'Playground' },
  ];

  const isActive = (path: string) => {
    if (path === '/documentation') {
      return location.pathname.startsWith('/documentation');
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 pt-4 transition-all duration-300">
        <div
          className={`mx-auto transition-all duration-300 ${
            isScrolled
              ? 'max-w-[85%] w-[76%] rounded-2xl shadow-lg bg-white'
              : 'max-w-full w-full bg-white'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3 min-h-[64px]">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <span className="text-primary text-2xl font-bold transition-transform group-hover:scale-105">
                SQLTown
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-primary'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive(item.path) && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>
                  )}
                  <span className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-200 -z-0"></span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
