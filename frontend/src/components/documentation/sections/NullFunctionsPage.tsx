 import React from 'react';
import CodeBlock from '../CodeBlock';
import './docs-theme.css';

interface NullFunctionsPageProps {
  initialTheme?: 'dark' | 'light';
}

const NullFunctionsPage: React.FC<NullFunctionsPageProps> = () => {
  return (
    <div className="docs-page">
      {/* Hero Section */}
      <section className="docs-hero">
        <div className="docs-hero-badge">MySQL Basics</div>
        <h1 className="docs-hero-title">NULL Functions</h1>
        <p className="docs-hero-subtitle">
          Master NULL handling in SQL with COALESCE, ISNULL, NULLIF, and IS NULL operators. 
          Learn how to handle missing data in aggregations, joins, sorting, and business logic.
        </p>
        <div className="docs-hero-meta">
          <span>⏱️ 1hr 9min</span>
          <span>📚 11 lectures</span>
          <span>🎯 Intermediate</span>
        </div>
      </section>

      {/* Lecture 1: Introduction to NULLs */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 1</span>
          <h2>Introduction to NULLs</h2>
          <span className="docs-lecture-duration">2:36</span>
        </div>
        
        <div className="docs-content">
          <p>
            NULL is a special marker in SQL that represents missing, unknown, or inapplicable data. 
            Understanding NULL is crucial because it behaves differently from other values and can 
            cause unexpected results if not handled properly.
          </p>

          <h3>What is NULL?</h3>
          <ul>
            <li>NULL means "no value" or "unknown value"</li>
            <li>NULL is NOT the same as zero, empty string, or false</li>
            <li>NULL is NOT equal to anything, not even another NULL</li>
            <li>Any operation with NULL typically results in NULL</li>
          </ul>

          <h3>Common NULL Scenarios</h3>
          <CodeBlock language="sql">
{`-- Examples of NULL values
SELECT 
    employee_id,
    first_name,
    middle_name,      -- May be NULL if not provided
    commission_pct,   -- NULL for employees without commission
    manager_id        -- NULL for top-level executives
FROM employees;`}
          </CodeBlock>

          <div className="docs-callout docs-callout-warning">
            <strong>⚠️ NULL Behavior:</strong> NULL = NULL returns NULL (not TRUE). 
            Use IS NULL or IS NOT NULL to check for NULL values.
          </div>
        </div>
      </section>

      {/* Lecture 2: COALESCE vs ISNULL */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 2</span>
          <h2>COALESCE vs ISNULL</h2>
          <span className="docs-lecture-duration">11:30</span>
        </div>
        
        <div className="docs-content">
          <p>
            COALESCE and ISNULL are functions that replace NULL values with a specified alternative. 
            While they serve similar purposes, they have important differences in functionality and usage.
          </p>

          <h3>COALESCE Function</h3>
          <p>Returns the first non-NULL value from a list of expressions.</p>
          <CodeBlock language="sql">
{`-- COALESCE syntax
COALESCE(expression1, expression2, ..., expressionN)

-- Example: Use backup contact methods
SELECT 
    customer_name,
    COALESCE(mobile_phone, home_phone, work_phone, 'No phone') AS contact_number
FROM customers;

-- Example: Calculate total with optional discount
SELECT 
    product_name,
    price,
    discount,
    price - COALESCE(discount, 0) AS final_price
FROM products;`}
          </CodeBlock>

          <h3>ISNULL Function (MySQL: IFNULL)</h3>
          <p>Replaces NULL with a specified value. Takes exactly two arguments.</p>
          <CodeBlock language="sql">
{`-- MySQL uses IFNULL
IFNULL(expression, replacement_value)

-- Example: Replace NULL commission with 0
SELECT 
    employee_name,
    salary,
    IFNULL(commission_pct, 0) AS commission
FROM employees;

-- SQL Server uses ISNULL
ISNULL(expression, replacement_value)`}
          </CodeBlock>

          <h3>Key Differences</h3>
          <div className="docs-grid-2">
            <div className="docs-card">
              <h4>COALESCE</h4>
              <ul>
                <li>ANSI SQL standard</li>
                <li>Accepts multiple arguments</li>
                <li>Returns first non-NULL value</li>
                <li>More flexible and portable</li>
              </ul>
            </div>
            <div className="docs-card">
              <h4>IFNULL/ISNULL</h4>
              <ul>
                <li>Database-specific</li>
                <li>Accepts exactly 2 arguments</li>
                <li>Simpler syntax</li>
                <li>Slightly faster performance</li>
              </ul>
            </div>
          </div>

          <div className="docs-callout docs-callout-tip">
            <strong>💡 Best Practice:</strong> Use COALESCE for portability and when you need 
            to check multiple columns. Use IFNULL for simple replacements in MySQL.
          </div>
        </div>
      </section>

      {/* Lecture 3: Handling NULL: Data Aggregation */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 3</span>
          <h2>Handling NULL: Data Aggregation</h2>
          <span className="docs-lecture-duration">3:39</span>
        </div>
        
        <div className="docs-content">
          <p>
            Aggregate functions handle NULL values in specific ways. Understanding this behavior 
            is critical for accurate data analysis and reporting.
          </p>

          <h3>How Aggregates Handle NULL</h3>
          <CodeBlock language="sql">
{`-- Most aggregate functions IGNORE NULL values
SELECT 
    COUNT(*) AS total_rows,           -- Counts all rows (including NULL)
    COUNT(commission_pct) AS has_comm, -- Counts only non-NULL values
    AVG(commission_pct) AS avg_comm,   -- Averages only non-NULL values
    SUM(commission_pct) AS sum_comm,   -- Sums only non-NULL values
    MAX(commission_pct) AS max_comm,   -- Finds max of non-NULL values
    MIN(commission_pct) AS min_comm    -- Finds min of non-NULL values
FROM employees;

-- Result interpretation:
-- If 100 employees, but only 30 have commission:
-- total_rows = 100
-- has_comm = 30
-- avg_comm = average of those 30 values (not 100)`}
          </CodeBlock>

          <h3>Common Pitfall: Average Calculation</h3>
          <CodeBlock language="sql">
{`-- WRONG: This gives incorrect average
SELECT AVG(commission_pct) FROM employees;
-- Only averages non-NULL values, ignoring employees without commission

-- CORRECT: Include zero commission employees
SELECT AVG(COALESCE(commission_pct, 0)) FROM employees;
-- Treats NULL as 0, giving true average across all employees`}
          </CodeBlock>

          <h3>Counting with NULL</h3>
          <CodeBlock language="sql">
{`-- Different counting approaches
SELECT 
    COUNT(*) AS all_employees,
    COUNT(commission_pct) AS employees_with_commission,
    COUNT(*) - COUNT(commission_pct) AS employees_without_commission,
    ROUND(COUNT(commission_pct) * 100.0 / COUNT(*), 2) AS commission_percentage
FROM employees;`}
          </CodeBlock>

          <div className="docs-callout docs-callout-warning">
            <strong>⚠️ Watch Out:</strong> AVG() ignores NULL values, which can skew your results. 
            Always consider whether NULL should be treated as 0 or excluded from calculations.
          </div>
        </div>
      </section>

      {/* Lecture 4: Handling NULL: Mathematic Operations */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 4</span>
          <h2>Handling NULL: Mathematic Operations</h2>
          <span className="docs-lecture-duration">6:10</span>
        </div>
        
        <div className="docs-content">
          <p>
            Any mathematical operation involving NULL results in NULL. This can cause unexpected 
            results in calculations if not handled properly.
          </p>

          <h3>NULL in Arithmetic</h3>
          <CodeBlock language="sql">
{`-- NULL propagates through calculations
SELECT 
    10 + NULL AS addition,        -- Result: NULL
    10 - NULL AS subtraction,     -- Result: NULL
    10 * NULL AS multiplication,  -- Result: NULL
    10 / NULL AS division,        -- Result: NULL
    NULL + NULL AS both_null;     -- Result: NULL

-- Real-world example: Salary calculation
SELECT 
    employee_name,
    base_salary,
    bonus,
    base_salary + bonus AS total_compensation  -- NULL if bonus is NULL!
FROM employees;`}
          </CodeBlock>

          <h3>Fixing NULL in Calculations</h3>
          <CodeBlock language="sql">
{`-- Use COALESCE to handle NULL in math
SELECT 
    employee_name,
    base_salary,
    bonus,
    base_salary + COALESCE(bonus, 0) AS total_compensation
FROM employees;

-- Complex calculation with multiple NULLs
SELECT 
    product_name,
    base_price,
    discount,
    tax,
    base_price 
        - COALESCE(discount, 0) 
        + COALESCE(tax, 0) AS final_price
FROM products;`}
          </CodeBlock>

          <h3>Percentage Calculations</h3>
          <CodeBlock language="sql">
{`-- Calculate commission amount
SELECT 
    employee_name,
    salary,
    commission_pct,
    -- Wrong: Returns NULL if commission_pct is NULL
    salary * commission_pct AS commission_wrong,
    -- Correct: Treats NULL as 0%
    salary * COALESCE(commission_pct, 0) AS commission_correct
FROM employees;`}
          </CodeBlock>

          <div className="docs-callout docs-callout-tip">
            <strong>💡 Pro Tip:</strong> Always use COALESCE or IFNULL when performing calculations 
            on columns that might contain NULL values to avoid unexpected NULL results.
          </div>
        </div>
      </section>

      {/* Lecture 5: Handling NULL: Joining Data */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 5</span>
          <h2>Handling NULL: Joining Data</h2>
          <span className="docs-lecture-duration">7:05</span>
        </div>
        
        <div className="docs-content">
          <p>
            NULL values in JOIN conditions require special attention. NULL never equals NULL, 
            which affects how joins work and can lead to missing data if not handled correctly.
          </p>

          <h3>NULL in JOIN Conditions</h3>
          <CodeBlock language="sql">
{`-- NULL values won't match in standard joins
SELECT 
    e.employee_name,
    e.manager_id,
    m.employee_name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
-- Employees with NULL manager_id will show NULL for manager_name

-- This is correct behavior for top-level executives`}
          </CodeBlock>

          <h3>Handling Optional Foreign Keys</h3>
          <CodeBlock language="sql">
{`-- Orders with optional customer reference
SELECT 
    o.order_id,
    o.order_date,
    o.customer_id,
    COALESCE(c.customer_name, 'Guest Customer') AS customer_name
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id;

-- Products with optional category
SELECT 
    p.product_name,
    COALESCE(c.category_name, 'Uncategorized') AS category
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id;`}
          </CodeBlock>

          <h3>Multiple Column Joins with NULL</h3>
          <CodeBlock language="sql">
{`-- Joining on multiple columns where some might be NULL
SELECT 
    a.id,
    a.country,
    a.state,
    a.city,
    b.region_name
FROM addresses a
LEFT JOIN regions b 
    ON a.country = b.country 
    AND (a.state = b.state OR (a.state IS NULL AND b.state IS NULL))
    AND (a.city = b.city OR (a.city IS NULL AND b.city IS NULL));`}
          </CodeBlock>

          <div className="docs-callout docs-callout-warning">
            <strong>⚠️ Important:</strong> NULL = NULL is always NULL (not TRUE), so rows with 
            NULL in join columns won't match. Use IS NULL checks or COALESCE if you need to match NULLs.
          </div>
        </div>
      </section>

      {/* Lecture 6: Handling NULL: Sorting Data */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 6</span>
          <h2>Handling NULL: Sorting Data</h2>
          <span className="docs-lecture-duration">5:32</span>
        </div>
        
        <div className="docs-content">
          <p>
            NULL values have a specific position in sort order, but this behavior varies by database. 
            You can control where NULLs appear in your sorted results.
          </p>

          <h3>Default NULL Sorting Behavior</h3>
          <CodeBlock language="sql">
{`-- In MySQL, NULL values sort first (lowest)
SELECT employee_name, commission_pct
FROM employees
ORDER BY commission_pct ASC;
-- NULL values appear first, then 0.05, 0.10, 0.15, etc.

SELECT employee_name, commission_pct
FROM employees
ORDER BY commission_pct DESC;
-- NULL values still appear first, then 0.15, 0.10, 0.05, etc.`}
          </CodeBlock>

          <h3>Controlling NULL Position</h3>
          <CodeBlock language="sql">
{`-- Force NULLs to appear last in ascending order
SELECT employee_name, commission_pct
FROM employees
ORDER BY commission_pct IS NULL, commission_pct ASC;

-- Force NULLs to appear last in descending order
SELECT employee_name, commission_pct
FROM employees
ORDER BY commission_pct IS NULL, commission_pct DESC;

-- Using COALESCE to treat NULL as a specific value
SELECT employee_name, commission_pct
FROM employees
ORDER BY COALESCE(commission_pct, 999) ASC;
-- NULLs treated as 999, appearing at the end`}
          </CodeBlock>

          <h3>Complex Sorting with NULL</h3>
          <CodeBlock language="sql">
{`-- Sort by multiple columns with NULL handling
SELECT 
    employee_name,
    department,
    salary,
    commission_pct
FROM employees
ORDER BY 
    department IS NULL,           -- Non-NULL departments first
    department,                   -- Then alphabetically
    commission_pct IS NULL DESC,  -- Employees with commission first
    salary DESC;                  -- Then by salary`}
          </CodeBlock>

          <div className="docs-callout docs-callout-tip">
            <strong>💡 Pro Tip:</strong> Use "column IS NULL" in ORDER BY to explicitly control 
            whether NULLs appear first or last, regardless of database defaults.
          </div>
        </div>
      </section>

      {/* Lecture 7: NULLIF */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 7</span>
          <h2>NULLIF</h2>
          <span className="docs-lecture-duration">5:57</span>
        </div>
        
        <div className="docs-content">
          <p>
            NULLIF returns NULL if two expressions are equal, otherwise returns the first expression. 
            It's useful for converting specific values to NULL, especially for avoiding division by zero.
          </p>

          <h3>NULLIF Syntax</h3>
          <CodeBlock language="sql">
{`-- NULLIF(expression1, expression2)
-- Returns NULL if expression1 = expression2
-- Otherwise returns expression1

SELECT NULLIF(10, 10) AS result;  -- Returns: NULL
SELECT NULLIF(10, 5) AS result;   -- Returns: 10
SELECT NULLIF('A', 'B') AS result; -- Returns: 'A'`}
          </CodeBlock>

          <h3>Avoiding Division by Zero</h3>
          <CodeBlock language="sql">
{`-- Problem: Division by zero error
SELECT 
    product_name,
    total_sales,
    total_returns,
    total_sales / total_returns AS return_rate  -- ERROR if total_returns = 0!
FROM products;

-- Solution: Use NULLIF to convert 0 to NULL
SELECT 
    product_name,
    total_sales,
    total_returns,
    total_sales / NULLIF(total_returns, 0) AS return_rate
FROM products;
-- Returns NULL instead of error when total_returns = 0`}
          </CodeBlock>

          <h3>Converting Sentinel Values to NULL</h3>
          <CodeBlock language="sql">
{`-- Convert placeholder values to NULL
SELECT 
    employee_name,
    NULLIF(phone, 'N/A') AS phone,
    NULLIF(email, 'unknown@example.com') AS email,
    NULLIF(department, 'UNASSIGNED') AS department
FROM employees;

-- Convert empty strings to NULL
SELECT 
    customer_name,
    NULLIF(TRIM(address), '') AS address,
    NULLIF(TRIM(notes), '') AS notes
FROM customers;`}
          </CodeBlock>

          <h3>Practical Use Cases</h3>
          <CodeBlock language="sql">
{`-- Calculate average excluding zero values
SELECT 
    AVG(NULLIF(rating, 0)) AS avg_rating_excluding_zeros
FROM product_reviews;

-- Percentage calculation with safety
SELECT 
    department,
    total_employees,
    active_employees,
    ROUND(active_employees * 100.0 / NULLIF(total_employees, 0), 2) AS active_percentage
FROM department_stats;`}
          </CodeBlock>

          <div className="docs-callout docs-callout-tip">
            <strong>💡 Common Pattern:</strong> Use NULLIF(column, 0) in denominators to safely 
            handle division and avoid errors. The result will be NULL instead of causing an error.
          </div>
        </div>
      </section>

      {/* Lecture 8: IS NULL & IS NOT NULL */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 8</span>
          <h2>IS NULL & IS NOT NULL</h2>
          <span className="docs-lecture-duration">9:41</span>
        </div>
        
        <div className="docs-content">
          <p>
            IS NULL and IS NOT NULL are the correct operators for checking NULL values. 
            Never use = NULL or != NULL, as they will not work as expected.
          </p>

          <h3>Correct NULL Checking</h3>
          <CodeBlock language="sql">
{`-- WRONG: These don't work!
SELECT * FROM employees WHERE commission_pct = NULL;   -- Returns nothing
SELECT * FROM employees WHERE commission_pct != NULL;  -- Returns nothing

-- CORRECT: Use IS NULL and IS NOT NULL
SELECT * FROM employees WHERE commission_pct IS NULL;
SELECT * FROM employees WHERE commission_pct IS NOT NULL;`}
          </CodeBlock>

          <h3>Why = NULL Doesn't Work</h3>
          <CodeBlock language="sql">
{`-- NULL comparisons always return NULL (not TRUE or FALSE)
SELECT 
    NULL = NULL AS equals,           -- Result: NULL
    NULL != NULL AS not_equals,      -- Result: NULL
    NULL > 5 AS greater,             -- Result: NULL
    NULL < 5 AS less,                -- Result: NULL
    NULL IS NULL AS is_null,         -- Result: TRUE (correct!)
    NULL IS NOT NULL AS is_not_null; -- Result: FALSE (correct!)`}
          </CodeBlock>

          <h3>Filtering with NULL</h3>
          <CodeBlock language="sql">
{`-- Find employees without commission
SELECT employee_name, salary, commission_pct
FROM employees
WHERE commission_pct IS NULL;

-- Find employees with commission
SELECT employee_name, salary, commission_pct
FROM employees
WHERE commission_pct IS NOT NULL;

-- Find employees with commission > 10%
SELECT employee_name, salary, commission_pct
FROM employees
WHERE commission_pct IS NOT NULL 
  AND commission_pct > 0.10;`}
          </CodeBlock>

          <h3>Complex NULL Conditions</h3>
          <CodeBlock language="sql">
{`-- Multiple NULL checks with AND/OR
SELECT * FROM employees
WHERE manager_id IS NULL           -- Top-level executives
   OR department_id IS NULL;       -- Unassigned employees

-- Combining NULL checks with other conditions
SELECT * FROM products
WHERE (category_id IS NULL OR category_id = 5)
  AND price > 100
  AND stock_quantity IS NOT NULL;

-- Finding incomplete records
SELECT * FROM customers
WHERE email IS NULL 
   OR phone IS NULL 
   OR address IS NULL;`}
          </CodeBlock>

          <h3>NULL in CASE Statements</h3>
          <CodeBlock language="sql">
{`-- Categorize based on NULL status
SELECT 
    employee_name,
    commission_pct,
    CASE 
        WHEN commission_pct IS NULL THEN 'No Commission'
        WHEN commission_pct = 0 THEN 'Zero Commission'
        WHEN commission_pct < 0.10 THEN 'Low Commission'
        WHEN commission_pct >= 0.10 THEN 'High Commission'
    END AS commission_category
FROM employees;`}
          </CodeBlock>

          <div className="docs-callout docs-callout-warning">
            <strong>⚠️ Critical Rule:</strong> Always use IS NULL or IS NOT NULL to check for NULL values. 
            Using = NULL or != NULL will silently fail and return no results.
          </div>
        </div>
      </section>

      {/* Lecture 9: NULL vs Empty vs Blank */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 9</span>
          <h2>NULL vs Empty vs Blank</h2>
          <span className="docs-lecture-duration">6:01</span>
        </div>
        
        <div className="docs-content">
          <p>
            NULL, empty strings, and blank strings are different concepts that are often confused. 
            Understanding these differences is crucial for proper data validation and querying.
          </p>

          <h3>The Three Concepts</h3>
          <div className="docs-grid-3">
            <div className="docs-card">
              <h4>NULL</h4>
              <p>No value exists</p>
              <CodeBlock language="sql">
{`-- NULL
column IS NULL
-- Represents missing/
-- unknown data`}
              </CodeBlock>
            </div>
            <div className="docs-card">
              <h4>Empty String</h4>
              <p>Value exists but is empty</p>
              <CodeBlock language="sql">
{`-- Empty ''
column = ''
-- String with 
-- zero length`}
              </CodeBlock>
            </div>
            <div className="docs-card">
              <h4>Blank/Whitespace</h4>
              <p>Value contains only spaces</p>
              <CodeBlock language="sql">
{`-- Blank '   '
column = '   '
-- String with only
-- whitespace`}
              </CodeBlock>
            </div>
          </div>

          <h3>Detecting Each Type</h3>
          <CodeBlock language="sql">
{`-- Find NULL values
SELECT * FROM customers WHERE email IS NULL;

-- Find empty strings
SELECT * FROM customers WHERE email = '';

-- Find blank/whitespace strings
SELECT * FROM customers WHERE TRIM(email) = '';

-- Find any "missing" data (NULL, empty, or blank)
SELECT * FROM customers 
WHERE email IS NULL 
   OR TRIM(email) = '';`}
          </CodeBlock>

          <h3>Comprehensive Data Validation</h3>
          <CodeBlock language="sql">
{`-- Categorize data quality
SELECT 
    customer_id,
    email,
    CASE 
        WHEN email IS NULL THEN 'NULL'
        WHEN email = '' THEN 'Empty String'
        WHEN TRIM(email) = '' THEN 'Whitespace Only'
        WHEN email NOT LIKE '%@%' THEN 'Invalid Format'
        ELSE 'Valid'
    END AS email_status
FROM customers;

-- Count data quality issues
SELECT 
    COUNT(*) AS total,
    COUNT(email) AS has_value,
    SUM(CASE WHEN email = '' THEN 1 ELSE 0 END) AS empty_string,
    SUM(CASE WHEN TRIM(email) = '' THEN 1 ELSE 0 END) AS whitespace_only,
    SUM(CASE WHEN email IS NULL OR TRIM(email) = '' THEN 1 ELSE 0 END) AS missing_total
FROM customers;`}
          </CodeBlock>

          <h3>Cleaning Data</h3>
          <CodeBlock language="sql">
{`-- Convert empty/blank strings to NULL
UPDATE customers
SET email = NULL
WHERE email IS NOT NULL AND TRIM(email) = '';

-- Standardize to empty string (if that's your convention)
UPDATE customers
SET email = ''
WHERE email IS NULL;`}
          </CodeBlock>

          <div className="docs-callout docs-callout-tip">
            <strong>💡 Best Practice:</strong> Choose a consistent convention for your database. 
            Either use NULL for missing data or empty strings, but not both. NULL is generally preferred.
          </div>
        </div>
      </section>

      {/* Lecture 10: Handling NULL: Data Policies */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 10</span>
          <h2>Handling NULL: Data Policies</h2>
          <span className="docs-lecture-duration">8:35</span>
        </div>
        
        <div className="docs-content">
          <p>
            Establishing clear policies for handling NULL values is essential for data integrity 
            and consistency. Use database constraints and application logic to enforce these policies.
          </p>

          <h3>Database Constraints</h3>
          <CodeBlock language="sql">
{`-- NOT NULL constraint: Prevent NULL values
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,      -- Required
    last_name VARCHAR(50) NOT NULL,       -- Required
    middle_name VARCHAR(50),              -- Optional (allows NULL)
    email VARCHAR(100) NOT NULL,          -- Required
    phone VARCHAR(20),                    -- Optional
    hire_date DATE NOT NULL,              -- Required
    salary DECIMAL(10,2) NOT NULL,        -- Required
    commission_pct DECIMAL(3,2),          -- Optional
    manager_id INT,                       -- Optional (NULL for top executives)
    department_id INT NOT NULL            -- Required
);`}
          </CodeBlock>

          <h3>Default Values vs NULL</h3>
          <CodeBlock language="sql">
{`-- Using DEFAULT to avoid NULL
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,     -- Default to 0 instead of NULL
    stock_quantity INT DEFAULT 0,         -- Default to 0 instead of NULL
    is_active BOOLEAN DEFAULT TRUE,       -- Default to TRUE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserting with defaults
INSERT INTO products (product_name, price)
VALUES ('Widget', 29.99);
-- discount and stock_quantity will be 0, not NULL`}
          </CodeBlock>

          <h3>CHECK Constraints with NULL</h3>
          <CodeBlock language="sql">
{`-- CHECK constraints allow NULL by default
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    order_date DATE NOT NULL,
    ship_date DATE,
    -- This CHECK allows NULL ship_date but validates when present
    CONSTRAINT chk_ship_after_order 
        CHECK (ship_date IS NULL OR ship_date >= order_date),
    
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2),
    -- Discount can't exceed total
    CONSTRAINT chk_discount 
        CHECK (discount_amount IS NULL OR discount_amount <= total_amount)
);`}
          </CodeBlock>

          <h3>Application-Level NULL Handling</h3>
          <CodeBlock language="sql">
{`-- Data validation query
SELECT 
    'employees' AS table_name,
    COUNT(*) AS total_rows,
    SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) AS null_emails,
    SUM(CASE WHEN phone IS NULL THEN 1 ELSE 0 END) AS null_phones,
    SUM(CASE WHEN manager_id IS NULL THEN 1 ELSE 0 END) AS null_managers
FROM employees;

-- Find incomplete records
SELECT * FROM customers
WHERE email IS NULL 
   OR phone IS NULL 
   OR address IS NULL
ORDER BY customer_id;`}
          </CodeBlock>

          <h3>NULL Handling Best Practices</h3>
          <div className="docs-grid-2">
            <div className="docs-card">
              <h4>✅ Do</h4>
              <ul>
                <li>Use NOT NULL for required fields</li>
                <li>Use DEFAULT values when appropriate</li>
                <li>Document NULL meaning for each column</li>
                <li>Use IS NULL / IS NOT NULL for checks</li>
                <li>Handle NULL in calculations with COALESCE</li>
              </ul>
            </div>
            <div className="docs-card">
              <h4>❌ Don't</h4>
              <ul>
                <li>Mix NULL and empty strings</li>
                <li>Use = NULL or != NULL</li>
                <li>Forget NULL in aggregate functions</li>
                <li>Allow NULL in foreign keys unnecessarily</li>
                <li>Use NULL for boolean logic (use TRUE/FALSE)</li>
              </ul>
            </div>
          </div>

          <div className="docs-callout docs-callout-tip">
            <strong>💡 Design Principle:</strong> Make required fields NOT NULL at the database level. 
            Use NULL only for truly optional data where "unknown" or "not applicable" is meaningful.
          </div>
        </div>
      </section>

      {/* Lecture 11: NULL Summary */}
      <section className="docs-lecture">
        <div className="docs-lecture-header">
          <span className="docs-lecture-number">Lecture 11</span>
          <h2>NULL Summary</h2>
          <span className="docs-lecture-duration">1:52</span>
        </div>
        
        <div className="docs-content">
          <p>
            Let's recap the key concepts and functions for handling NULL values in SQL.
          </p>

          <h3>Key NULL Functions</h3>
          <div className="docs-grid-2">
            <div className="docs-card">
              <h4>COALESCE</h4>
              <p>Returns first non-NULL value</p>
              <CodeBlock language="sql">
{`COALESCE(col1, col2, 'default')`}
              </CodeBlock>
            </div>
            <div className="docs-card">
              <h4>IFNULL</h4>
              <p>Replaces NULL with value</p>
              <CodeBlock language="sql">
{`IFNULL(column, 0)`}
              </CodeBlock>
            </div>
            <div className="docs-card">
              <h4>NULLIF</h4>
              <p>Returns NULL if values equal</p>
              <CodeBlock language="sql">
{`NULLIF(column, 0)`}
              </CodeBlock>
            </div>
            <div className="docs-card">
              <h4>IS NULL / IS NOT NULL</h4>
              <p>Check for NULL values</p>
              <CodeBlock language="sql">
{`WHERE column IS NULL`}
              </CodeBlock>
            </div>
          </div>

          <h3>Critical NULL Rules</h3>
          <div className="docs-callout docs-callout-info">
            <ol>
              <li><strong>NULL ≠ NULL:</strong> NULL never equals anything, including itself</li>
              <li><strong>Use IS NULL:</strong> Never use = NULL or != NULL</li>
              <li><strong>Math with NULL:</strong> Any operation with NULL returns NULL</li>
              <li><strong>Aggregates ignore NULL:</strong> COUNT, SUM, AVG skip NULL values</li>
              <li><strong>COALESCE for safety:</strong> Use in calculations to avoid NULL results</li>
              <li><strong>NOT NULL constraints:</strong> Enforce at database level for required fields</li>
            </ol>
          </div>

          <h3>Common NULL Patterns</h3>
          <CodeBlock language="sql">
{`-- Replace NULL in calculations
SELECT salary * COALESCE(commission_pct, 0) FROM employees;

-- Avoid division by zero
SELECT revenue / NULLIF(quantity, 0) FROM sales;

-- Check for NULL
SELECT * FROM table WHERE column IS NULL;

-- Sort with NULL control
SELECT * FROM table ORDER BY column IS NULL, column;

-- Count non-NULL values
SELECT COUNT(column) FROM table;

-- Handle NULL in joins
SELECT * FROM a LEFT JOIN b ON a.id = b.id
WHERE COALESCE(b.status, 'pending') = 'active';`}
          </CodeBlock>

          <h3>What's Next?</h3>
          <p>
            Now that you understand NULL handling, you're ready to learn about CASE WHEN statements 
            for conditional logic and complex data transformations.
          </p>
        </div>
      </section>

      {/* Practice Quiz */}
      <section className="docs-quiz">
        <h2>🎯 Practice Quiz</h2>
        <p>Test your understanding of NULL functions:</p>
        
        <div className="docs-quiz-question">
          <h3>Question 1: What does this query return?</h3>
          <CodeBlock language="sql">
{`SELECT COUNT(*), COUNT(commission_pct) 
FROM employees 
WHERE department_id = 10;`}
          </CodeBlock>
          <details>
            <summary>Show Answer</summary>
            <p>
              COUNT(*) returns the total number of employees in department 10, while 
              COUNT(commission_pct) returns only the count of employees who have a non-NULL 
              commission_pct value. COUNT() ignores NULL values.
            </p>
          </details>
        </div>

        <div className="docs-quiz-question">
          <h3>Question 2: Fix this query to avoid division by zero</h3>
          <CodeBlock language="sql">
{`SELECT product_name, 
       total_revenue / total_quantity AS avg_price
FROM products;`}
          </CodeBlock>
          <details>
            <summary>Show Answer</summary>
            <CodeBlock language="sql">
{`SELECT product_name, 
       total_revenue / NULLIF(total_quantity, 0) AS avg_price
FROM products;`}
            </CodeBlock>
            <p>
              Use NULLIF(total_quantity, 0) to convert 0 to NULL, which prevents division 
              by zero errors and returns NULL instead.
            </p>
          </details>
        </div>

        <div className="docs-quiz-question">
          <h3>Question 3: What's wrong with this WHERE clause?</h3>
          <CodeBlock language="sql">
{`SELECT * FROM employees 
WHERE manager_id = NULL;`}
          </CodeBlock>
          <details>
            <summary>Show Answer</summary>
            <CodeBlock language="sql">
{`SELECT * FROM employees 
WHERE manager_id IS NULL;`}
            </CodeBlock>
            <p>
              Never use = NULL. Always use IS NULL to check for NULL values. The expression 
              "manager_id = NULL" always evaluates to NULL (not TRUE), so no rows are returned.
            </p>
          </details>
        </div>

        <div className="docs-quiz-question">
          <h3>Question 4: What does COALESCE return here?</h3>
          <CodeBlock language="sql">
{`SELECT COALESCE(NULL, NULL, 'default', 'backup');`}
          </CodeBlock>
          <details>
            <summary>Show Answer</summary>
            <p>
              Returns 'default'. COALESCE returns the first non-NULL value in the list, 
              which is 'default'. It never reaches 'backup'.
            </p>
          </details>
        </div>

        <div className="docs-quiz-question">
          <h3>Question 5: Calculate total compensation correctly</h3>
          <CodeBlock language="sql">
{`-- salary and bonus columns, bonus can be NULL
SELECT employee_name, salary + bonus AS total
FROM employees;`}
          </CodeBlock>
          <details>
            <summary>Show Answer</summary>
            <CodeBlock language="sql">
{`SELECT employee_name, 
       salary + COALESCE(bonus, 0) AS total
FROM employees;`}
            </CodeBlock>
            <p>
              Without COALESCE, if bonus is NULL, the entire calculation returns NULL. 
              Use COALESCE(bonus, 0) to treat NULL as 0 in the calculation.
            </p>
          </details>
        </div>
      </section>

      {/* Comprehensive Example */}
      <section className="docs-example">
        <h2>💼 Real-World Example: Employee Compensation Report</h2>
        <p>
          Let's build a comprehensive employee compensation report that properly handles 
          NULL values in various scenarios.
        </p>

        <CodeBlock language="sql">
{`-- Create sample data with various NULL scenarios
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    base_salary DECIMAL(10,2) NOT NULL,
    bonus DECIMAL(10,2),
    commission_pct DECIMAL(3,2),
    sales_amount DECIMAL(10,2),
    manager_id INT,
    hire_date DATE NOT NULL
);

-- Comprehensive compensation report
SELECT 
    employee_id,
    employee_name,
    COALESCE(department, 'Unassigned') AS department,
    
    -- Base compensation
    base_salary,
    COALESCE(bonus, 0) AS bonus,
    
    -- Commission calculation
    COALESCE(commission_pct, 0) AS commission_rate,
    COALESCE(sales_amount, 0) AS sales,
    COALESCE(sales_amount * commission_pct, 0) AS commission_earned,
    
    -- Total compensation
    base_salary 
        + COALESCE(bonus, 0) 
        + COALESCE(sales_amount * commission_pct, 0) AS total_compensation,
    
    -- Management status
    CASE 
        WHEN manager_id IS NULL THEN 'Executive'
        ELSE 'Staff'
    END AS employee_level,
    
    -- Compensation analysis
    CASE 
        WHEN commission_pct IS NULL THEN 'No Commission Structure'
        WHEN commission_pct = 0 THEN 'Zero Commission'
        WHEN sales_amount IS NULL OR sales_amount = 0 THEN 'No Sales Yet'
        WHEN sales_amount * commission_pct > bonus THEN 'Commission > Bonus'
        ELSE 'Bonus >= Commission'
    END AS compensation_analysis,
    
    -- Data completeness score
    (CASE WHEN department IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN bonus IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN commission_pct IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN sales_amount IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN manager_id IS NOT NULL THEN 1 ELSE 0 END) AS data_completeness_score
     
FROM employees
ORDER BY total_compensation DESC;

-- Summary statistics with NULL handling
SELECT 
    COALESCE(department, 'Unassigned') AS department,
    COUNT(*) AS employee_count,
    
    -- Salary statistics
    ROUND(AVG(base_salary), 2) AS avg_salary,
    ROUND(MIN(base_salary), 2) AS min_salary,
    ROUND(MAX(base_salary), 2) AS max_salary,
    
    -- Bonus statistics (excluding NULL)
    COUNT(bonus) AS employees_with_bonus,
    ROUND(AVG(bonus), 2) AS avg_bonus_when_given,
    ROUND(AVG(COALESCE(bonus, 0)), 2) AS avg_bonus_including_zeros,
    
    -- Commission statistics
    COUNT(commission_pct) AS employees_with_commission,
    ROUND(AVG(COALESCE(sales_amount * commission_pct, 0)), 2) AS avg_commission,
    
    -- Overall compensation
    ROUND(AVG(base_salary + COALESCE(bonus, 0) + 
              COALESCE(sales_amount * commission_pct, 0)), 2) AS avg_total_comp
              
FROM employees
GROUP BY COALESCE(department, 'Unassigned')
ORDER BY avg_total_comp DESC;`}
        </CodeBlock>

        <p>
          This example demonstrates proper NULL handling in calculations, aggregations, 
          conditional logic, and reporting scenarios.
        </p>
      </section>

      {/* Best Practices */}
      <section className="docs-best-practices">
        <h2>✨ Best Practices</h2>
        <div className="docs-grid-2">
          <div className="docs-card">
            <h3>Database Design</h3>
            <ul>
              <li>Use NOT NULL for required fields</li>
              <li>Provide DEFAULT values when appropriate</li>
              <li>Document what NULL means for each column</li>
              <li>Be consistent: don't mix NULL and empty strings</li>
              <li>Consider using CHECK constraints with NULL</li>
            </ul>
          </div>
          <div className="docs-card">
            <h3>Query Writing</h3>
            <ul>
              <li>Always use IS NULL / IS NOT NULL for checks</li>
              <li>Use COALESCE in calculations to avoid NULL results</li>
              <li>Use NULLIF to prevent division by zero</li>
              <li>Remember aggregates ignore NULL values</li>
              <li>Control NULL position in ORDER BY</li>
            </ul>
          </div>
          <div className="docs-card">
            <h3>Data Quality</h3>
            <ul>
              <li>Validate data completeness regularly</li>
              <li>Clean up inconsistent NULL usage</li>
              <li>Monitor NULL percentages in reports</li>
              <li>Handle NULL appropriately in business logic</li>
              <li>Test edge cases with NULL values</li>
            </ul>
          </div>
          <div className="docs-card">
            <h3>Performance</h3>
            <ul>
              <li>Indexes can include NULL values</li>
              <li>IS NULL can use indexes efficiently</li>
              <li>COALESCE is generally fast</li>
              <li>Avoid complex NULL handling in WHERE clauses</li>
              <li>Consider computed columns for complex NULL logic</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="docs-next-steps">
        <h2>🚀 What's Next?</h2>
        <p>
          You've mastered NULL handling! Continue your SQL journey with these topics:
        </p>
        <div className="docs-grid-3">
          <div className="docs-card">
            <h3>📊 CASE WHEN</h3>
            <p>Learn conditional logic and complex transformations with CASE statements</p>
          </div>
          <div className="docs-card">
            <h3>🪟 Window Functions</h3>
            <p>Master advanced analytics with window functions and partitioning</p>
          </div>
          <div className="docs-card">
            <h3>🔄 Subqueries</h3>
            <p>Write complex queries with subqueries and common table expressions</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NullFunctionsPage;
