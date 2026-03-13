import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Input } from '../../components/common';
import { fetchQuestions } from "../../services/questionService";
import { useAuth } from '../../context/AuthContext';
import { interviewService } from '../../services/interviewService';

interface Question {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies?: string[];
  acceptance: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

type NavItemId = 'overview' | 'practice' | 'tracks' | 'filters' | 'questions' | 'analytics';
type ActiveNavItemId = NavItemId;

interface NavChild {
  id: string;
  label: string;
  count?: number;
  arrow?: boolean;
}

interface NavItem {
  id: NavItemId;
  icon: string;
  label: string;
  children: NavChild[];
}

const InterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>('');
  const [selectedTrack, setSelectedTrack] = useState<string | null>('');
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<ActiveNavItemId>('overview');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof Question | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Column filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // ======================
// DASHBOARD CALCULATIONS
// ======================

const totalQuestions = questions.length;

const solvedQuestions = questions.filter(q => q.status === "completed");
const solvedCount = solvedQuestions.length;

const easyTotal = questions.filter(q => q.difficulty === "Easy").length;
const mediumTotal = questions.filter(q => q.difficulty === "Medium").length;
const hardTotal = questions.filter(q => q.difficulty === "Hard").length;

const easySolved = solvedQuestions.filter(q => q.difficulty === "Easy").length;
const mediumSolved = solvedQuestions.filter(q => q.difficulty === "Medium").length;
const hardSolved = solvedQuestions.filter(q => q.difficulty === "Hard").length;

const accuracy =
  totalQuestions > 0
    ? Math.round((solvedCount / totalQuestions) * 100)
    : 0;

// Topic performance
const topicPerformance: Record<string, number> = {};

solvedQuestions.forEach(q => {
  q.topics.forEach(topic => {
    topicPerformance[topic] = (topicPerformance[topic] || 0) + 1;
  });
});

const sortedTopics = Object.entries(topicPerformance)
  .sort((a, b) => b[1] - a[1]);

const strongTopics = sortedTopics.slice(0, 2).map(t => t[0]);
const weakTopics = sortedTopics.slice(-1).map(t => t[0]);

// Level logic
let level = "L1";
if (accuracy >= 70) level = "L2";
if (accuracy >= 85) level = "L3";

// Calculate average time (mock calculation based on solved questions)
const avgTime = solvedCount > 0 
  ? `${Math.floor(15 + Math.random() * 10)}m ${Math.floor(Math.random() * 60)}s`
  : "--";

// Calculate streak (mock - consecutive days with solved questions)
const streak = Math.min(solvedCount, 7); // Simple mock: capped at 7

