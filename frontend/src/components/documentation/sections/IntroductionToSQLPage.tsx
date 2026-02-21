import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface IntroductionToSQLPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const IntroductionToSQLPage: React.FC<IntroductionToSQLPageProps> = ({ initialTheme = 'light', onNavigate }) => {
  return (
    <PageLayout
      theme={'light'}
      onToggleTheme={() => {}}
      breadcrumb={{ section: 'basics', subsection: 'introduction-to-sql' }}
      currentSection="introduction-to-sql"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>📚 MySQL Basics</span>
        </div>
        <h1>Introduction to SQL</h1>
        <p className="description">
          Start your SQL journey with the fundamentals of database querying. 
          Learn what SQL is, why it matters, and how to set up your environment.
        </p>
        <DifficultyBadge level="beginner" />
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          9 lectures • 40min
        </div>
      </div>

      <FunFact text="SQL was developed at IBM in the early 1970s and is still one of the most in-demand skills in tech today!" />

      {/* Lecture 1: Introduction */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="introduction">
             Introduction
          </h2>
          <div className="subtitle">Duration: 1:29 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Welcome to the SQL course! In this introductory lecture, you'll get an overview of what 
            you'll learn throughout this comprehensive SQL journey. We'll cover the course structure, 
            learning objectives, and what makes SQL such a powerful tool for working with data.
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">What You'll Learn</span>
              </div>
              <div className="simple">Complete SQL from basics to advanced topics</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Course Format</span>
              </div>
              <div className="simple">Video lectures, hands-on exercises, and real projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 2: Course Resources */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="course-resources">
            <span className="lecture-icon">📄</span> Course Resources
          </h2>
          <div className="subtitle">Duration: 1:01</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Access all the materials you'll need for this course. Download SQL scripts, datasets, 
            cheat sheets, and reference materials that will support your learning journey.
          </p>
          <ul className="prose">
            <li>SQL script files for all examples</li>
            <li>Practice datasets and sample databases</li>
            <li>Quick reference guides and cheat sheets</li>
            <li>Additional reading materials</li>
          </ul>
        </div>
      </div>

      {/* Lecture 3: Course Roadmap & Structure */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="course-roadmap">
             Course Roadmap & Structure
          </h2>
          <div className="subtitle">Duration: 5:51 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Understand the complete learning path from beginner to advanced SQL. We'll walk through 
            each section of the course, explaining how topics build upon each other and what you'll 
            achieve at each stage.
          </p>
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>Beginner Topics</h3>
              <ul>
                <li>SQL fundamentals</li>
                <li>Basic queries</li>
                <li>Data manipulation</li>
                <li>Filtering and sorting</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>Advanced Topics</h3>
              <ul>
                <li>Complex joins</li>
                <li>Window functions</li>
                <li>Performance optimization</li>
                <li>Real-world projects</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 4: What is SQL and Databases */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="what-is-sql">
             What is SQL and Databases
          </h2>
          <div className="subtitle">Duration: 3:13 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SQL (Structured Query Language) is the standard language for managing and manipulating 
            relational databases. Learn what databases are, why they're essential, and how SQL 
            enables you to interact with them.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- SQL is used to communicate with databases
-- Here's a simple example:

SELECT customer_name, email, city
FROM customers
WHERE country = 'USA'
ORDER BY customer_name;

-- This query retrieves customer information
-- from a database table`} 
          />
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Database</span>
              </div>
              <div className="simple">Organized collection of structured data</div>
              <div className="example">Think of it as a digital filing cabinet</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">SQL</span>
              </div>
              <div className="simple">Language to query and manage databases</div>
              <div className="example">SELECT, INSERT, UPDATE, DELETE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 5: What is DBMS and SQL Server */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="dbms-sql-server">
             What is DBMS and SQL Server
          </h2>
          <div className="subtitle">Duration: 2:18</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            A Database Management System (DBMS) is software that handles the storage, retrieval, 
            and management of data in databases. Learn about different DBMS options and understand 
            what SQL Server is and how it fits into the ecosystem.
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">DBMS</span>
              </div>
              <div className="simple">Software that manages databases</div>
              <div className="example">MySQL, PostgreSQL, Oracle, SQL Server</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">SQL Server</span>
              </div>
              <div className="simple">Microsoft's relational database system</div>
              <div className="example">Enterprise-grade DBMS with advanced features</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 6: Types of Databases */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="types-of-databases">
             Types of Databases
          </h2>
          <div className="subtitle">Duration: 2:13</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Not all databases are created equal. Explore the different types of databases, from 
            relational to NoSQL, and understand when to use each type.
          </p>
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>Relational Databases</h3>
              <ul>
                <li>Structured data in tables</li>
                <li>Uses SQL</li>
                <li>ACID compliant</li>
                <li>Examples: MySQL, PostgreSQL</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>NoSQL Databases</h3>
              <ul>
                <li>Flexible schema</li>
                <li>Document, key-value, graph</li>
                <li>Horizontally scalable</li>
                <li>Examples: MongoDB, Redis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 7: Types of SQL Commands */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="types-of-sql-commands">
             Types of SQL Commands
          </h2>
          <div className="subtitle">Duration: 2:10</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SQL commands are categorized into different types based on their functionality. 
            Understanding these categories will help you organize your SQL knowledge effectively.
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">DDL</span>
              </div>
              <div className="simple">Data Definition Language</div>
              <div className="example">CREATE, ALTER, DROP, TRUNCATE</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">DML</span>
              </div>
              <div className="simple">Data Manipulation Language</div>
              <div className="example">SELECT, INSERT, UPDATE, DELETE</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">DCL</span>
              </div>
              <div className="simple">Data Control Language</div>
              <div className="example">GRANT, REVOKE</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">TCL</span>
              </div>
              <div className="simple">Transaction Control Language</div>
              <div className="example">COMMIT, ROLLBACK, SAVEPOINT</div>
            </div>
          </div>
          <CodeBlock 
            language="sql" 
            code={`-- DDL: Define database structure
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  salary DECIMAL(10,2)
);

-- DML: Manipulate data
INSERT INTO employees VALUES (1, 'John Doe', 50000);
SELECT * FROM employees WHERE salary > 40000;

-- DCL: Control access
GRANT SELECT ON employees TO user_role;

-- TCL: Manage transactions
BEGIN TRANSACTION;
UPDATE employees SET salary = salary * 1.1;
COMMIT;`} 
          />
        </div>
      </div>

      {/* Lecture 8: Why Learn SQL */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="why-learn-sql">
             Why Learn SQL
          </h2>
          <div className="subtitle">Duration: 2:06 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SQL is one of the most valuable skills in the tech industry. Discover why learning SQL 
            is essential for data analysts, developers, data scientists, and business professionals.
          </p>
          <ul className="prose">
            <li><strong>Universal Skill:</strong> Used across all industries and company sizes</li>
            <li><strong>High Demand:</strong> One of the most requested skills in job postings</li>
            <li><strong>Data-Driven Decisions:</strong> Extract insights from data to drive business decisions</li>
            <li><strong>Career Growth:</strong> Opens doors to data analyst, engineer, and scientist roles</li>
            <li><strong>Easy to Learn:</strong> Readable syntax that resembles natural language</li>
            <li><strong>Powerful:</strong> Handle millions of records with simple queries</li>
          </ul>
          <FunFact text="SQL developers earn an average of $90,000+ per year, and the skill is required in over 50% of data-related job postings!" />
        </div>
      </div>

      {/* Lecture 9: Environment Setup */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="environment-setup">
             Environment Setup: SQL Server, SSMS and Databases
          </h2>
          <div className="subtitle">Duration: 20:04</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Get your development environment ready! This comprehensive guide walks you through 
            installing SQL Server, SQL Server Management Studio (SSMS), and setting up your first 
            database. Follow along step-by-step to ensure everything is configured correctly.
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">SQL Server</span>
              </div>
              <div className="simple">The database engine that stores and processes data</div>
              <div className="example">Download from Microsoft's website</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">SSMS</span>
              </div>
              <div className="simple">SQL Server Management Studio - your SQL IDE</div>
              <div className="example">Write queries, manage databases, view results</div>
            </div>
          </div>
          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Installation Steps:</h3>
          <ol className="prose">
            <li>Download SQL Server Developer Edition (free)</li>
            <li>Run the installer and choose "Basic" installation</li>
            <li>Download and install SSMS</li>
            <li>Connect to your local SQL Server instance</li>
            <li>Create your first database</li>
            <li>Verify the installation by running a test query</li>
          </ol>
          <CodeBlock 
            language="sql" 
            code={`-- Test your installation with this simple query
SELECT @@VERSION AS 'SQL Server Version';

-- Create your first database
CREATE DATABASE MyFirstDB;

-- Switch to the new database
USE MyFirstDB;

-- Create a test table
CREATE TABLE test_table (
  id INT PRIMARY KEY,
  message VARCHAR(100)
);

-- Insert test data
INSERT INTO test_table VALUES (1, 'Hello SQL World!');

-- Query the data
SELECT * FROM test_table;`} 
          />
        </div>
      </div>

      {/* Lecture 10: Quiz */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="quiz">
            <span className="lecture-icon">📝</span> Quiz | Intro to SQL
          </h2>
          <div className="subtitle">Test your knowledge</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Test your understanding of the Introduction to SQL concepts. This quiz covers all the 
            topics from this section including SQL basics, database types, command categories, and 
            environment setup.
          </p>
          <div style={{ 
            padding: '20px', 
            background: 'var(--card-bg)', 
            borderRadius: '8px',
            border: '2px solid var(--accent)',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 Ready to test your knowledge? Complete the quiz to reinforce what you've learned!
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="next-steps">What's Next?</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Now that you understand the fundamentals of SQL and have your environment set up, 
            you're ready to start writing queries! In the next section, we'll dive deep into 
            the SELECT statement and learn how to retrieve data from databases.
          </p>
          <div style={{ marginTop: '24px' }}>
            <button 
              style={{
                padding: '12px 24px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={() => onNavigate?.('select-query' as SubsectionId)}
            >
              Continue to SELECT Query →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default IntroductionToSQLPage;
