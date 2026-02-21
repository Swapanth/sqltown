import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface SelectQueryPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const SelectQueryPage: React.FC<SelectQueryPageProps> = ({ initialTheme = 'light', onNavigate }) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}}
      breadcrumb={{ section: 'basics', subsection: 'select-query' }}
      currentSection="select-query"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>🔍 MySQL Basics</span>
        </div>
        <h1>SELECT Query</h1>
        <p className="description">
          Master the most important SQL command for retrieving data. Learn to query databases 
          effectively with SELECT statements, from basic syntax to advanced techniques.
        </p>
        <DifficultyBadge level="beginner" />
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          11 lectures • 1hr 1min
        </div>
      </div>

      <FunFact text="The SELECT statement is used in approximately 80% of all SQL queries in production systems!" />

      {/* Lecture 1: Components of SQL */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="components-sql">
             Components of SQL
          </h2>
          <div className="subtitle">Duration: 2:45</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SQL is composed of several key components that work together to form complete queries. 
            Understanding these building blocks is essential before diving into SELECT statements.
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Clauses</span>
              </div>
              <div className="simple">SELECT, FROM, WHERE, ORDER BY, GROUP BY, HAVING</div>
              <div className="example">SELECT * FROM table WHERE condition</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Operators</span>
              </div>
              <div className="simple">Comparison, logical, arithmetic operators</div>
              <div className="example">=, &lt;, &gt;, AND, OR, +, -, *, /</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Functions</span>
              </div>
              <div className="simple">Built-in functions for data manipulation</div>
              <div className="example">COUNT(), SUM(), AVG(), MAX(), MIN()</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Keywords</span>
              </div>
              <div className="simple">DISTINCT, TOP, AS, IN, BETWEEN, LIKE</div>
              <div className="example">SELECT DISTINCT column FROM table</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 2: What is SQL Query */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="what-is-sql-query">
             What is SQL Query
          </h2>
          <div className="subtitle">Duration: 1:46 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            A SQL query is a request for data or information from a database. It's how you 
            communicate with the database to retrieve, insert, update, or delete data.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- A simple SQL query
SELECT first_name, last_name, email
FROM customers
WHERE country = 'USA';

-- This query asks the database:
-- "Give me the first name, last name, and email
--  of all customers from the USA"`} 
          />
        </div>
      </div>

      {/* Lecture 3: SELECT & FROM */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="select-from">
             SELECT & FROM
          </h2>
          <div className="subtitle">Duration: 8:01</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SELECT and FROM are the two fundamental clauses of any SQL query. SELECT specifies 
            what data you want, and FROM specifies where to get it from.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Select all columns
SELECT * FROM employees;

-- Select specific columns
SELECT first_name, last_name, department
FROM employees;

-- Select with table alias
SELECT e.employee_id, e.first_name, e.salary
FROM employees e;

-- Select with calculations
SELECT 
  product_name,
  price,
  price * 0.9 AS discounted_price
FROM products;`} 
          />
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">SELECT *</span>
              </div>
              <div className="simple">Retrieves all columns from a table</div>
              <div className="example">SELECT * FROM customers</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">SELECT columns</span>
              </div>
              <div className="simple">Retrieves specific columns</div>
              <div className="example">SELECT name, email FROM customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 4: WHERE */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="where">
             WHERE
          </h2>
          <div className="subtitle">Duration: 6:03</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The WHERE clause filters rows based on specified conditions. It's one of the most 
            important parts of SQL, allowing you to retrieve exactly the data you need.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic WHERE with comparison
SELECT * FROM employees
WHERE salary > 50000;

-- WHERE with text comparison
SELECT * FROM customers
WHERE country = 'USA';

-- Multiple conditions with AND
SELECT * FROM products
WHERE category = 'Electronics' AND price < 1000;

-- Multiple conditions with OR
SELECT * FROM orders
WHERE status = 'Shipped' OR status = 'Delivered';`} 
          />
        </div>
      </div>

      {/* Lecture 5: ORDER BY */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="order-by">
             ORDER BY
          </h2>
          <div className="subtitle">Duration: 8:55</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The ORDER BY clause sorts the result set by one or more columns. You can sort in 
            ascending (ASC) or descending (DESC) order.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Sort ascending (default)
SELECT * FROM employees
ORDER BY last_name;

-- Sort descending
SELECT * FROM products
ORDER BY price DESC;

-- Sort by multiple columns
SELECT * FROM employees
ORDER BY department ASC, salary DESC;

-- Sort by column position
SELECT first_name, last_name, salary
FROM employees
ORDER BY 3 DESC;`} 
          />
        </div>
      </div>

      {/* Lecture 6: GROUP BY */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="group-by">
             GROUP BY
          </h2>
          <div className="subtitle">Duration: 8:17</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The GROUP BY clause groups rows that have the same values in specified columns. 
            It's typically used with aggregate functions like COUNT, SUM, AVG, MAX, MIN.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Count employees by department
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;

-- Sum sales by region
SELECT region, SUM(sales_amount) AS total_sales
FROM sales
GROUP BY region;

-- Average salary by department and job title
SELECT 
  department,
  job_title,
  AVG(salary) AS avg_salary
FROM employees
GROUP BY department, job_title;

-- Multiple aggregations
SELECT 
  category,
  COUNT(*) AS product_count,
  AVG(price) AS avg_price,
  MAX(price) AS max_price
FROM products
GROUP BY category;`} 
          />
        </div>
      </div>

      {/* Lecture 7: HAVING */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="having">
             HAVING
          </h2>
          <div className="subtitle">Duration: 7:57</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The HAVING clause filters groups created by GROUP BY. While WHERE filters individual 
            rows, HAVING filters aggregated results.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Departments with more than 10 employees
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 10;

-- Categories with average price above $100
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 100;

-- Combining WHERE and HAVING
SELECT 
  department,
  AVG(salary) AS avg_salary
FROM employees
WHERE hire_date >= '2020-01-01'
GROUP BY department
HAVING AVG(salary) > 60000;`} 
          />
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>WHERE</h3>
              <ul>
                <li>Filters rows before grouping</li>
                <li>Cannot use aggregate functions</li>
                <li>Applied to individual rows</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>HAVING</h3>
              <ul>
                <li>Filters groups after grouping</li>
                <li>Can use aggregate functions</li>
                <li>Applied to grouped results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 8: DISTINCT */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="distinct">
             DISTINCT
          </h2>
          <div className="subtitle">Duration: 3:22</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The DISTINCT keyword removes duplicate rows from your query results. It's useful when 
            you want to see unique values in a column or combination of columns.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Get unique cities
SELECT DISTINCT city
FROM customers;

-- Get unique combinations
SELECT DISTINCT country, city
FROM customers
ORDER BY country, city;

-- Count unique values
SELECT COUNT(DISTINCT department_id) AS unique_departments
FROM employees;`} 
          />
        </div>
      </div>

      {/* Lecture 9: TOP */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="top">
             TOP
          </h2>
          <div className="subtitle">Duration: 5:13</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The TOP clause limits the number of rows returned by a query. It's useful for getting 
            a sample of data or finding the top N records based on certain criteria.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Get top 10 rows
SELECT TOP 10 *
FROM orders
ORDER BY order_date DESC;

-- Get top 5 highest paid employees
SELECT TOP 5 employee_name, salary
FROM employees
ORDER BY salary DESC;

-- TOP with percentage
SELECT TOP 10 PERCENT *
FROM products
ORDER BY price DESC;

-- TOP with TIES
SELECT TOP 3 WITH TIES
  student_name, score
FROM exam_results
ORDER BY score DESC;`} 
          />
          <FunFact text="In MySQL use LIMIT, in Oracle use ROWNUM or FETCH FIRST." />
        </div>
      </div>

      {/* Lecture 10: Coding & Execution Order */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="coding-execution-order">
             Coding & Execution Order
          </h2>
          <div className="subtitle">Duration: 4:00 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Understanding the order in which SQL clauses are written versus the order they're 
            executed is crucial for writing efficient queries and avoiding errors.
          </p>
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>Coding Order (How You Write)</h3>
              <ol>
                <li>SELECT</li>
                <li>FROM</li>
                <li>WHERE</li>
                <li>GROUP BY</li>
                <li>HAVING</li>
                <li>ORDER BY</li>
              </ol>
            </div>
            <div className="comparison-col right">
              <h3>Execution Order (How SQL Processes)</h3>
              <ol>
                <li>FROM</li>
                <li>WHERE</li>
                <li>GROUP BY</li>
                <li>HAVING</li>
                <li>SELECT</li>
                <li>ORDER BY</li>
              </ol>
            </div>
          </div>
          <CodeBlock 
            language="sql" 
            code={`-- Complete query showing all clauses
SELECT 
  department,
  AVG(salary) AS avg_salary
FROM employees
WHERE hire_date >= '2020-01-01'
GROUP BY department
HAVING AVG(salary) > 60000
ORDER BY avg_salary DESC;

-- Execution order:
-- 1. FROM employees (get the table)
-- 2. WHERE hire_date >= '2020-01-01' (filter rows)
-- 3. GROUP BY department (group filtered rows)
-- 4. HAVING AVG(salary) > 60000 (filter groups)
-- 5. SELECT department, AVG(salary) (select columns)
-- 6. ORDER BY avg_salary DESC (sort results)`} 
          />
        </div>
      </div>

      {/* Lecture 11: Cool SQL Stuff */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="cool-sql-stuff">
             Cool SQL Stuff
          </h2>
          <div className="subtitle">Duration: 4:50</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Explore some interesting and useful SQL tricks that make your queries more powerful 
            and elegant. These techniques will help you write cleaner, more efficient code.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Use CASE for conditional logic
SELECT 
  employee_name,
  salary,
  CASE 
    WHEN salary < 40000 THEN 'Low'
    WHEN salary BETWEEN 40000 AND 80000 THEN 'Medium'
    ELSE 'High'
  END AS salary_category
FROM employees;

-- Use COALESCE to handle NULLs
SELECT 
  customer_name,
  COALESCE(phone, email, 'No contact') AS contact_info
FROM customers;

-- Use string functions
SELECT 
  UPPER(first_name) AS first_name_upper,
  LOWER(last_name) AS last_name_lower,
  CONCAT(first_name, ' ', last_name) AS full_name,
  LEN(email) AS email_length
FROM employees;

-- Use date functions
SELECT 
  order_date,
  YEAR(order_date) AS order_year,
  MONTH(order_date) AS order_month,
  DATEADD(day, 30, order_date) AS due_date,
  DATEDIFF(day, order_date, GETDATE()) AS days_since_order
FROM orders;`} 
          />
        </div>
      </div>

      {/* Lecture 12: Quiz */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="quiz">
            <span className="lecture-icon">📝</span> Quiz | SELECT Query
          </h2>
          <div className="subtitle">Test your knowledge</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Test your understanding of SELECT queries. This quiz covers all topics including 
            SELECT & FROM, WHERE, ORDER BY, GROUP BY, HAVING, DISTINCT, TOP, and query execution order.
          </p>
          <div style={{ 
            padding: '20px', 
            background: 'var(--card-bg)', 
            borderRadius: '8px',
            border: '2px solid var(--accent)',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 Ready to test your SELECT query skills? Complete the quiz to reinforce what you've learned!
            </p>
          </div>
        </div>
      </div>

      {/* Practice Examples - Remove old lectures 7-10 content */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="practice">Practice Examples</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Here are some comprehensive examples combining multiple concepts:
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Complex query combining multiple concepts
SELECT DISTINCT
  e.first_name + ' ' + e.last_name AS 'Employee Name',
  e.department,
  e.salary,
  e.salary * 12 AS 'Annual Salary',
  e.hire_date
FROM employees e
WHERE e.salary BETWEEN 40000 AND 80000
  AND e.department IN ('Sales', 'Marketing', 'IT')
  AND e.email LIKE '%@company.com'
  AND e.hire_date >= '2020-01-01'
ORDER BY e.department ASC, e.salary DESC;

-- Top performers query
SELECT TOP 10
  customer_id,
  customer_name,
  total_purchases,
  last_purchase_date
FROM customers
WHERE status = 'Active'
  AND total_purchases > 1000
  AND country NOT IN ('Restricted1', 'Restricted2')
ORDER BY total_purchases DESC;`} 
          />
        </div>
      </div>

      {/* Next Steps */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="next-steps">What's Next?</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Congratulations! You've mastered the SELECT statement, the foundation of SQL querying. 
            Next, you'll learn about Data Definition Language (DDL) to create and modify database 
            structures.
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
              onClick={() => onNavigate?.('data-definition-ddl' as SubsectionId)}
            >
              Continue to Data Definition (DDL) →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SelectQueryPage;
