import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import { CircleStackIcon } from "@heroicons/react/24/solid";

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

// Function to parse SQL file and extract metadata
const parseSqlFile = async (filename: string): Promise<DatabaseScenario | null> => {
  try {
    const response = await fetch(`/practiceData/${filename}`);
    if (!response.ok) return null;
    
    const content = await response.text();
    const lines = content.split('\n');
    
    // Extract metadata from comments
    let name = '';
    let description = '';
    let tablesList: string[] = [];
    
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const line = lines[i];
      
      if (line.includes('DATABASE') && line.includes(':')) {
        const match = line.match(/DATABASE \d+: (.+?) \((.+?)\)/);
        if (match) {
          description = match[1];
          name = match[2];
        }
      }
      
      if (line.includes('Tables:')) {
        // Collect all table names from multiple lines
        let tablesText = line.replace('-- Tables:', '').trim();
        let j = i + 1;
        while (j < lines.length && lines[j].startsWith('--')) {
          const nextLine = lines[j].replace('--', '').trim();
          if (nextLine && !nextLine.includes('=')) {
            tablesText += ' ' + nextLine;
          } else {
            break;
          }
          j++;
        }
        tablesList = tablesText.split(',').map(t => t.trim()).filter(t => t.length > 0);
      }
    }
    
    // Count actual CREATE TABLE statements
    const tableCount = (content.match(/CREATE TABLE/gi) || []).length;
    
    // Create better description using table names
    if (tablesList.length > 0 && !description) {
      const mainTables = tablesList.slice(0, 6).join(', ');
      const remaining = tablesList.length > 6 ? ` and ${tablesList.length - 6} more` : '';
      description = `Database with ${mainTables}${remaining}`;
    }
    
    // Determine difficulty based on table count
    let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
    if (tableCount > 15) difficulty = 'Advanced';
    else if (tableCount > 10) difficulty = 'Intermediate';
    
    // Determine category based on filename/content
    let category = 'General';
    if (filename.includes('ecommerce')) category = 'Retail';
    else if (filename.includes('university') || filename.includes('edutrack')) category = 'Education';
    else if (filename.includes('hr') || filename.includes('payroll')) category = 'Business';
    else if (filename.includes('banking') || filename.includes('finance')) category = 'Finance';
    
    // Generate thumbnail based on category
    const thumbnails: Record<string, string> = {
      'Retail': '/assets/cpu-img.svg',
      'Education': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Business': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Finance': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'General': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    
    return {
      id: filename.replace('.sql', ''),
      name: name || filename.replace('.sql', '').replace(/_/g, ' '),
      description: description || `Database scenario from ${filename}`,
      difficulty,
      category,
      tables: tableCount,
      queries: Math.floor(tableCount * 2.5), // Estimate queries based on tables
      completionRate: 0,
      lastEdited: "Never",
      thumbnail: thumbnails[category],
      status: "Not Started",
      creator: "SQL Academy"
    };
  } catch (error) {
    console.error(`Error parsing ${filename}:`, error);
    return null;
  }
};

// SQL files to load
const sqlFiles = [
  '01_ecommerce_shopnow.sql',
  '02_university_edutrack.sql',
  '03_hr_payroll_peoplecore.sql',
  '04_banking_nexbank.sql'
];

const PracticeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All difficulties");
  const [filterStatus, setFilterStatus] = useState("Any status");
  const [filterCategory, setFilterCategory] = useState("All categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [databases, setDatabases] = useState<DatabaseScenario[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real data from SQL files
  useEffect(() => {
    const loadDatabases = async () => {
      setLoading(true);
      const loadedDatabases: DatabaseScenario[] = [];
      
      for (const filename of sqlFiles) {
        const db = await parseSqlFile(filename);
        if (db) {
          loadedDatabases.push(db);
        }
      }
      
      setDatabases(loadedDatabases);
      setLoading(false);
    };

    loadDatabases();
  }, []);

  const filteredDatabases = databases.filter(db => {
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
      case "Beginner": return "text-emerald-300 bg-emerald-500/10";
      case "Intermediate": return "text-amber-300 bg-amber-500/10";
      case "Advanced": return "text-rose-300 bg-rose-500/10";
      default: return "text-gray-300 bg-gray-500/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-emerald-300 bg-emerald-500/10";
      case "In Progress": return "text-blue-300 bg-blue-500/10";
      case "Not Started": return "text-gray-300 bg-gray-500/10";
      default: return "text-gray-300 bg-gray-500/10";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">
                Practice Databases
              </h1>
              <span className="text-sm ">
                {loading ? "Loading..." : `${filteredDatabases.length} available`}
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <input
                type="text"
                placeholder="Search databases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 border border-black/10 rounded-lg pl-10 pr-3 py-2 text-sm  placeholder:text-black/40 focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>

            {/* Filters */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none pr-8"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
            >
              <option value="All difficulties" className="">All difficulties</option>
              <option value="Intermediate" className="">Intermediate</option>
              <option value="Advanced" className="">Advanced</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none pr-8"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
            >
              <option value="Any status" className="">Any status</option>
              <option value="Not Started" className="">Not Started</option>
              <option value="In Progress" className="">In Progress</option>
              <option value="Completed" className="">Completed</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none pr-8"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
            >
              <option value="All categories" className="">All categories</option>
              <option value="Retail" className="">Retail</option>
              <option value="Education" className="">Education</option>
              <option value="Business" className="">Business</option>
              <option value="Finance" className="">Finance</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-1 bg-black/5 border border-black/10 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid" ? "bg-black/10" : "hover:bg-black/5"
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list" ? "bg-black/10" : "hover:bg-black/5"
                }`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Cards Grid */}
      <div className="max-w-[1600px] mx-auto px-8 py-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-/60 mb-1">Loading databases...</h3>
            <p className="text-sm text-/40">Parsing SQL files and extracting metadata</p>
          </div>
        ) : (
          <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"} gap-4`}>
            {/* Database Cards */}
            {filteredDatabases.map((db) => (
            <div
              key={db.id}
              onClick={() => handleDatabaseClick(db.id)}
              className="group relative rounded-xl border border-/10 hover:border-[#6366F1]/60 transition-all duration-300 cursor-pointer overflow-hidden  hover:bg-[#222222] hover:shadow-xl hover:shadow-[#6366F1]/20 hover:-translate-y-1 transform"
            >
              {/* Thumbnail */}
              <div
                className="aspect-video relative overflow-hidden"
                style={{ background: db.thumbnail }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                
                {/* Animated overlay on hover */}
                <div className="absolute inset-0 bg-[#6366F1]/0 group-hover:bg-[#6366F1]/10 transition-all duration-300"></div>
                
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-medium ${getStatusColor(db.status)} backdrop-blur-sm transition-all duration-300 group-hover:scale-105`}>
                    {db.status}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2">
                  <CircleStackIcon className="w-8 h-8 text-/80 transition-all duration-300 group-hover:text-[#6366F1] group-hover:scale-110" />
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text- group-hover:text-[#6366F1] transition-colors duration-300 flex-1 pr-2 line-clamp-1">
                    {db.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium space-nowrap ${getDifficultyColor(db.difficulty)} transition-all duration-300 group-hover:scale-105`}>
                    {db.difficulty}
                  </span>
                </div>

                <p className="text-xs text-/60 mb-3 leading-relaxed line-clamp-2 group-hover:text-/80 transition-colors duration-300">
                  {db.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-/50 mb-3 group-hover:text-/70 transition-colors duration-300">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-[#6366F1] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    <span>{db.tables} Tables</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-[#6366F1] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    <span>{db.queries} Queries</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {db.completionRate > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-/60 group-hover:text-/80 transition-colors">Progress</span>
                      <span className="text-/80 font-medium group-hover:text-[#6366F1] transition-colors">{db.completionRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-/10 rounded-full overflow-hidden group-hover:bg-/15 transition-colors">
                      <div
                        className="h-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#6366F1]/50"
                        style={{ width: `${db.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-/10 group-hover:border-/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-[10px] font-bold transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-[#6366F1]/30">
                      {db.creator.charAt(0)}
                    </div>
                    <span className="text-[10px] text-/60 group-hover:text-/80 transition-colors">{db.creator}</span>
                  </div>
                  <span className="text-[10px] text-/40 group-hover:text-[#6366F1] transition-colors font-medium">{db.category}</span>
                </div>
              </div>
              
              {/* Bottom edge glow on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6366F1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredDatabases.length === 0 && (
          <div className="text-center py-16 col-span-full">
            <CircleStackIcon className="w-12 h-12 mx-auto mb-3 text-/20" />
            <h3 className="text-lg font-semibold text-/60 mb-1">No databases found</h3>
            <p className="text-sm text-/40">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeListPage;
