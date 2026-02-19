import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import { CircleStackIcon, PlusIcon } from "@heroicons/react/24/solid";

interface DatabaseScenario {
  id: string;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  tables: number;
  queries: number;
  completionRate: number;
  lastEdited: string;
  thumbnail: string;
  status: "Not Started" | "In Progress" | "Completed";
  creator: string;
}

const mockDatabases: DatabaseScenario[] = [
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    description: "Practice with a complete online store database including products, orders, customers, and inventory",
    difficulty: "Intermediate",
    category: "Retail",
    tables: 8,
    queries: 25,
    completionRate: 65,
    lastEdited: "2 days ago",
    thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    status: "In Progress",
    creator: "SQL Academy"
  },
  {
    id: "social-media",
    name: "Social Media Platform",
    description: "Explore user interactions, posts, comments, likes, and friend relationships",
    difficulty: "Advanced",
    category: "Social",
    tables: 12,
    queries: 35,
    completionRate: 30,
    lastEdited: "5 days ago",
    thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    status: "In Progress",
    creator: "SQL Academy"
  },
  {
    id: "hr-management",
    name: "HR Management System",
    description: "Manage employees, departments, salaries, and performance reviews",
    difficulty: "Beginner",
    category: "Business",
    tables: 6,
    queries: 18,
    completionRate: 100,
    lastEdited: "1 week ago",
    thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    status: "Completed",
    creator: "SQL Academy"
  },
  {
    id: "hospital",
    name: "Hospital Management",
    description: "Healthcare database with patients, doctors, appointments, and medical records",
    difficulty: "Intermediate",
    category: "Healthcare",
    tables: 10,
    queries: 30,
    completionRate: 0,
    lastEdited: "Never",
    thumbnail: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    status: "Not Started",
    creator: "SQL Academy"
  },
  {
    id: "banking",
    name: "Banking System",
    description: "Financial transactions, accounts, loans, and credit cards management",
    difficulty: "Advanced",
    category: "Finance",
    tables: 15,
    queries: 40,
    completionRate: 10,
    lastEdited: "3 days ago",
    thumbnail: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    status: "In Progress",
    creator: "SQL Academy"
  },
  {
    id: "school",
    name: "School Management",
    description: "Students, teachers, courses, grades, and class schedules",
    difficulty: "Beginner",
    category: "Education",
    tables: 7,
    queries: 20,
    completionRate: 85,
    lastEdited: "1 day ago",
    thumbnail: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    status: "In Progress",
    creator: "SQL Academy"
  },
  {
    id: "restaurant",
    name: "Restaurant Chain",
    description: "Multi-location restaurant with menu, orders, staff, and inventory",
    difficulty: "Intermediate",
    category: "Hospitality",
    tables: 9,
    queries: 22,
    completionRate: 0,
    lastEdited: "Never",
    thumbnail: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    status: "Not Started",
    creator: "SQL Academy"
  },
  {
    id: "library",
    name: "Library System",
    description: "Books, members, borrowing, returns, and catalog management",
    difficulty: "Beginner",
    category: "Education",
    tables: 5,
    queries: 15,
    completionRate: 0,
    lastEdited: "Never",
    thumbnail: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    status: "Not Started",
    creator: "SQL Academy"
  }
];

const PracticeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All difficulties");
  const [filterStatus, setFilterStatus] = useState("Any status");
  const [filterCategory, setFilterCategory] = useState("All categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredDatabases = mockDatabases.filter(db => {
    const matchesSearch = db.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         db.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === "All difficulties" || db.difficulty === filterDifficulty;
    const matchesStatus = filterStatus === "Any status" || db.status === filterStatus;
    const matchesCategory = filterCategory === "All categories" || db.category === filterCategory;
    
    return matchesSearch && matchesDifficulty && matchesStatus && matchesCategory;
  });

  const handleDatabaseClick = (dbId: string) => {
    // Navigate to practice page with selected database
    navigate(`/practice/${dbId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-600 bg-green-50";
      case "Intermediate": return "text-yellow-600 bg-yellow-50";
      case "Advanced": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600 bg-green-50";
      case "In Progress": return "text-blue-600 bg-blue-50";
      case "Not Started": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
      {/* Header */}
      <div className="border-b border-white/10 bg-[#1A1A1A]">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Practice Databases</h1>
              <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
                <span className="text-xl">...</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search databases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>

            {/* Filters */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none pr-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
            >
              <option value="All difficulties" className="bg-[#1A1A1A]">All difficulties</option>
              <option value="Beginner" className="bg-[#1A1A1A]">Beginner</option>
              <option value="Intermediate" className="bg-[#1A1A1A]">Intermediate</option>
              <option value="Advanced" className="bg-[#1A1A1A]">Advanced</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none pr-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
            >
              <option value="Any status" className="bg-[#1A1A1A]">Any status</option>
              <option value="Not Started" className="bg-[#1A1A1A]">Not Started</option>
              <option value="In Progress" className="bg-[#1A1A1A]">In Progress</option>
              <option value="Completed" className="bg-[#1A1A1A]">Completed</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none pr-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
            >
              <option value="All categories" className="bg-[#1A1A1A]">All categories</option>
              <option value="Retail" className="bg-[#1A1A1A]">Retail</option>
              <option value="Social" className="bg-[#1A1A1A]">Social</option>
              <option value="Business" className="bg-[#1A1A1A]">Business</option>
              <option value="Healthcare" className="bg-[#1A1A1A]">Healthcare</option>
              <option value="Finance" className="bg-[#1A1A1A]">Finance</option>
              <option value="Education" className="bg-[#1A1A1A]">Education</option>
              <option value="Hospitality" className="bg-[#1A1A1A]">Hospitality</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Cards Grid */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
          {/* Create New Database Card */}
          <div className="group relative rounded-2xl border-2 border-dashed border-white/20 hover:border-[#6366F1] transition-all cursor-pointer overflow-hidden bg-white/5 hover:bg-white/10">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#6366F1]/20 transition-colors">
                  <PlusIcon className="w-8 h-8 text-white/60 group-hover:text-[#6366F1]" />
                </div>
                <p className="text-lg font-semibold text-white/60 group-hover:text-white transition-colors">
                  Create custom database
                </p>
              </div>
            </div>
          </div>

          {/* Database Cards */}
          {filteredDatabases.map((db) => (
            <div
              key={db.id}
              onClick={() => handleDatabaseClick(db.id)}
              className="group relative rounded-2xl border border-white/10 hover:border-[#6366F1] transition-all cursor-pointer overflow-hidden bg-[#1A1A1A] hover:shadow-2xl hover:shadow-[#6366F1]/20"
            >
              {/* Thumbnail */}
              <div
                className="aspect-video relative overflow-hidden"
                style={{ background: db.thumbnail }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(db.status)}`}>
                    {db.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <CircleStackIcon className="w-12 h-12 text-white/80" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#6366F1] transition-colors">
                    {db.name}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(db.difficulty)}`}>
                    {db.difficulty}
                  </span>
                </div>

                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {db.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                  <span>{db.tables} Tables</span>
                  <span>•</span>
                  <span>{db.queries} Queries</span>
                  <span>•</span>
                  <span className="capitalize">{db.category}</span>
                </div>

                {/* Progress Bar */}
                {db.completionRate > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/60">Progress</span>
                      <span className="text-white/80 font-medium">{db.completionRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] rounded-full transition-all"
                        style={{ width: `${db.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-xs font-bold">
                      {db.creator.charAt(0)}
                    </div>
                    <span className="text-xs text-white/60">{db.creator}</span>
                  </div>
                  <span className="text-xs text-white/40">Edited {db.lastEdited}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDatabases.length === 0 && (
          <div className="text-center py-20">
            <CircleStackIcon className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">No databases found</h3>
            <p className="text-white/40">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeListPage;