  const allTopics = Array.from(new Set(questions.flatMap(q => q.topics || [])));
const allCompanies = Array.from(new Set(questions.flatMap(q => q.companies || [])));
  // Filter questions
  let filteredQuestions = questions.filter(q => {
  const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesTopic = !selectedTopic || q.topics.includes(selectedTopic);
  const matchesCompany = !selectedCompany || (q.companies && q.companies.includes(selectedCompany));
  const matchesDifficulty = !selectedDifficulty || q.difficulty === selectedDifficulty;
  const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
  const matchesDifficultyFilter = difficultyFilter === 'all' || q.difficulty === difficultyFilter;

  return matchesSearch && matchesTopic && matchesCompany && matchesDifficulty && matchesStatus && matchesDifficultyFilter;
});

useEffect(() => {
  let isCancelled = false;

  const loadQuestionsWithProgress = async () => {
    try {
      const data = await fetchQuestions();
      const baseQuestions: Question[] = data.map((q: any) => ({
        ...q,
        acceptance: q.acceptance ?? 75,
        status: 'not-started',
      }));

      if (!isAuthenticated) {
        if (!isCancelled) {
          setQuestions(baseQuestions);
        }
        return;
      }

      try {
        const summary = await interviewService.getSubmissionSummary();
        const completedSet = new Set<number>(summary.completed_question_ids || []);
        const attemptedSet = new Set<number>(summary.attempted_question_ids || []);

        const withUserProgress = baseQuestions.map((question) => {
          if (completedSet.has(question.id)) {
            return { ...question, status: 'completed' as const };
          }

          if (attemptedSet.has(question.id)) {
            return { ...question, status: 'in-progress' as const };
          }

          return question;
        });

        if (!isCancelled) {
          setQuestions(withUserProgress);
        }
      } catch (progressError) {
        console.error('Failed to load user progress summary:', progressError);
        if (!isCancelled) {
          setQuestions(baseQuestions);
        }
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      if (!isCancelled) {
        setQuestions([]);
      }
    }
  };

  loadQuestionsWithProgress();

  return () => {
    isCancelled = true;
  };
}, [isAuthenticated]);

  // Sort questions
  if (sortColumn) {
    filteredQuestions = [...filteredQuestions].sort((a, b) => {
      let aVal: any = a[sortColumn];
      let bVal: any = b[sortColumn];

      if (sortColumn === 'topics' || sortColumn === 'companies') {
        aVal = aVal?.join(', ') || '';
        bVal = bVal?.join(', ') || '';
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  const handleSort = (column: keyof Question) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'in-progress': return '◐';
      default: return '○';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      default: return 'text-gray-400';
    }
  };



  const sideNavItems: NavItem[] = [
    { 
      id: 'overview', 
      icon: '⌂', 
      label: 'Dashboard',
      children: []
    },
    { 
      id: 'practice', 
      icon: '◉', 
      label: 'Practice',
      children: [
        { id: 'sql-basics', label: 'SQL Basics', count: 45 },
        { id: 'joins', label: 'Joins & Relations', count: 32 },
        { id: 'aggregations', label: 'Aggregations', count: 28 },
        { id: 'window-functions', label: 'Window Functions', count: 19 }
      ]
    },
    { 
      id: 'tracks', 
      icon: '☰', 
      label: 'Learning Tracks',
      children: []
    },
    { 
      id: 'analytics', 
      icon: '◔', 
      label: 'Analytics',
      children: [
        { id: 'progress', label: 'Progress', arrow: true },
        { id: 'performance', label: 'Performance', arrow: true },
        { id: 'insights', label: 'Insights', arrow: true }
      ]
    },
    { 
      id: 'questions', 
      icon: '◈', 
      label: 'Question Bank',
      children: []
    }
  ];



  const getScrollTargetId = (itemId: NavItemId) => {
    if (itemId === 'practice') {
      return 'questions';
    }

    if (itemId === 'analytics') {
      return 'overview';
    }

    return itemId;
  };

  const handleSideNavClick = (sectionId: NavItemId) => {
    setActiveNavItem(sectionId);
    const el = document.getElementById(getScrollTargetId(sectionId));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavChildClick = (parentId: NavItemId, child: NavChild) => {
    if (parentId === 'practice') {
      const queryByChildId: Record<string, string> = {
        'sql-basics': 'select',
        joins: 'join',
        aggregations: 'group by',
        'window-functions': 'window',
      };

      setSearchQuery(queryByChildId[child.id] || child.label);
      setSelectedTrack('Practice');
      setCurrentPage(1);
      handleSideNavClick('questions');
      return;
    }

    if (parentId === 'analytics') {
      handleSideNavClick('overview');
      return;
    }

    handleSideNavClick(parentId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* LEFT NAV SIDEBAR */}
          <div className="hidden md:block">
            <div
              className={`relative flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 sticky top-28 ${
                isSideNavCollapsed ? 'w-16 items-center py-4' : 'w-64 px-4 py-4'
              }`}
            >
              {/* Logo / Avatar */}
              <div className={`flex items-center ${isSideNavCollapsed ? 'justify-center mb-6' : 'justify-between mb-6'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-sm font-semibold">
                    SQ
                  </div>
                  {!isSideNavCollapsed && (
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Interview mode</div>
                      <div className="text-[11px] text-gray-500">SQL preparation</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapse toggle */}
              <button
                onClick={() => setIsSideNavCollapsed(!isSideNavCollapsed)}
                className="absolute -right-4 top-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-orange-600 hover:border-orange-300 transition-colors"
                aria-label={isSideNavCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSideNavCollapsed ? '›' : '‹'}
              </button>

              {/* Nav items */}
              <nav className={`flex-1 flex flex-col gap-1 ${isSideNavCollapsed ? 'items-center' : ''}`}>
                {sideNavItems.map((item) => (
                  <div key={item.id}>
                    <div className="relative">
                      <button
                        onClick={() => {
                          handleSideNavClick(item.id);
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => {
                          // Only close if not moving to tooltip
                          setTimeout(() => {
                            if (hoveredItem === item.id) {
                              const tooltip = document.querySelector(`[data-tooltip="${item.id}"]`);
                              if (!tooltip?.matches(':hover')) {
                                setHoveredItem(null);
                              }
                            }
                          }, 100);
                        }}
                        className={`group flex items-center gap-3 rounded-xl transition-all duration-200 ${
                          isSideNavCollapsed ? 'justify-center w-10 h-10' : 'px-3 py-2.5 w-full'
                        } ${
                          activeNavItem === item.id
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {!isSideNavCollapsed && (
                          <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                        )}
                      </button>
                      
                      {/* Hover tooltip for collapsed sidebar */}
                      {isSideNavCollapsed && hoveredItem === item.id && (
                        <div 
                          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50"
                          data-tooltip={item.id}
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <div className="bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 min-w-44 py-2">
                            {/* Parent item label */}
                            <div className="text-sm font-medium px-3 pb-1.5">{item.label}</div>
                            
                            {/* Child items if they exist */}
                            {item.children.length > 0 && (
                              <div className="border-t border-gray-200 relative">
                                {/* Vertical connecting line */}
                                <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-300"></div>
                                
                                {item.children.map((child) => (
                                  <div key={child.id} className="relative">
                                    {/* Horizontal connecting line */}
                                    <div className="absolute left-5 top-1/2 w-3 h-px bg-gray-300"></div>
                                    
                                    <button
                                      onClick={() => {
                                        handleNavChildClick(item.id, child);
                                        setHoveredItem(null); // Close tooltip after click
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors ml-5"
                                    >
                                      <span className="font-medium">{child.label}</span>
                                      <div className="flex items-center gap-1.5">
                                     
                                        {'arrow' in child && child.arrow && (
                                          <span className="text-xs text-gray-500">›</span>
                                        )}
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Arrow pointer */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Child items - always visible when sidebar is expanded */}
                    {!isSideNavCollapsed && item.children.length > 0 && (
                      <div className="relative ml-6 mt-1 space-y-1">
                        {/* Vertical connecting line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                        
                        {item.children.map((child) => (
                          <div key={child.id} className="relative">
                            {/* Horizontal connecting line */}
                            <div className="absolute left-0 top-1/2 w-4 h-px bg-gray-300"></div>
                            
                            <button
                              onClick={() => handleNavChildClick(item.id, child)}
                              onMouseEnter={() => setHoveredItem(child.id)}
                              onMouseLeave={() => setHoveredItem(null)}
                              className="group flex items-center gap-3 rounded-xl transition-all duration-200 px-3 py-2 w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 ml-4"
                            >
                              <span className="text-sm font-medium flex-1 text-left">{child.label}</span>
                              <div className="flex items-center gap-2">
                                {'count' in child && child.count && (
                                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                    {child.count}
                                  </span>
                                )}
                                {'arrow' in child && child.arrow && (
                                  <span className="text-xs text-gray-400">→</span>
                                )}
                              </div>
                            </button>
                            
                            {/* Hover tooltip for child items */}
                            {hoveredItem === child.id && (
                              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50">
                                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                                  {child.label}
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Bottom mini status */}
              <div className={`mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 ${isSideNavCollapsed ? 'text-center px-1' : ''}`}>
                {!isSideNavCollapsed ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span>Streak</span>
                      <span className="font-semibold text-blue-600">7 🔥</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-1.5 bg-orange-500 w-1/2 rounded-full" />
                    </div>
                  </div>
                ) : (
                  <span>7 🔥</span>
                )}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 space-y-6">
        {/* ROW 1 — Progress + Readiness + Start Mock */}
        <div id="overview" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 — SQL Progress */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">SQL Interview Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Solved</span>
<span className="font-medium text-gray-800">
  {solvedCount} / {totalQuestions}
</span>                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(solvedCount / totalQuestions) * 100 || 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Easy</span>
                  <span className="font-medium text-gray-800">{easySolved} / {easyTotal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full"style={{ width: `${(easySolved / easyTotal) * 100 || 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Medium</span>
                  <span className="font-medium text-gray-800">{mediumSolved} / {mediumTotal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(mediumSolved / mediumTotal) * 100 || 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Hard</span>
                  <span className="font-medium text-gray-800">{hardSolved} / {hardTotal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(hardSolved / hardTotal) * 100 || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Interview + Planner Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Interview Readiness</h3>
              <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded">
{level}              </span>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="text-gray-500">Accuracy</div>
                <div className="font-semibold text-gray-800">{accuracy}%</div>
              </div>
              <div>
                <div className="text-gray-500">Avg Time</div>
                <div className="font-semibold text-gray-800">{avgTime}</div>
              </div>
              <div>
                <div className="text-gray-500">Streak</div>
                <div className="font-semibold text-blue-600">{streak} 🔥</div>
              </div>
            </div>

            {/* Strength / Weakness */}
            <div className="space-y-2">
              <div>
                <div className="text-[10px] font-medium text-gray-500 mb-1">Strong</div>
                <div className="flex flex-wrap gap-1">
                  {strongTopics.map(topic => (
  <span
    key={topic}
    className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium"
  >
    {topic}
  </span>
))}
{weakTopics.map(topic => (
  <span
    key={topic}
    className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-medium"
  >
    {topic}
  </span>
))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-medium text-gray-500 mb-1">Weak</div>
                <div className="flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-medium">
                    Window Fn
                  </span>
                </div>
              </div>
            </div>

            {/* Planner */}
            <div className="border-t border-gray-100 pt-3 space-y-2">

              {/* Top row */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Today • 1 / 2</span>
                <button className="text-[11px] font-medium text-[#E67350] hover:underline">
                  Daily Planner
                </button>
              </div>

              {/* Progress */}
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-[#E67350] h-1 rounded-full" style={{ width: "50%" }} />
              </div>

              {/* Goal */}
              <div className="text-[11px] text-gray-600">
                Complete 2 SQL problems
              </div>

            </div>
          </div>

          {/* Card 3 — Start Mock Interview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Start Mock Interview</h3>
            <p className="text-sm text-gray-600 mb-5">3 questions • 45 min • Mixed difficulty</p>
            <button className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <span>▶</span>
              <span>Start Now</span>
            </button>
          </div>
        </div>

        {/* ROW 2 — Interview Tracks */}
        <div id="tracks" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(() => {
            const trackDefinitions = [
              {
                title: "Zero → 100 SQL",
                focus: "Basics",
                topics: ["SELECT", "WHERE", "ORDER BY"]
              },
              {
                title: "Aggregation Mastery",
                focus: "GROUP BY",
                topics: ["GROUP BY", "COUNT", "AVG", "SUM", "MAX", "MIN"]
              },
              {
                title: "Advanced SQL",
                focus: "Complex",
                topics: ["JOIN", "Window Functions", "Subquery", "CTE"]
              },
              {
                title: "Performance & Optimization",
                focus: "Advanced",
                topics: ["INDEX", "EXPLAIN", "OPTIMIZE"]
              }
            ];

            const trackStats = trackDefinitions.map(track => {
              const trackQuestions = questions.filter(q =>
                q.topics.some(t => track.topics.some(tt => t.toLowerCase().includes(tt.toLowerCase())))
              );

              const trackSolved = trackQuestions.filter(q => q.status === "completed");

              return {
                ...track,
                progress: trackSolved.length,
                total: Math.max(trackQuestions.length, 1) // Ensure at least 1 to avoid division by zero
              };
            });

            return trackStats.map((track, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                <h4 className="text-base font-semibold text-gray-800 mb-2">{track.title}</h4>
                <p className="text-xs text-gray-600 mb-3">{track.focus}</p>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                    <span>Progress</span>
                    <span className="font-medium text-gray-800">{track.progress} / {track.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-orange-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${(track.progress / track.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>

        {/* ROW 3 — Filters + Search + Active Context */}
        <div id="filters" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Left: Dropdowns */}
            <div className="flex flex-wrap gap-3 flex-1">
              <select
                value={selectedTopic || ''}
                onChange={(e) => setSelectedTopic(e.target.value || null)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Topics</option>
                {allTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              <select
                value={selectedCompany || ''}
                onChange={(e) => setSelectedCompany(e.target.value || null)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Companies</option>
                {allCompanies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty || ''}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Medium+">Medium+</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Right: Search */}
            <div className="lg:w-80">
              <Input
                type="text"
                placeholder="Search SQL questions…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Active Context Chips */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            {selectedTrack && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                Track: {selectedTrack}
                <button
                  onClick={() => setSelectedTrack(null)}
                  className="hover:text-orange-900"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedDifficulty && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                Difficulty: {selectedDifficulty}
                <button
                  onClick={() => setSelectedDifficulty(null)}
                  className="hover:text-orange-900"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedTopic && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                Topic: {selectedTopic}
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="hover:text-orange-900"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>



        {/* Main Content */}
        <div id="questions" className="w-full">
          {/* Question List Table */}
          <div>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Question List
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length}
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 text-sm border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSort('status')}
                              className="text-xs font-semibold text-gray-700 hover:text-orange-600 transition-colors flex items-center gap-1"
                            >
                              Status
                              {sortColumn === 'status' && (
                                <span className="text-orange-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </button>
                            <select
                              value={statusFilter}
                              onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                              }}
                              className="ml-2 px-2 py-1 text-xs border border-gray-200 rounded text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="all">All</option>
                              <option value="not-started">Not Started</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('title')}
                            className="text-xs font-semibold text-gray-700 hover:text-orange-600 transition-colors flex items-center gap-1"
                          >
                            Title
                            {sortColumn === 'title' && (
                              <span className="text-orange-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSort('difficulty')}
                              className="text-xs font-semibold text-gray-700 hover:text-orange-600 transition-colors flex items-center gap-1"
                            >
                              Difficulty
                              {sortColumn === 'difficulty' && (
                                <span className="text-orange-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </button>
                            <select
                              value={difficultyFilter}
                              onChange={(e) => {
                                setDifficultyFilter(e.target.value);
                                setCurrentPage(1);
                              }}
                              className="ml-2 px-2 py-1 text-xs border border-gray-200 rounded text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="all">All</option>
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('topics')}
                            className="text-xs font-semibold text-gray-700 hover:text-orange-600 transition-colors flex items-center gap-1"
                          >
                            Topics
                            {sortColumn === 'topics' && (
                              <span className="text-orange-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('companies')}
                            className="text-xs font-semibold text-gray-700 hover:text-orange-600 transition-colors flex items-center gap-1"
                          >
                            Companies
                            {sortColumn === 'companies' && (
                              <span className="text-orange-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('acceptance')}
                            className="text-xs font-semibold text-gray-700 hover:text-orange-600 transition-colors flex items-center gap-1"
                          >
                            Acceptance
                            {sortColumn === 'acceptance' && (
                              <span className="text-orange-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedQuestions.length > 0 ? (
                        paginatedQuestions.map((question) => (
                          <tr
                            key={question.id}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/interview/problem/${question.id}`)}
                          >
                            <td className="px-4 py-3">
                              <span className={`text-base font-medium ${getStatusColor(question.status)}`}>
                                {getStatusIcon(question.status)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors">
                                {question.id}. {question.title}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {question.topics.slice(0, 2).map(topic => (
                                  <span
                                    key={topic}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                                  >
                                    {topic}
                                  </span>
                                ))}
                                {question.topics.length > 2 && (
                                  <span className="px-2 py-0.5 text-gray-500 text-xs">
                                    +{question.topics.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-gray-600">
                                {question.companies && question.companies.length > 0
                                  ? question.companies.slice(0, 2).join(', ') + (question.companies.length > 2 ? '...' : '')
                                  : '-'}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-700">
                                {question.acceptance}%
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                            No questions found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${currentPage === pageNum
                                ? 'bg-orange-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
