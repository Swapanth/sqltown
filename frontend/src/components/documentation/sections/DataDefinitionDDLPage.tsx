import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface DataDefinitionDDLPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const DataDefinitionDDLPage: React.FC<DataDefinitionDDLPageProps> = ({ initialTheme = 'dark', onNavigate }) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}}
      breadcrumb={{ section: 'basics', subsection: 'data-definition-ddl' }}
      currentSection="data-definition-ddl"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>🏗️ MySQL Basics</span>
        </div>
        <h1>Data Definition (DDL)</h1>
        <p className="description">
          Learn to create and modify database structures with DDL commands. Master CREATE, ALTER, 
          and DROP statements to define tables, columns, and constraints.
        </p>
        <DifficultyBadge level="beginner" />
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          3 lectures • 11min
        </div>
      </div>

      <FunFact text="DDL stands for Data Definition Language - it's used to define and modify the structure of database objects like tables, indexes, and schemas." />

      {/* Lecture 1: CREATE */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="create">
            <span className="lecture-icon">▶️</span> CREATE
          </h2>
          <div className="subtitle">Duration: 6:19</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The CREATE statement is used to create new database objects such as databases, tables, 
            indexes, and views. It's the foundation of building your database structure.
          </p>
          
          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Creating a Database</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Create a new database
CREATE DATABASE company_db;

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS company_db;

-- Create database with character set
CREATE DATABASE company_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Creating a Table</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Basic table creation
CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  hire_date DATE,
  salary DECIMAL(10, 2)
);

-- Table with auto-increment primary key
CREATE TABLE departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table with foreign key constraint
CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'Pending',
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);`} 
          />

          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Data Types</span>
              </div>
              <div className="simple">INT, VARCHAR, DATE, DECIMAL, TEXT, BOOLEAN</div>
              <div className="example">employee_id INT, name VARCHAR(100)</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Constraints</span>
              </div>
              <div className="simple">PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL</div>
              <div className="example">email VARCHAR(100) UNIQUE NOT NULL</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">AUTO_INCREMENT</span>
              </div>
              <div className="simple">Automatically generates unique numbers</div>
              <div className="example">id INT AUTO_INCREMENT PRIMARY KEY</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">DEFAULT</span>
              </div>
              <div className="simple">Sets default value for a column</div>
              <div className="example">status VARCHAR(20) DEFAULT 'Active'</div>
            </div>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Creating an Index</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Create an index on a single column
CREATE INDEX idx_last_name ON employees(last_name);

-- Create a composite index
CREATE INDEX idx_name ON employees(last_name, first_name);

-- Create a unique index
CREATE UNIQUE INDEX idx_email ON employees(email);`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Creating a View</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Create a view
CREATE VIEW employee_details AS
SELECT 
  e.employee_id,
  e.first_name,
  e.last_name,
  d.department_name,
  e.salary
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

