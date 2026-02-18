// Simplified documentation structure - only metadata, no content
// Content is now in individual React components for lazy loading

export const documentationStructure = {
  mysql: {
    title: "MySQL Mastery — Zero to Hero",
    version: "8.0",
    tagline: "The only SQL guide you'll ever need. No fluff, no boring textbook vibes — just pure, delicious database knowledge.",
    sections: [
      {
        id: "getting-started",
        title: "Getting Started",
        icon: "rocket",
        emoji: "🚀",
        intro: "Welcome, future database wizard! Before we write our first query, we need to get MySQL installed and running.",
        subsections: [
          {
            id: "what-is-mysql",
            title: "What Even IS MySQL?",
            emoji: "🤔",
            difficulty: "absolute-beginner",
            description: "Understand databases before you touch a single line of SQL.",
            fun_fact: "MySQL powers Facebook, Twitter, YouTube, and Wikipedia. Yes, the same MySQL you're about to learn."
          },
          {
            id: "setup-steps",
            title: "Five Steps to Setup MySQL",
            emoji: "⚙️",
            difficulty: "beginner",
            description: "Get MySQL running in under 10 minutes. We'll do this together, platform by platform.",
            time_estimate: "10-15 minutes"
          },
          {
            id: "installation",
            title: "Deep Dive: Installation Details",
            emoji: "🔬",
            difficulty: "beginner",
            description: "Everything you need to know about MySQL installation, with troubleshooting for when things go sideways."
          },
          {
            id: "sample-database",
            title: "Sample Databases",
            emoji: "🎬",
            difficulty: "beginner",
            description: "Practice with real-world data. We'll use the Sakila DVD rental database — because learning SQL with actual data is 10x better than dry examples."
          }
        ]
      },
      {
        id: "basics",
        title: "MySQL Basics",
        icon: "info",
        emoji: "📚",
        intro: "Now that MySQL is running, it's time to actually talk to it. SQL (Structured Query Language) is the language databases speak.",
        subsections: [
          {
            id: "sql-statements",
            title: "CRUD Operations",
            emoji: "✍️",
            difficulty: "beginner",
            description: "The four fundamental database operations: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). Master these and you can build literally anything.",
            fun_fact: "80% of all SQL queries in production applications are SELECT statements. You'll spend most of your life reading data, not writing it."
          },
          {
            id: "filtering-sorting",
            title: "Filtering & Sorting",
            emoji: "🔍",
            difficulty: "beginner",
            description: "Learn to slice, dice, sort, and filter your data. This is where SQL starts to feel like a superpower.",
            fun_fact: "The WHERE clause is older than the internet. SQL was invented in 1974. The internet became public in 1993."
          }
        ]
      },
      {
        id: "advanced",
        title: "Advanced Topics",
        icon: "star",
        emoji: "⚡",
        intro: "Level up your SQL game with JOINs, aggregations, and performance optimization.",
        subsections: [
          {
            id: "joins",
            title: "JOINs: Connecting Tables",
            emoji: "🔗",
            difficulty: "intermediate",
            description: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN — with Venn diagram visuals and 20+ real examples"
          },
          {
            id: "aggregations",
            title: "Aggregations & GROUP BY",
            emoji: "📊",
            difficulty: "intermediate",
            description: "COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING — turn raw rows into business insights"
          },
          {
            id: "subqueries",
            title: "Subqueries & CTEs",
            emoji: "🪆",
            difficulty: "advanced",
            description: "Queries inside queries. Correlated subqueries. WITH clause. Window functions."
          },
          {
            id: "indexes",
            title: "Indexes & Performance",
            emoji: "⚡",
            difficulty: "advanced",
            description: "Why your queries are slow and exactly how to fix them. EXPLAIN plans. B-tree indexes."
          }
        ]
      }
    ]
  }
};

export type DocumentationStructure = typeof documentationStructure;
export type DatabaseData = typeof documentationStructure.mysql;
export type Section = DatabaseData['sections'][number];
export type Subsection = Section['subsections'][number];
