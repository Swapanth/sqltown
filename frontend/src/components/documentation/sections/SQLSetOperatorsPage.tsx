import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface SQLSetOperatorsPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const SQLSetOperatorsPage: React.FC<SQLSetOperatorsPageProps> = ({ initialTheme = 'dark', onNavigate }) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}}
      breadcrumb={{ section: 'basics', subsection: 'sql-set-operators' }}
      currentSection="sql-set-operators"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>🔀 MySQL Basics</span>
        </div>
        <h1>SQL SET Operators</h1>
        <p className="description">
          Learn to combine results from multiple queries using SET operators. Master UNION, INTERSECT, 
          and EXCEPT to merge, find common, or exclude data from different result sets.
        </p>
        <DifficultyBadge level="intermediate" />
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          9 lectures • 45min
        </div>
      </div>

      <FunFact text="SET operators work on entire result sets, not individual rows - they're based on mathematical set theory!" />

      {/* Lecture 1: Introduction to SET Operators */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="intro-set-operators">
            <span className="lecture-icon">▶️</span> Introduction to SET Operators
          </h2>
          <div className="subtitle">Duration: 0:33 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SET operators combine the results of two or more SELECT statements into a single result set. 
            Unlike JOINs which combine columns, SET operators combine rows.
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">UNION</span>
              </div>
              <div className="simple">Combines results, removes duplicates</div>
              <div className="example">A ∪ B</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">UNION ALL</span>
              </div>
              <div className="simple">Combines results, keeps duplicates</div>
              <div className="example">A + B (all rows)</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">INTERSECT</span>
              </div>
              <div className="simple">Returns only common rows</div>
              <div className="example">A ∩ B</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">EXCEPT</span>
              </div>
              <div className="simple">Returns rows in first, not in second</div>
              <div className="example">A - B</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 2: SET Rules & Syntax */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="set-rules-syntax">
            <span className="lecture-icon">▶️</span> SET Rules & Syntax
          </h2>
          <div className="subtitle">Duration: 11:58</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SET operators have specific rules that must be followed for queries to work correctly. 
            Understanding these rules is essential before using SET operators.
          </p>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Rule 1: Same Number of Columns</h3>
          <CodeBlock 
            language="sql" 
            code={`-- CORRECT: Both queries have 2 columns
SELECT first_name, last_name FROM employees
UNION
SELECT first_name, last_name FROM contractors;

-- INCORRECT: Different number of columns
SELECT first_name, last_name FROM employees
UNION
SELECT first_name FROM contractors;  -- ERROR!`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Rule 2: Compatible Data Types</h3>
          <CodeBlock 
            language="sql" 
            code={`-- CORRECT: Compatible types (both text)
SELECT customer_name FROM customers
UNION
SELECT supplier_name FROM suppliers;

-- INCORRECT: Incompatible types
SELECT customer_id FROM customers  -- INT
UNION
SELECT customer_name FROM customers;  -- VARCHAR - ERROR!`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Rule 3: Column Names from First Query</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Result uses column names from first SELECT
SELECT first_name, last_name FROM employees
UNION
SELECT fname, lname FROM contractors;
-- Result columns: first_name, last_name

-- Use aliases in first query to control names
SELECT first_name AS name, last_name AS surname FROM employees
UNION
SELECT fname, lname FROM contractors;
-- Result columns: name, surname`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Rule 4: ORDER BY at the End</h3>
          <CodeBlock 
            language="sql" 
            code={`-- CORRECT: ORDER BY after all SET operations
SELECT first_name, salary FROM employees
UNION
SELECT first_name, salary FROM contractors
ORDER BY salary DESC;

-- INCORRECT: ORDER BY in individual queries
SELECT first_name, salary FROM employees ORDER BY salary
UNION
SELECT first_name, salary FROM contractors;  -- ERROR!`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Basic Syntax Pattern</h3>
          <CodeBlock 
            language="sql" 
            code={`-- General SET operator syntax
SELECT column1, column2, ...
FROM table1
WHERE condition

SET_OPERATOR

SELECT column1, column2, ...
FROM table2
WHERE condition

ORDER BY column1;`} 
          />
        </div>
      </div>

      {/* Lecture 3: UNION */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="union">
            <span className="lecture-icon">▶️</span> UNION
          </h2>
          <div className="subtitle">Duration: 5:25</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            UNION combines the results of two or more SELECT statements and removes duplicate rows. 
            It's useful when you want to merge data from similar tables or queries.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic UNION
SELECT city FROM customers
UNION
SELECT city FROM suppliers;
-- Returns unique cities from both tables

-- UNION with multiple queries
SELECT product_name, 'In Stock' AS status FROM products WHERE stock > 0
UNION
SELECT product_name, 'Out of Stock' AS status FROM products WHERE stock = 0
UNION
SELECT product_name, 'Discontinued' AS status FROM products WHERE discontinued = 1;

-- UNION with WHERE clauses
SELECT employee_name, department FROM employees WHERE location = 'New York'
UNION
SELECT employee_name, department FROM employees WHERE location = 'London'
ORDER BY employee_name;

-- UNION with different tables
SELECT 
  customer_id AS id,
  customer_name AS name,
  'Customer' AS type
FROM customers
UNION
SELECT 
  supplier_id AS id,
  supplier_name AS name,
  'Supplier' AS type
FROM suppliers
ORDER BY name;`} 
          />
          <FunFact text="UNION automatically removes duplicates by sorting and comparing rows, which can be slower than UNION ALL!" />
        </div>
      </div>

      {/* Lecture 4: UNION ALL */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="union-all">
            <span className="lecture-icon">▶️</span> UNION ALL
          </h2>
          <div className="subtitle">Duration: 3:54</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            UNION ALL combines results from multiple queries but keeps all rows, including duplicates. 
            It's faster than UNION because it doesn't need to check for duplicates.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- UNION ALL keeps duplicates
SELECT city FROM customers
UNION ALL
SELECT city FROM suppliers;
-- Returns all cities, including duplicates

-- Performance example
SELECT product_name FROM products WHERE category = 'Electronics'
UNION ALL
SELECT product_name FROM products WHERE price > 1000;
-- Faster than UNION, keeps duplicates if any

-- Combining logs from multiple sources
SELECT log_date, log_message, 'App Server' AS source FROM app_logs
UNION ALL
SELECT log_date, log_message, 'DB Server' AS source FROM db_logs
UNION ALL
SELECT log_date, log_message, 'Web Server' AS source FROM web_logs
ORDER BY log_date DESC;`} 
          />
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>UNION</h3>
              <ul>
                <li>Removes duplicate rows</li>
                <li>Slower (needs to sort/compare)</li>
                <li>Returns unique results</li>
                <li>Use when duplicates matter</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>UNION ALL</h3>
              <ul>
                <li>Keeps all rows including duplicates</li>
                <li>Faster (no duplicate check)</li>
                <li>Returns all results</li>
                <li>Use when duplicates don't matter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 5: EXCEPT */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="except">
            <span className="lecture-icon">▶️</span> EXCEPT
          </h2>
          <div className="subtitle">Duration: 5:18</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            EXCEPT returns rows from the first query that are NOT in the second query. It's useful 
            for finding differences between datasets. Note: MySQL uses EXCEPT, some databases use MINUS.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic EXCEPT
SELECT city FROM customers
EXCEPT
SELECT city FROM suppliers;
-- Returns cities where customers exist but no suppliers

-- Find products never ordered
SELECT product_id FROM products
EXCEPT
SELECT DISTINCT product_id FROM order_items;

-- Find employees not assigned to projects
SELECT employee_id, employee_name FROM employees
EXCEPT
SELECT employee_id, employee_name FROM project_assignments;

-- MySQL alternative (EXCEPT not supported in older versions)
SELECT city FROM customers
WHERE city NOT IN (SELECT city FROM suppliers);

-- Or using LEFT JOIN
SELECT DISTINCT c.city
FROM customers c
LEFT JOIN suppliers s ON c.city = s.city
WHERE s.city IS NULL;`} 
          />
          <div style={{ 
            padding: '20px', 
            background: '#d1ecf1', 
            borderRadius: '8px',
            border: '2px solid #0c5460',
            marginTop: '24px',
            color: '#0c5460'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 NOTE: EXCEPT is supported in MySQL 8.0.31+. For older versions, use NOT IN or LEFT JOIN with IS NULL.
            </p>
          </div>
        </div>
      </div>

      {/* Lecture 6: INTERSECT */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="intersect">
            <span className="lecture-icon">▶️</span> INTERSECT
          </h2>
          <div className="subtitle">Duration: 2:36</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            INTERSECT returns only the rows that appear in both query results. It finds the common 
            elements between two datasets.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic INTERSECT
SELECT city FROM customers
INTERSECT
SELECT city FROM suppliers;
-- Returns cities that have both customers AND suppliers

-- Find employees who are also managers
SELECT employee_id FROM employees
INTERSECT
SELECT manager_id FROM departments;

-- MySQL alternative (INTERSECT not supported in older versions)
SELECT city FROM customers
WHERE city IN (SELECT city FROM suppliers);

-- Or using INNER JOIN
SELECT DISTINCT c.city
FROM customers c
INNER JOIN suppliers s ON c.city = s.city;

-- Find products in multiple categories
SELECT product_id FROM category_electronics
INTERSECT
SELECT product_id FROM category_featured;`} 
          />
          <div style={{ 
            padding: '20px', 
            background: '#d1ecf1', 
            borderRadius: '8px',
            border: '2px solid #0c5460',
            marginTop: '24px',
            color: '#0c5460'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 NOTE: INTERSECT is supported in MySQL 8.0.31+. For older versions, use IN or INNER JOIN.
            </p>
          </div>
        </div>
      </div>

      {/* Lecture 7: Use Case: Combine Information */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="usecase-combine">
            <span className="lecture-icon">▶️</span> Use Case: Combine Information
          </h2>
          <div className="subtitle">Duration: 9:43</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Real-world example: Combining contact information from multiple sources into a unified list.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Combine all contacts from different sources
SELECT 
  customer_id AS contact_id,
  customer_name AS name,
  email,
  phone,
  'Customer' AS contact_type,
  country
FROM customers

UNION

SELECT 
  supplier_id AS contact_id,
  supplier_name AS name,
  email,
  phone,
  'Supplier' AS contact_type,
  country
FROM suppliers

UNION

SELECT 
  employee_id AS contact_id,
  CONCAT(first_name, ' ', last_name) AS name,
  email,
  phone,
  'Employee' AS contact_type,
  'USA' AS country
FROM employees

ORDER BY name;

-- Create a mailing list
SELECT email, 'Customer' AS source FROM customers WHERE newsletter = 1
UNION
SELECT email, 'Prospect' AS source FROM prospects WHERE interested = 1
UNION
SELECT email, 'Partner' AS source FROM partners WHERE active = 1
ORDER BY email;

-- Combine sales data from multiple regions
SELECT 
  sale_date,
  product_id,
  quantity,
  amount,
  'North' AS region
FROM sales_north
WHERE sale_date >= '2024-01-01'

UNION ALL

SELECT 
  sale_date,
  product_id,
  quantity,
  amount,
  'South' AS region
FROM sales_south
WHERE sale_date >= '2024-01-01'

UNION ALL

SELECT 
  sale_date,
  product_id,
  quantity,
  amount,
  'East' AS region
FROM sales_east
WHERE sale_date >= '2024-01-01'

ORDER BY sale_date, region;`} 
          />
        </div>
      </div>

      {/* Lecture 8: Use Case: Delta Detection */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="usecase-delta">
            <span className="lecture-icon">▶️</span> Use Case: Delta Detection
          </h2>
          <div className="subtitle">Duration: 3:55</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Real-world example: Finding changes between two datasets, such as new, modified, or deleted records.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Find new customers (in current month, not in previous)
SELECT customer_id, customer_name FROM customers_current_month
EXCEPT
SELECT customer_id, customer_name FROM customers_previous_month;

-- Find deleted records
SELECT product_id, product_name FROM products_yesterday
EXCEPT
SELECT product_id, product_name FROM products_today;

-- Find modified records (changed in any way)
-- Records in either but not in both = changed
(SELECT * FROM inventory_yesterday
 EXCEPT
 SELECT * FROM inventory_today)
UNION
(SELECT * FROM inventory_today
 EXCEPT
 SELECT * FROM inventory_yesterday);

-- Data synchronization check
-- Find records in source but not in target
SELECT order_id, customer_id, order_date
FROM source_orders
EXCEPT
SELECT order_id, customer_id, order_date
FROM target_orders;`} 
          />
          <FunFact text="Delta detection is crucial for data warehousing, ETL processes, and keeping systems synchronized!" />
        </div>
      </div>

      {/* Lecture 9: SET Operators Summary */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="set-summary">
            <span className="lecture-icon">▶️</span> SET Operators Summary
          </h2>
          <div className="subtitle">Duration: 2:02</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Let's summarize all SET operators and when to use each one.
          </p>
          
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">UNION</span>
              </div>
              <div className="simple">Combine + Remove duplicates</div>
              <div className="example">Merge unique records</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">UNION ALL</span>
              </div>
              <div className="simple">Combine + Keep duplicates</div>
              <div className="example">Fast merge, all records</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">INTERSECT</span>
              </div>
              <div className="simple">Only common rows</div>
              <div className="example">Find matches</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">EXCEPT</span>
              </div>
              <div className="simple">First minus second</div>
              <div className="example">Find differences</div>
            </div>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Quick Reference Table</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginTop: '16px'
            }}>
              <thead>
                <tr style={{ background: 'var(--card-bg)', borderBottom: '2px solid var(--accent)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Operator</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Returns</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Duplicates</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>UNION</td>
                  <td style={{ padding: '12px' }}>All unique rows from both</td>
                  <td style={{ padding: '12px' }}>Removed</td>
                  <td style={{ padding: '12px' }}>Merge lists</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>UNION ALL</td>
                  <td style={{ padding: '12px' }}>All rows from both</td>
                  <td style={{ padding: '12px' }}>Kept</td>
                  <td style={{ padding: '12px' }}>Fast merge</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>INTERSECT</td>
                  <td style={{ padding: '12px' }}>Only common rows</td>
                  <td style={{ padding: '12px' }}>Removed</td>
                  <td style={{ padding: '12px' }}>Find overlap</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', fontWeight: 600 }}>EXCEPT</td>
                  <td style={{ padding: '12px' }}>Rows in first, not second</td>
                  <td style={{ padding: '12px' }}>Removed</td>
                  <td style={{ padding: '12px' }}>Find differences</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Key Takeaways</h3>
          <ul className="prose">
            <li>SET operators work on complete result sets, not individual rows</li>
            <li>All queries must have same number of columns with compatible types</li>
            <li>Column names come from the first query</li>
            <li>ORDER BY goes at the end, after all SET operations</li>
            <li>UNION ALL is faster than UNION (no duplicate check)</li>
            <li>INTERSECT and EXCEPT may not be available in older MySQL versions</li>
          </ul>
        </div>
      </div>

      {/* Quiz */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="quiz">
            <span className="lecture-icon">📝</span> Quiz | SQL SET Operators
          </h2>
          <div className="subtitle">Test your knowledge</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Test your understanding of SQL SET Operators. This quiz covers UNION, UNION ALL, 
            INTERSECT, EXCEPT, and their practical applications.
          </p>
          <div style={{ 
            padding: '20px', 
            background: 'var(--card-bg)', 
            borderRadius: '8px',
            border: '2px solid var(--accent)',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 Ready to test your SET operator knowledge? Complete the quiz to reinforce what you've learned!
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Example */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="comprehensive-example">Comprehensive SET Operators Example</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Here's a complex example using multiple SET operators together:
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Complex business scenario: Customer segmentation
-- Active customers who made purchases this year
SELECT customer_id, customer_name, 'Active Buyer' AS segment
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE YEAR(o.order_date) = 2024
GROUP BY c.customer_id, c.customer_name

UNION

-- Newsletter subscribers who haven't purchased
SELECT customer_id, customer_name, 'Newsletter Only' AS segment
FROM customers
WHERE newsletter_subscribed = 1
  AND customer_id NOT IN (
    SELECT customer_id FROM orders WHERE YEAR(order_date) = 2024
  )

UNION

-- VIP customers (high lifetime value)
SELECT customer_id, customer_name, 'VIP' AS segment
FROM customers
WHERE lifetime_value > 10000

ORDER BY segment, customer_name;

-- Data reconciliation example
-- Find discrepancies between two systems
(
  -- In System A but not in System B
  SELECT 'Missing in B' AS issue, product_id, product_name
  FROM system_a_products
  EXCEPT
  SELECT 'Missing in B', product_id, product_name
  FROM system_b_products
)
UNION ALL
(
  -- In System B but not in System A
  SELECT 'Missing in A' AS issue, product_id, product_name
  FROM system_b_products
  EXCEPT
  SELECT 'Missing in A', product_id, product_name
  FROM system_a_products
)
ORDER BY issue, product_id;`} 
          />
        </div>
      </div>

      {/* Best Practices */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="best-practices">SET Operators Best Practices</h2>
        </div>
        <div className="doc-card-body">
          <ul className="prose">
            <li><strong>Use UNION ALL when possible:</strong> It's faster if duplicates don't matter</li>
            <li><strong>Ensure column compatibility:</strong> Same number and compatible types</li>
            <li><strong>Use meaningful column aliases:</strong> In the first query for clarity</li>
            <li><strong>Add source indicators:</strong> Include a column showing data origin</li>
            <li><strong>Test queries separately first:</strong> Verify each query before combining</li>
            <li><strong>Consider performance:</strong> SET operations can be expensive on large datasets</li>
            <li><strong>Use parentheses for clarity:</strong> When combining multiple SET operators</li>
            <li><strong>Check MySQL version:</strong> INTERSECT and EXCEPT require 8.0.31+</li>
            <li><strong>Index appropriately:</strong> Columns used in SET operations benefit from indexes</li>
          </ul>
        </div>
      </div>

      {/* MySQL Version Alternatives */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="mysql-alternatives">MySQL Version Alternatives</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            For older MySQL versions that don't support INTERSECT and EXCEPT:
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- INTERSECT alternative using IN
SELECT city FROM customers
WHERE city IN (SELECT city FROM suppliers);

-- INTERSECT alternative using INNER JOIN
SELECT DISTINCT c.city
FROM customers c
INNER JOIN suppliers s ON c.city = s.city;

-- EXCEPT alternative using NOT IN
SELECT city FROM customers
WHERE city NOT IN (SELECT city FROM suppliers);

-- EXCEPT alternative using LEFT JOIN
SELECT DISTINCT c.city
FROM customers c
LEFT JOIN suppliers s ON c.city = s.city
WHERE s.city IS NULL;

-- INTERSECT alternative using EXISTS
SELECT DISTINCT city
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM suppliers s WHERE s.city = c.city
);`} 
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
            Great work! You now understand how to combine query results using SET operators. 
            Next, you'll learn about String Functions to manipulate text data in SQL.
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
              onClick={() => onNavigate?.('string-functions' as SubsectionId)}
            >
              Continue to String Functions →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SQLSetOperatorsPage;
