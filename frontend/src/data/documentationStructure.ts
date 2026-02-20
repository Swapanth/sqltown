// Simplified documentation structure - only metadata, no content
// Content is now in individual React components for lazy loading

export const documentationStructure = {
  mysql: {
    title: "MySQL Mastery — Zero to Hero",
    version: "8.0",
    tagline: "The only SQL guide you'll ever need. No fluff, no boring textbook vibes — just pure, delicious database knowledge.",
    sections: [
      {
        id: "basics",
        title: "MySQL Basics",
        icon: "info",
        intro: "Now that MySQL is running, it's time to actually talk to it. SQL (Structured Query Language) is the language databases speak.",
        subsections: [
          {
            id: "introduction-to-sql",
            title: "Introduction to SQL",
            difficulty: "beginner",
            description: "Start your SQL journey with the fundamentals of database querying.",
            lectures: 9,
            duration: "40min"
          },
          {
            id: "select-query",
            title: "SELECT Query",
            difficulty: "beginner",
            description: "Master the most important SQL command for retrieving data.",
            lectures: 11,
            duration: "1hr 1min"
          },
          {
            id: "data-definition-ddl",
            title: "Data Definition (DDL)",
            difficulty: "beginner",
            description: "Learn to create and modify database structures with DDL commands.",
            lectures: 3,
            duration: "11min"
          },
          {
            id: "data-manipulation-dml",
            title: "Data Manipulation (DML)",
            difficulty: "beginner",
            description: "Insert, update, and delete data with DML operations.",
            lectures: 3,
            duration: "24min"
          },
          {
            id: "filtering-data",
            title: "Filtering Data",
            difficulty: "beginner",
            description: "Learn to filter and refine your query results with WHERE clauses.",
            lectures: 8,
            duration: "41min"
          },
          {
            id: "sql-joins",
            title: "SQL Joins",
            difficulty: "intermediate",
            description: "Combine data from multiple tables using various join types.",
            lectures: 13,
            duration: "1hr 16min"
          },
          {
            id: "sql-set-operators",
            title: "SQL SET Operators",
            difficulty: "intermediate",
            description: "Use UNION, INTERSECT, and EXCEPT to combine query results.",
            lectures: 9,
            duration: "45min"
          },
          {
            id: "string-functions",
            title: "String Functions",
            difficulty: "intermediate",
            description: "Manipulate text data with SQL's powerful string functions.",
            lectures: 10,
            duration: "36min"
          },
          {
            id: "date-time-functions",
            title: "Date & Time Functions",
            difficulty: "intermediate",
            description: "Work with dates and times effectively in SQL.",
            lectures: 18,
            duration: "1hr 34min"
          },
          {
            id: "null-functions",
            title: "NULL Functions",
            difficulty: "intermediate",
            description: "Handle NULL values properly in your queries.",
            lectures: 11,
            duration: "1hr 9min"
          },
          {
            id: "case-when-statement",
            title: "CASE WHEN Statement",
            difficulty: "intermediate",
            description: "Add conditional logic to your SQL queries.",
            lectures: 6,
            duration: "33min"
          },
          {
            id: "window-functions-basics",
            title: "Window Functions Basics",
            difficulty: "advanced",
            description: "Introduction to powerful window functions for advanced analytics.",
            lectures: 9,
            duration: "1hr 10min"
          },
          {
            id: "window-aggregate-functions",
            title: "Window Aggregate Functions",
            difficulty: "advanced",
            description: "Perform aggregations over window frames.",
            lectures: 8,
            duration: "1hr 6min"
          },
          {
            id: "window-ranking-functions",
            title: "Window Ranking Functions",
            difficulty: "advanced",
            description: "Rank and order data within partitions.",
            lectures: 12,
            duration: "1hr 3min"
          },
          {
            id: "window-value-functions",
            title: "Window Value Functions",
            difficulty: "advanced",
            description: "Access values from other rows in your result set.",
            lectures: 7,
            duration: "50min"
          }
        ]
      },
      {
        id: "advanced",
        title: "Advanced Topics",
        icon: "star",
        intro: "Level up your SQL game with advanced techniques, optimization, and real-world projects.",
        subsections: [
          {
            id: "subqueries",
            title: "Subqueries",
            difficulty: "advanced",
            description: "Master nested queries and subquery techniques for complex data retrieval.",
            lectures: 15,
            duration: "1hr 37min"
          },
          {
            id: "common-table-expression",
            title: "Common Table Expression (CTE)",
            difficulty: "advanced",
            description: "Use CTEs to write cleaner, more maintainable SQL queries.",
            lectures: 10,
            duration: "1hr 17min"
          },
          {
            id: "views",
            title: "Views",
            difficulty: "advanced",
            description: "Create virtual tables to simplify complex queries and enhance security.",
            lectures: 14,
            duration: "1hr 1min"
          },
          {
            id: "ctas-temp-tables",
            title: "CTAS & TEMP Tables",
            difficulty: "advanced",
            description: "Work with temporary tables and CREATE TABLE AS SELECT statements.",
            lectures: 15,
            duration: "51min"
          },
          {
            id: "stored-procedures",
            title: "Stored Procedures",
            difficulty: "advanced",
            description: "Build reusable SQL code blocks with stored procedures.",
            lectures: 10,
            duration: "56min"
          },
          {
            id: "indexes",
            title: "Indexes",
            difficulty: "advanced",
            description: "Optimize query performance with proper indexing strategies.",
            lectures: 23,
            duration: "2hr 30min"
          },
          {
            id: "partitions",
            title: "Partitions",
            difficulty: "advanced",
            description: "Improve performance and manageability with table partitioning.",
            lectures: 4,
            duration: "33min"
          },
          {
            id: "performance-best-practices",
            title: "Performance Best Practices",
            difficulty: "advanced",
            description: "Learn optimization techniques for production-ready SQL.",
            lectures: 9,
            duration: "39min"
          },
          {
            id: "copilot-chatgpt-sql",
            title: "Copilot & ChatGPT for SQL",
            difficulty: "intermediate",
            description: "Leverage AI tools to accelerate your SQL development workflow.",
            lectures: 7,
            duration: "57min"
          },
          {
            id: "sql-data-warehouse-project",
            title: "SQL Data Warehouse Project",
            difficulty: "advanced",
            description: "Build a complete data warehouse from scratch.",
            lectures: 36,
            duration: "4hr 17min"
          },
          {
            id: "exploratory-data-analysis-project",
            title: "Exploratory Data Analysis Project",
            difficulty: "advanced",
            description: "Analyze real-world datasets using advanced SQL techniques.",
            lectures: 12,
            duration: "55min"
          },
          {
            id: "sql-advanced-data-analytics-project",
            title: "SQL Advanced Data Analytics Project",
            difficulty: "advanced",
            description: "Apply advanced analytics techniques to solve business problems.",
            lectures: 9,
            duration: "1hr 17min"
          }
        ]
      },
      {
        id: "thank-you",
        title: "THANK YOU",
        icon: "heart",
        intro: "Thank you for completing this SQL journey!",
        subsections: [
          {
            id: "conclusion",
            title: "Course Conclusion",
            difficulty: "beginner",
            description: "Congratulations on completing the SQL course!",
            lectures: 1,
            duration: "1min"
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
