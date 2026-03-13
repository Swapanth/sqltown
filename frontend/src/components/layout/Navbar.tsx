import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { interviewService, type AuthActivityResponse } from '../../services/interviewService';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthActivityOpen, setIsAuthActivityOpen] = useState(false);
  const [authActivity, setAuthActivity] = useState<AuthActivityResponse | null>(null);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchAuthActivity = async () => {
      if (!isAuthenticated) {
        setAuthActivity(null);
        return;
      }

      setIsActivityLoading(true);
      try {
        const response = await interviewService.getAuthActivity();
        if (!isCancelled) {
          setAuthActivity(response);
        }
      } catch (error) {
        console.error('Failed to fetch auth activity:', error);
      } finally {
        if (!isCancelled) {
          setIsActivityLoading(false);
        }
      }
    };

    fetchAuthActivity();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, location.pathname]);

  const navItems = [
    { path: '/dashboard', label: 'Gamezone' },
    { path: '/interview', label: 'Interview' },
    { path: '/practice', label: 'Practice' },
        { path: '/documentation', label: 'Docs'}
  ];

  const isActive = (path: string) => {
    if (path === '/documentation') {
      return location.pathname.startsWith('/documentation');
    }
    return location.pathname === path;
  };

  const lastLoginText = authActivity?.user?.last_login
    ? new Date(authActivity.user.last_login).toLocaleString()
    : 'No recent login';

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthActivityOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
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

              {isAuthenticated ? (
                <div className="relative ml-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthActivityOpen((open) => !open)}
                    className="relative rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:border-primary/40 hover:text-primary transition-colors"
                    title="Auth activity"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m5-3a8 8 0 11-16 0 8 8 0 0116 0z" />
                    </svg>
                    {!!authActivity && (
                      <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                        {authActivity.metrics.total_submissions}
                      </span>
                    )}
                  </button>

                  {isAuthActivityOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl z-50">
                      <div className="mb-3 border-b border-gray-100 pb-2">
                        <p className="text-sm font-semibold text-gray-900">Authentication Activity</p>
                        <p className="text-xs text-gray-500">Last login: {lastLoginText}</p>
                      </div>

                      {isActivityLoading ? (
                        <p className="text-xs text-gray-500">Loading activity...</p>
                      ) : authActivity ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Submissions</span>
                            <span className="font-semibold text-gray-900">{authActivity.metrics.total_submissions}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Accepted</span>
                            <span className="font-semibold text-emerald-600">{authActivity.metrics.accepted_submissions}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Discussion Posts</span>
                            <span className="font-semibold text-gray-900">{authActivity.metrics.discussion_posts}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Discussion Replies</span>
                            <span className="font-semibold text-gray-900">{authActivity.metrics.discussion_replies}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No activity data available.</p>
                      )}

                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{user?.name || 'User'}</p>
                          <p className="text-[11px] text-gray-500">{user?.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="ml-2 flex items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Sign up
                  </Link>
                </div>
              )}
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

            <div className="mt-2 border-t border-gray-100 pt-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
                    <div>Submissions: {authActivity?.metrics.total_submissions ?? 0}</div>
                    <div>Accepted: {authActivity?.metrics.accepted_submissions ?? 0}</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
