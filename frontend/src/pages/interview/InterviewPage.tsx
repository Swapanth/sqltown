import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Input } from '../../components/common';

interface Question {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies?: string[];
  acceptance: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

export const mockQuestions: Question[] = [
  { id: 1, title: 'Find the top 3 customers by total order value', difficulty: 'Easy', topics: ['JOIN', 'GROUP BY', 'ORDER BY'], companies: ['Google', 'Amazon'], acceptance: 78.5, status: 'completed' },
  { id: 2, title: 'Calculate running total of sales by month', difficulty: 'Medium', topics: ['Window Functions', 'Aggregation'], companies: ['Microsoft', 'Meta'], acceptance: 65.2, status: 'in-progress' },
  { id: 3, title: 'Find employees who earn more than their managers', difficulty: 'Medium', topics: ['Self JOIN', 'Subquery'], companies: ['Apple', 'Netflix'], acceptance: 58.9, status: 'not-started' },
  { id: 4, title: 'Rank products by sales within each category', difficulty: 'Hard', topics: ['Window Functions', 'RANK', 'PARTITION BY'], companies: ['Google', 'Amazon', 'Microsoft'], acceptance: 42.3, status: 'not-started' },
  { id: 5, title: 'Find duplicate email addresses', difficulty: 'Easy', topics: ['GROUP BY', 'HAVING'], companies: ['Meta'], acceptance: 82.1, status: 'completed' },
  { id: 6, title: 'Calculate percentage of total sales per region', difficulty: 'Medium', topics: ['Window Functions', 'Aggregation'], companies: ['Amazon', 'Apple'], acceptance: 71.4, status: 'not-started' },

  { id: 7, title: 'Find customers who never placed an order', difficulty: 'Easy', topics: ['LEFT JOIN', 'NULL'], companies: ['Google'], acceptance: 79.2, status: 'not-started' },
  { id: 8, title: 'Get the second highest salary', difficulty: 'Easy', topics: ['ORDER BY', 'LIMIT'], companies: ['Amazon'], acceptance: 84.6, status: 'completed' },
  { id: 9, title: 'Find the highest paid employee in each department', difficulty: 'Medium', topics: ['GROUP BY', 'MAX', 'JOIN'], companies: ['Microsoft'], acceptance: 69.1, status: 'not-started' },
  { id: 10, title: 'Count orders per customer per year', difficulty: 'Easy', topics: ['GROUP BY', 'YEAR'], companies: ['Meta'], acceptance: 80.4, status: 'completed' },

  { id: 11, title: 'Find products never sold', difficulty: 'Easy', topics: ['LEFT JOIN', 'NULL'], companies: ['Amazon'], acceptance: 77.5, status: 'not-started' },
  { id: 12, title: 'Average salary by department', difficulty: 'Easy', topics: ['GROUP BY', 'AVG'], companies: ['Google'], acceptance: 88.2, status: 'completed' },
  { id: 13, title: 'Top selling product per category', difficulty: 'Medium', topics: ['GROUP BY', 'MAX', 'JOIN'], companies: ['Amazon'], acceptance: 64.3, status: 'not-started' },
  { id: 14, title: 'Employees hired in last 6 months', difficulty: 'Easy', topics: ['DATE', 'WHERE'], companies: ['Meta'], acceptance: 85.1, status: 'completed' },
  { id: 15, title: 'Find customers with more than 5 orders', difficulty: 'Easy', topics: ['GROUP BY', 'HAVING'], companies: ['Google'], acceptance: 83.7, status: 'completed' },

  { id: 16, title: 'Running total per customer', difficulty: 'Medium', topics: ['Window Functions', 'PARTITION'], companies: ['Microsoft'], acceptance: 60.2, status: 'not-started' },
  { id: 17, title: 'Dense rank employees by salary', difficulty: 'Medium', topics: ['DENSE_RANK', 'Window'], companies: ['Amazon'], acceptance: 62.8, status: 'not-started' },
  { id: 18, title: 'Monthly revenue growth rate', difficulty: 'Hard', topics: ['LAG', 'Window'], companies: ['Netflix'], acceptance: 45.3, status: 'not-started' },
  { id: 19, title: 'Customers with consecutive orders', difficulty: 'Hard', topics: ['Window', 'LAG'], companies: ['Meta'], acceptance: 40.7, status: 'not-started' },
  { id: 20, title: 'Find gaps in order dates', difficulty: 'Hard', topics: ['LEAD', 'Window'], companies: ['Amazon'], acceptance: 39.9, status: 'not-started' },

  { id: 21, title: 'Total sales per day', difficulty: 'Easy', topics: ['GROUP BY'], companies: ['Google'], acceptance: 90.2, status: 'completed' },
  { id: 22, title: 'Top 5 products by revenue', difficulty: 'Easy', topics: ['ORDER BY', 'LIMIT'], companies: ['Amazon'], acceptance: 86.9, status: 'completed' },
  { id: 23, title: 'Customers with highest single order', difficulty: 'Medium', topics: ['MAX', 'JOIN'], companies: ['Meta'], acceptance: 66.2, status: 'not-started' },
  { id: 24, title: 'Department with highest avg salary', difficulty: 'Medium', topics: ['GROUP BY', 'AVG'], companies: ['Microsoft'], acceptance: 63.5, status: 'not-started' },
  { id: 25, title: 'Find duplicate phone numbers', difficulty: 'Easy', topics: ['GROUP BY', 'HAVING'], companies: ['Google'], acceptance: 82.9, status: 'completed' },

  { id: 26, title: 'Find customers with orders in every month', difficulty: 'Hard', topics: ['GROUP BY', 'COUNT DISTINCT'], companies: ['Amazon'], acceptance: 41.5, status: 'not-started' },
  { id: 27, title: 'Employees with same salary', difficulty: 'Easy', topics: ['SELF JOIN'], companies: ['Meta'], acceptance: 79.6, status: 'completed' },
  { id: 28, title: 'Median salary', difficulty: 'Hard', topics: ['Window', 'Percentile'], companies: ['Netflix'], acceptance: 37.4, status: 'not-started' },
  { id: 29, title: 'Nth highest salary', difficulty: 'Medium', topics: ['ORDER', 'LIMIT'], companies: ['Amazon'], acceptance: 70.3, status: 'not-started' },
  { id: 30, title: 'Sales per quarter', difficulty: 'Easy', topics: ['DATE', 'GROUP'], companies: ['Google'], acceptance: 87.1, status: 'completed' },

  { id: 31, title: 'Top customer per region', difficulty: 'Medium', topics: ['GROUP', 'JOIN'], companies: ['Amazon'], acceptance: 67.8, status: 'not-started' },
  { id: 32, title: 'Lowest salary per department', difficulty: 'Easy', topics: ['MIN', 'GROUP'], companies: ['Meta'], acceptance: 84.5, status: 'completed' },
  { id: 33, title: 'Customers with no activity 1 year', difficulty: 'Medium', topics: ['DATE', 'JOIN'], companies: ['Netflix'], acceptance: 61.9, status: 'not-started' },
  { id: 34, title: 'Average order value per customer', difficulty: 'Easy', topics: ['AVG', 'GROUP'], companies: ['Amazon'], acceptance: 88.8, status: 'completed' },
  { id: 35, title: 'Employees older than manager', difficulty: 'Medium', topics: ['SELF JOIN'], companies: ['Google'], acceptance: 65.9, status: 'not-started' },

  { id: 36, title: 'Top 3 salaries per department', difficulty: 'Hard', topics: ['RANK', 'Window'], companies: ['Microsoft'], acceptance: 43.6, status: 'not-started' },
  { id: 37, title: 'Rolling 7 day revenue', difficulty: 'Hard', topics: ['Window'], companies: ['Amazon'], acceptance: 39.2, status: 'not-started' },
  { id: 38, title: 'Customers with increasing purchases', difficulty: 'Hard', topics: ['LAG'], companies: ['Meta'], acceptance: 36.8, status: 'not-started' },
  { id: 39, title: 'Daily active users', difficulty: 'Easy', topics: ['COUNT', 'DATE'], companies: ['Google'], acceptance: 91.3, status: 'completed' },
  { id: 40, title: 'Monthly active users', difficulty: 'Easy', topics: ['COUNT', 'DATE'], companies: ['Meta'], acceptance: 90.4, status: 'completed' },

  { id: 41, title: 'Churned customers', difficulty: 'Medium', topics: ['DATE', 'JOIN'], companies: ['Netflix'], acceptance: 62.7, status: 'not-started' },
  { id: 42, title: 'First order date per customer', difficulty: 'Easy', topics: ['MIN', 'GROUP'], companies: ['Amazon'], acceptance: 89.5, status: 'completed' },
  { id: 43, title: 'Last login per user', difficulty: 'Easy', topics: ['MAX', 'GROUP'], companies: ['Google'], acceptance: 92.2, status: 'completed' },
  { id: 44, title: 'Users with multiple devices', difficulty: 'Medium', topics: ['COUNT', 'GROUP'], companies: ['Meta'], acceptance: 68.4, status: 'not-started' },
  { id: 45, title: 'Revenue by country', difficulty: 'Easy', topics: ['GROUP'], companies: ['Amazon'], acceptance: 87.9, status: 'completed' },

  { id: 46, title: 'Top category per region', difficulty: 'Medium', topics: ['GROUP', 'JOIN'], companies: ['Google'], acceptance: 64.1, status: 'not-started' },
  { id: 47, title: 'User retention cohorts', difficulty: 'Hard', topics: ['Window', 'DATE'], companies: ['Meta'], acceptance: 35.9, status: 'not-started' },
  { id: 48, title: 'Average session duration', difficulty: 'Easy', topics: ['AVG'], companies: ['Netflix'], acceptance: 88.6, status: 'completed' },
  { id: 49, title: 'Peak traffic hour', difficulty: 'Medium', topics: ['GROUP', 'DATE'], companies: ['Google'], acceptance: 69.3, status: 'not-started' },
  { id: 50, title: 'Orders above avg value', difficulty: 'Medium', topics: ['Subquery'], companies: ['Amazon'], acceptance: 72.6, status: 'not-started' },

  { id: 51, title: 'Employees hired per year', difficulty: 'Easy', topics: ['GROUP', 'DATE'], companies: ['Microsoft'], acceptance: 89.1, status: 'completed' },
  { id: 52, title: 'Most common salary', difficulty: 'Medium', topics: ['GROUP'], companies: ['Meta'], acceptance: 63.2, status: 'not-started' },
  { id: 53, title: 'Revenue cumulative sum', difficulty: 'Medium', topics: ['Window'], companies: ['Amazon'], acceptance: 67.5, status: 'not-started' },
  { id: 54, title: 'Sales rank by month', difficulty: 'Medium', topics: ['RANK'], companies: ['Google'], acceptance: 66.8, status: 'not-started' },
  { id: 55, title: 'Top referrer per user', difficulty: 'Hard', topics: ['Window'], companies: ['Meta'], acceptance: 41.2, status: 'not-started' },

  { id: 56, title: 'Orders per weekday', difficulty: 'Easy', topics: ['GROUP', 'DATE'], companies: ['Amazon'], acceptance: 90.8, status: 'completed' },
  { id: 57, title: 'Revenue per device type', difficulty: 'Easy', topics: ['GROUP'], companies: ['Google'], acceptance: 88.4, status: 'completed' },
  { id: 58, title: 'Most popular product per month', difficulty: 'Medium', topics: ['GROUP'], companies: ['Meta'], acceptance: 65.7, status: 'not-started' },
  { id: 59, title: 'Users with no purchases', difficulty: 'Easy', topics: ['LEFT JOIN'], companies: ['Amazon'], acceptance: 85.9, status: 'completed' },
  { id: 60, title: 'Revenue change MoM', difficulty: 'Medium', topics: ['LAG'], companies: ['Netflix'], acceptance: 61.3, status: 'not-started' },

  { id: 61, title: 'Top city per country', difficulty: 'Medium', topics: ['GROUP'], companies: ['Google'], acceptance: 63.9, status: 'not-started' },
  { id: 62, title: 'Customers with refunds', difficulty: 'Easy', topics: ['JOIN'], companies: ['Amazon'], acceptance: 87.6, status: 'completed' },
  { id: 63, title: 'Refund rate per product', difficulty: 'Medium', topics: ['GROUP'], companies: ['Meta'], acceptance: 64.7, status: 'not-started' },
  { id: 64, title: 'Longest active user streak', difficulty: 'Hard', topics: ['Window'], companies: ['Netflix'], acceptance: 38.6, status: 'not-started' },
  { id: 65, title: 'Average basket size', difficulty: 'Easy', topics: ['AVG'], companies: ['Amazon'], acceptance: 89.7, status: 'completed' },

  { id: 66, title: 'Products bought together', difficulty: 'Hard', topics: ['SELF JOIN'], companies: ['Google'], acceptance: 44.9, status: 'not-started' },
  { id: 67, title: 'User lifetime value', difficulty: 'Hard', topics: ['Window'], companies: ['Meta'], acceptance: 40.2, status: 'not-started' },
  { id: 68, title: 'Repeat purchase rate', difficulty: 'Medium', topics: ['GROUP'], companies: ['Amazon'], acceptance: 69.8, status: 'not-started' },
  { id: 69, title: 'Top search keyword', difficulty: 'Easy', topics: ['COUNT'], companies: ['Google'], acceptance: 92.7, status: 'completed' },
  { id: 70, title: 'Click through rate', difficulty: 'Medium', topics: ['CASE'], companies: ['Meta'], acceptance: 66.1, status: 'not-started' },

  { id: 71, title: 'Ad impressions per campaign', difficulty: 'Easy', topics: ['GROUP'], companies: ['Google'], acceptance: 91.5, status: 'completed' },
  { id: 72, title: 'Top campaign by ROI', difficulty: 'Hard', topics: ['Window'], companies: ['Meta'], acceptance: 42.7, status: 'not-started' },
  { id: 73, title: 'Avg delivery time', difficulty: 'Easy', topics: ['AVG'], companies: ['Amazon'], acceptance: 88.3, status: 'completed' },
  { id: 74, title: 'Delayed orders rate', difficulty: 'Medium', topics: ['CASE'], companies: ['Amazon'], acceptance: 67.2, status: 'not-started' },
  { id: 75, title: 'Top warehouse by volume', difficulty: 'Medium', topics: ['GROUP'], companies: ['Amazon'], acceptance: 65.4, status: 'not-started' },

  { id: 76, title: 'Stockout frequency', difficulty: 'Medium', topics: ['GROUP'], companies: ['Amazon'], acceptance: 63.7, status: 'not-started' },
  { id: 77, title: 'Supplier lead time', difficulty: 'Medium', topics: ['AVG'], companies: ['Amazon'], acceptance: 64.5, status: 'not-started' },
  { id: 78, title: 'Top supplier per category', difficulty: 'Hard', topics: ['RANK'], companies: ['Amazon'], acceptance: 41.8, status: 'not-started' },
  { id: 79, title: 'Customer acquisition cost', difficulty: 'Hard', topics: ['JOIN'], companies: ['Meta'], acceptance: 39.1, status: 'not-started' },
  { id: 80, title: 'Marketing spend per channel', difficulty: 'Easy', topics: ['GROUP'], companies: ['Google'], acceptance: 90.9, status: 'completed' },

  { id: 81, title: 'Revenue per employee', difficulty: 'Medium', topics: ['JOIN'], companies: ['Microsoft'], acceptance: 68.6, status: 'not-started' },
  { id: 82, title: 'Top office by headcount', difficulty: 'Easy', topics: ['GROUP'], companies: ['Microsoft'], acceptance: 87.4, status: 'completed' },
  { id: 83, title: 'Attrition rate', difficulty: 'Medium', topics: ['CASE'], companies: ['Microsoft'], acceptance: 66.9, status: 'not-started' },
  { id: 84, title: 'Promotion rate', difficulty: 'Medium', topics: ['CASE'], companies: ['Meta'], acceptance: 65.3, status: 'not-started' },
  { id: 85, title: 'Gender pay gap', difficulty: 'Hard', topics: ['AVG'], companies: ['Google'], acceptance: 43.1, status: 'not-started' },

  { id: 86, title: 'Overtime hours per dept', difficulty: 'Easy', topics: ['SUM'], companies: ['Microsoft'], acceptance: 88.9, status: 'completed' },
  { id: 87, title: 'Project cost overrun', difficulty: 'Medium', topics: ['CASE'], companies: ['Amazon'], acceptance: 67.6, status: 'not-started' },
  { id: 88, title: 'Top project by margin', difficulty: 'Hard', topics: ['RANK'], companies: ['Microsoft'], acceptance: 41.9, status: 'not-started' },
  { id: 89, title: 'Budget utilization', difficulty: 'Medium', topics: ['SUM'], companies: ['Meta'], acceptance: 69.2, status: 'not-started' },
  { id: 90, title: 'Expense per category', difficulty: 'Easy', topics: ['GROUP'], companies: ['Google'], acceptance: 91.1, status: 'completed' },

  { id: 91, title: 'Fraudulent transactions', difficulty: 'Hard', topics: ['CASE'], companies: ['PayPal'], acceptance: 38.2, status: 'not-started' },
  { id: 92, title: 'Chargeback rate', difficulty: 'Medium', topics: ['CASE'], companies: ['Stripe'], acceptance: 64.8, status: 'not-started' },
  { id: 93, title: 'Top merchant by volume', difficulty: 'Medium', topics: ['GROUP'], companies: ['PayPal'], acceptance: 66.5, status: 'not-started' },
  { id: 94, title: 'Avg transaction value', difficulty: 'Easy', topics: ['AVG'], companies: ['Stripe'], acceptance: 89.3, status: 'completed' },
  { id: 95, title: 'Daily transaction count', difficulty: 'Easy', topics: ['COUNT'], companies: ['PayPal'], acceptance: 92.4, status: 'completed' },

  { id: 96, title: 'Active merchants', difficulty: 'Easy', topics: ['COUNT'], companies: ['Stripe'], acceptance: 90.6, status: 'completed' },
  { id: 97, title: 'Dormant accounts', difficulty: 'Medium', topics: ['DATE'], companies: ['PayPal'], acceptance: 65.7, status: 'not-started' },
  { id: 98, title: 'Top region by revenue', difficulty: 'Easy', topics: ['GROUP'], companies: ['Stripe'], acceptance: 88.7, status: 'completed' },
  { id: 99, title: 'Cross border transactions', difficulty: 'Medium', topics: ['CASE'], companies: ['PayPal'], acceptance: 67.1, status: 'not-started' },
  { id: 100, title: 'Currency conversion impact', difficulty: 'Hard', topics: ['JOIN'], companies: ['Stripe'], acceptance: 40.5, status: 'not-started' }
];

const InterviewPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>('');
  const [selectedTrack, setSelectedTrack] = useState<string | null>('');
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<'overview' | 'tracks' | 'filters' | 'questions' | 'analytics'>('overview');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof Question | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Column filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const allTopics = Array.from(new Set(mockQuestions.flatMap(q => q.topics)));
  const allCompanies = Array.from(new Set(mockQuestions.flatMap(q => q.companies || [])));