-- Query the view like a table
SELECT * FROM employee_details
WHERE salary > 50000;`} 
          />
        </div>
      </div>

      {/* Lecture 2: ALTER */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="alter">
            <span className="lecture-icon">▶️</span> ALTER
          </h2>
          <div className="subtitle">Duration: 3:22</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The ALTER statement modifies existing database objects. You can add, modify, or delete 
            columns, change data types, add constraints, and more.
          </p>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Adding Columns</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Add a single column
ALTER TABLE employees
ADD phone_number VARCHAR(20);

-- Add multiple columns
ALTER TABLE employees
ADD COLUMN middle_name VARCHAR(50),
ADD COLUMN date_of_birth DATE;

-- Add column with constraint
ALTER TABLE employees
ADD COLUMN department_id INT NOT NULL;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Modifying Columns</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Change column data type
ALTER TABLE employees
MODIFY COLUMN salary DECIMAL(12, 2);

-- Change column name and type
ALTER TABLE employees
CHANGE COLUMN phone_number contact_number VARCHAR(25);

-- Modify column to add NOT NULL constraint
ALTER TABLE employees
MODIFY COLUMN email VARCHAR(100) NOT NULL;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Dropping Columns</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Drop a single column
ALTER TABLE employees
DROP COLUMN middle_name;

-- Drop multiple columns
ALTER TABLE employees
DROP COLUMN phone_number,
DROP COLUMN fax_number;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Adding and Dropping Constraints</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Add primary key
ALTER TABLE employees
ADD PRIMARY KEY (employee_id);

-- Add foreign key
ALTER TABLE employees
ADD CONSTRAINT fk_department
FOREIGN KEY (department_id) REFERENCES departments(department_id);

-- Add unique constraint
ALTER TABLE employees
ADD CONSTRAINT uk_email UNIQUE (email);

-- Drop foreign key
ALTER TABLE employees
DROP FOREIGN KEY fk_department;

-- Drop primary key
ALTER TABLE employees
DROP PRIMARY KEY;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Renaming Tables</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Rename a table
ALTER TABLE employees
RENAME TO staff;

-- Alternative syntax
RENAME TABLE employees TO staff;`} 
          />

          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>ADD Operations</h3>
              <ul>
                <li>Add new columns</li>
                <li>Add constraints</li>
                <li>Add indexes</li>
                <li>Expand table structure</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>MODIFY/DROP Operations</h3>
              <ul>
                <li>Change column types</li>
                <li>Remove columns</li>
                <li>Drop constraints</li>
                <li>Restructure existing data</li>
              </ul>
            </div>
          </div>

          <FunFact text="Always backup your data before running ALTER statements, especially when dropping columns or modifying data types!" />
        </div>
      </div>

      {/* Lecture 3: DROP */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="drop">
            <span className="lecture-icon">▶️</span> DROP
          </h2>
          <div className="subtitle">Duration: 1:45</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The DROP statement permanently deletes database objects. Use with extreme caution as 
            this operation cannot be undone and will delete all data within the object.
          </p>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Dropping a Database</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Drop a database (deletes everything!)
DROP DATABASE company_db;

-- Drop database if it exists (no error if it doesn't)
DROP DATABASE IF EXISTS company_db;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Dropping a Table</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Drop a table
DROP TABLE employees;

-- Drop table if it exists
DROP TABLE IF EXISTS employees;

-- Drop multiple tables
DROP TABLE employees, departments, orders;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Dropping an Index</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Drop an index
DROP INDEX idx_last_name ON employees;

-- Alternative syntax
ALTER TABLE employees
DROP INDEX idx_last_name;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Dropping a View</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Drop a view
DROP VIEW employee_details;

-- Drop view if it exists
DROP VIEW IF EXISTS employee_details;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>TRUNCATE vs DROP</h3>
          <CodeBlock 
            language="sql" 
            code={`-- TRUNCATE removes all rows but keeps table structure
TRUNCATE TABLE employees;

-- DROP removes the entire table including structure
DROP TABLE employees;

-- DELETE removes rows but is slower (can be rolled back)
DELETE FROM employees;`} 
          />

          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">DROP TABLE</span>
              </div>
              <div className="simple">Deletes table and all data permanently</div>
              <div className="example">DROP TABLE employees;</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">TRUNCATE TABLE</span>
              </div>
              <div className="simple">Removes all rows, keeps structure</div>
              <div className="example">TRUNCATE TABLE employees;</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">DELETE</span>
              </div>
              <div className="simple">Removes rows, can use WHERE clause</div>
              <div className="example">DELETE FROM employees WHERE id = 1;</div>
            </div>
          </div>

          <div style={{ 
            padding: '20px', 
            background: '#fff3cd', 
            borderRadius: '8px',
            border: '2px solid #ffc107',
            marginTop: '24px',
            color: '#856404'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              ⚠️ WARNING: DROP operations are irreversible! Always backup your data before dropping 
              database objects. Consider using DROP IF EXISTS to avoid errors.
            </p>
          </div>
        </div>
      </div>

      {/* Lecture 4: Quiz */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="quiz">
            <span className="lecture-icon">📝</span> Quiz | DDL
          </h2>
          <div className="subtitle">Test your knowledge</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Test your understanding of Data Definition Language (DDL). This quiz covers CREATE, 
            ALTER, and DROP statements, including creating tables, modifying structures, and 
            managing database objects.
          </p>
          <div style={{ 
            padding: '20px', 
            background: 'var(--card-bg)', 
            borderRadius: '8px',
            border: '2px solid var(--accent)',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 Ready to test your DDL knowledge? Complete the quiz to reinforce what you've learned!
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Example */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="comprehensive-example">Comprehensive DDL Example</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Here's a complete example showing how to create a database schema, modify it, and 
            clean up:
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Step 1: Create database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Step 2: Create tables
CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  category VARCHAR(50)
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10, 2),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Step 3: Modify tables (ALTER)
ALTER TABLE customers
ADD COLUMN phone VARCHAR(20),
ADD COLUMN address TEXT;

ALTER TABLE products
ADD COLUMN description TEXT,
MODIFY COLUMN price DECIMAL(12, 2);

-- Step 4: Create indexes for performance
CREATE INDEX idx_customer_email ON customers(email);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_order_date ON orders(order_date);

-- Step 5: Create a view
CREATE VIEW order_summary AS
SELECT 
  o.order_id,
  c.first_name,
  c.last_name,
  o.order_date,
  o.total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id;

-- Step 6: Clean up (if needed)
-- DROP VIEW order_summary;
-- DROP TABLE orders;
-- DROP TABLE products;
-- DROP TABLE customers;
-- DROP DATABASE ecommerce_db;`} 
          />
        </div>
      </div>

      {/* Best Practices */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="best-practices">DDL Best Practices</h2>
        </div>
        <div className="doc-card-body">
          <ul className="prose">
            <li><strong>Always backup before DDL operations:</strong> Especially before ALTER or DROP</li>
            <li><strong>Use IF EXISTS / IF NOT EXISTS:</strong> Prevents errors in scripts</li>
            <li><strong>Name constraints explicitly:</strong> Makes them easier to manage later</li>
            <li><strong>Choose appropriate data types:</strong> Consider size and performance</li>
            <li><strong>Add indexes strategically:</strong> On columns used in WHERE, JOIN, ORDER BY</li>
            <li><strong>Document your schema:</strong> Use comments to explain table purposes</li>
            <li><strong>Test in development first:</strong> Never run untested DDL in production</li>
            <li><strong>Use transactions when possible:</strong> Some DDL can be rolled back</li>
          </ul>
        </div>
      </div>

      {/* Next Steps */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="next-steps">What's Next?</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Now that you understand how to define and modify database structures with DDL, you're 
            ready to learn about Data Manipulation Language (DML) to insert, update, and delete data.
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
              onClick={() => onNavigate?.('data-manipulation-dml' as SubsectionId)}
            >
              Continue to Data Manipulation (DML) →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DataDefinitionDDLPage;