  // Filter questions
  let filteredQuestions = mockQuestions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = !selectedTopic || q.topics.includes(selectedTopic);
    const matchesCompany = !selectedCompany || (q.companies && q.companies.includes(selectedCompany));
    const matchesDifficulty = !selectedDifficulty || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesDifficultyFilter = difficultyFilter === 'all' || q.difficulty === difficultyFilter;

    return matchesSearch && matchesTopic && matchesCompany && matchesDifficulty && matchesStatus && matchesDifficultyFilter;
  });

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



  const sideNavItems = [
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



  const handleSideNavClick = (sectionId: 'overview' | 'tracks' | 'filters' | 'questions' | 'analytics') => {
    setActiveNavItem(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
                        onClick={() => handleSideNavClick(item.id)}
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
                                
                                {item.children.map((child, index) => (
                                  <div key={child.id} className="relative">
                                    {/* Horizontal connecting line */}
                                    <div className="absolute left-5 top-1/2 w-3 h-px bg-gray-300"></div>
                                    
                                    <button
                                      onClick={() => {
                                        console.log('Child clicked:', child.id);
                                        setHoveredItem(null); // Close tooltip after click
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors ml-5"
                                    >
                                      <span className="font-medium">{child.label}</span>
                                      <div className="flex items-center gap-1.5">
                                     
                                        {child.arrow && (
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
                        
                        {item.children.map((child, index) => (
                          <div key={child.id} className="relative">
                            {/* Horizontal connecting line */}
                            <div className="absolute left-0 top-1/2 w-4 h-px bg-gray-300"></div>
                            
                            <button
                              onClick={() => console.log('Child clicked:', child.id)}
                              onMouseEnter={() => setHoveredItem(child.id)}
                              onMouseLeave={() => setHoveredItem(null)}
                              className="group flex items-center gap-3 rounded-xl transition-all duration-200 px-3 py-2 w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 ml-4"
                            >
                              <span className="text-sm font-medium flex-1 text-left">{child.label}</span>
                              <div className="flex items-center gap-2">
                                {child.count && (
                                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                    {child.count}
                                  </span>
                                )}
                                {child.arrow && (
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
                  <span className="font-medium text-gray-800">128 / 994</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '12.9%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Easy</span>
                  <span className="font-medium text-gray-800">78 / 308</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25.3%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Medium</span>
                  <span className="font-medium text-gray-800">42 / 433</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '9.7%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Hard</span>
                  <span className="font-medium text-gray-800">8 / 253</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '3.2%' }}></div>
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
                L3
              </span>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="text-gray-500">Accuracy</div>
                <div className="font-semibold text-gray-800">84%</div>
              </div>
              <div>
                <div className="text-gray-500">Avg Time</div>
                <div className="font-semibold text-gray-800">9m 12s</div>
              </div>
              <div>
                <div className="text-gray-500">Streak</div>
                <div className="font-semibold text-blue-600">7 🔥</div>
              </div>
            </div>

            {/* Strength / Weakness */}
            <div className="space-y-2">
              <div>
                <div className="text-[10px] font-medium text-gray-500 mb-1">Strong</div>
                <div className="flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium">
                    Joins
                  </span>
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium">
                    Aggregation
                  </span>
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
          {[
            { title: 'Zero → 100 SQL', progress: 52, total: 120, focus: 'Select, Joins, Group By' },
            { title: 'Mastering Analytics', progress: 24, total: 90, focus: 'KPIs, Cohorts, Retention' },
            { title: 'Advanced SQL', progress: 9, total: 70, focus: 'Window, Ranking' },
            { title: 'Interview Pro', progress: 3, total: 40, focus: 'Mixed mocks' },
          ].map((track, idx) => (
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
          ))}
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
                            onClick={() => console.log('Question clicked:', question.id)}
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
