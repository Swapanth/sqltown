import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface SQLJoinsPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const SQLJoinsPage: React.FC<SQLJoinsPageProps> = ({ initialTheme = 'dark', onNavigate }) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}}
      breadcrumb={{ section: 'basics', subsection: 'sql-joins' }}
      currentSection="sql-joins"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>🔗 MySQL Basics</span>
        </div>
        <h1>SQL Joins</h1>
        <p className="description">
          Master the art of combining data from multiple tables. Learn all types of joins including 
          INNER, LEFT, RIGHT, FULL, CROSS, and ANTI joins to retrieve related data effectively.
        </p>
        <DifficultyBadge level="intermediate" />
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          13 lectures • 1hr 16min
        </div>
      </div>

      <FunFact text="JOINs are one of the most powerful features in SQL - they allow you to combine data from multiple tables based on related columns!" />

      {/* Lecture 1: Intro What is Combining Data */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="intro-combining-data">
            <span className="lecture-icon">▶️</span> Intro What is Combining Data
          </h2>
          <div className="subtitle">Duration: 1:33</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            In relational databases, data is often split across multiple tables to avoid redundancy. 
            Combining data means bringing together information from different tables based on their 
            relationships to create meaningful results.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Example: Two separate tables
-- Customers table
customer_id | customer_name | email
1          | John Doe      | john@email.com
2          | Jane Smith    | jane@email.com

-- Orders table
order_id | customer_id | order_date  | total
101      | 1          | 2024-01-15  | 250.00
102      | 1          | 2024-02-20  | 180.00
103      | 2          | 2024-03-10  | 320.00

-- Combining them gives complete information
customer_name | order_id | order_date  | total
John Doe     | 101      | 2024-01-15  | 250.00
John Doe     | 102      | 2024-02-20  | 180.00
Jane Smith   | 103      | 2024-03-10  | 320.00`} 
          />
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Why Split Data?</span>
              </div>
              <div className="simple">Avoid duplication, maintain consistency</div>
              <div className="example">One customer, many orders</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Why Combine?</span>
              </div>
              <div className="simple">Get complete picture of related data</div>
              <div className="example">Customer info + their orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 2: Introduction to JOINs */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="introduction-joins">
            <span className="lecture-icon">▶️</span> Introduction to JOINs
          </h2>
          <div className="subtitle">Duration: 8:57 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            A JOIN clause is used to combine rows from two or more tables based on a related column 
            between them. Understanding joins is crucial for working with relational databases.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic JOIN syntax
SELECT columns
FROM table1
JOIN table2 ON table1.column = table2.column;

-- Real example
SELECT 
  customers.customer_name,
  orders.order_id,
  orders.order_date,
  orders.total
FROM customers
JOIN orders ON customers.customer_id = orders.customer_id;`} 
          />
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">JOIN Condition</span>
              </div>
              <div className="simple">Specifies how tables relate</div>
              <div className="example">ON customers.id = orders.customer_id</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Foreign Key</span>
              </div>
              <div className="simple">Column that references another table</div>
              <div className="example">orders.customer_id references customers.id</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 3: NO JOIN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="no-join">
            <span className="lecture-icon">▶️</span> NO JOIN
          </h2>
          <div className="subtitle">Duration: 1:40</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Before learning joins, it's important to understand what happens when you query multiple 
            tables without a JOIN - you get a Cartesian product where every row from the first table 
            is combined with every row from the second table.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Querying without JOIN (Cartesian Product)
SELECT *
FROM customers, orders;
-- If customers has 3 rows and orders has 5 rows,
-- you get 3 × 5 = 15 rows (most are meaningless!)

-- This is usually NOT what you want
-- Results include all possible combinations`} 
          />
          <FunFact text="A Cartesian product of two tables with 1000 rows each would return 1,000,000 rows!" />
        </div>
      </div>

      {/* Lecture 4: INNER JOIN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="inner-join">
            <span className="lecture-icon">▶️</span> INNER JOIN
          </h2>
          <div className="subtitle">Duration: 12:30 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            INNER JOIN returns only the rows where there is a match in both tables. It's the most 
            common type of join and is often just called "JOIN".
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- INNER JOIN syntax
SELECT 
  customers.customer_name,
  customers.email,
  orders.order_id,
  orders.order_date,
  orders.total
FROM customers
INNER JOIN orders ON customers.customer_id = orders.customer_id;

-- Shorter syntax (INNER is optional)
SELECT c.customer_name, o.order_id, o.total
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id;

-- Multiple conditions
SELECT *
FROM employees e
JOIN departments d 
  ON e.department_id = d.department_id 
  AND e.status = 'Active';

-- Joining multiple tables
SELECT 
  c.customer_name,
  o.order_id,
  p.product_name,
  oi.quantity,
  oi.price
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;`} 
          />
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>Returns</h3>
              <ul>
                <li>Only matching rows from both tables</li>
                <li>Excludes non-matching rows</li>
                <li>Most restrictive join</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>Use When</h3>
              <ul>
                <li>You only want related data</li>
                <li>Both tables must have a match</li>
                <li>Default choice for most queries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 5: LEFT JOIN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="left-join">
            <span className="lecture-icon">▶️</span> LEFT JOIN
          </h2>
          <div className="subtitle">Duration: 7:12</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table and matching rows 
            from the right table. If there's no match, NULL values are returned for right table columns.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- LEFT JOIN syntax
SELECT 
  customers.customer_name,
  orders.order_id,
  orders.order_date
FROM customers
LEFT JOIN orders ON customers.customer_id = orders.customer_id;

-- Returns ALL customers, even those without orders
-- Customers without orders will have NULL for order columns

-- Find customers with NO orders
SELECT c.customer_name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;

-- LEFT JOIN with aggregation
SELECT 
  c.customer_name,
  COUNT(o.order_id) AS order_count,
  COALESCE(SUM(o.total), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;`} 
          />
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>Returns</h3>
              <ul>
                <li>ALL rows from left table</li>
                <li>Matching rows from right table</li>
                <li>NULL for non-matching right rows</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>Use When</h3>
              <ul>
                <li>Need all records from main table</li>
                <li>Want to find missing relationships</li>
                <li>Optional related data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 6: RIGHT JOIN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="right-join">
            <span className="lecture-icon">▶️</span> RIGHT JOIN
          </h2>
          <div className="subtitle">Duration: 4:55</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            RIGHT JOIN (or RIGHT OUTER JOIN) returns all rows from the right table and matching rows 
            from the left table. It's the opposite of LEFT JOIN.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- RIGHT JOIN syntax
SELECT 
  customers.customer_name,
  orders.order_id,
  orders.order_date
FROM orders
RIGHT JOIN customers ON orders.customer_id = customers.customer_id;

-- This is equivalent to:
SELECT 
  customers.customer_name,
  orders.order_id,
  orders.order_date
FROM customers
LEFT JOIN orders ON customers.customer_id = orders.customer_id;

-- RIGHT JOIN is less common - most people prefer LEFT JOIN
-- by switching table order`} 
          />
          <FunFact text="RIGHT JOIN is rarely used in practice - developers typically rewrite queries using LEFT JOIN by swapping table positions!" />
        </div>
      </div>

      {/* Lecture 7: FULL JOIN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="full-join">
            <span className="lecture-icon">▶️</span> FULL JOIN
          </h2>
          <div className="subtitle">Duration: 4:39</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            FULL JOIN (or FULL OUTER JOIN) returns all rows when there is a match in either left or 
            right table. Rows without a match in the other table will have NULL values.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- FULL JOIN syntax (not supported in MySQL, use UNION)
SELECT 
  customers.customer_name,
  orders.order_id
FROM customers
FULL OUTER JOIN orders ON customers.customer_id = orders.customer_id;

-- MySQL alternative using UNION
SELECT 
  c.customer_name,
  o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
UNION
SELECT 
  c.customer_name,
  o.order_id
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id;`} 
          />
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>Returns</h3>
              <ul>
                <li>ALL rows from both tables</li>
                <li>Matches where they exist</li>
                <li>NULL for non-matching sides</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>Use When</h3>
              <ul>
                <li>Need complete data from both tables</li>
                <li>Finding all matches and non-matches</li>
                <li>Data reconciliation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 8: LEFT ANTI JOIN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="left-anti-join">
            <span className="lecture-icon">▶️</span> LEFT ANTI JOIN
          </h2>
          <div className="subtitle">Duration: 4:03</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            LEFT ANTI JOIN returns rows from the left table that do NOT have a match in the right 
            table. It's implemented using LEFT JOIN with a WHERE clause checking for NULL.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- LEFT ANTI JOIN pattern
SELECT c.*
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
-- Returns customers who have NEVER placed an order

-- Find employees without departments
SELECT e.employee_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
WHERE d.department_id IS NULL;

-- Find products never ordered
SELECT p.product_name, p.product_id
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE oi.order_id IS NULL;`} 
          />
          <FunFact text="ANTI JOIN is great for finding orphaned records or identifying missing relationships!" />
        </div>
      </div>

      {/* Lecture 9: RIGHT ANTI JOIN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="right-anti-join">
            <span className="lecture-icon">▶️</span> RIGHT ANTI JOIN
          </h2>
          <div className="subtitle">Duration: 4:56</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            RIGHT ANTI JOIN returns rows from the right table that do NOT have a match in the left 
            table. Like LEFT ANTI JOIN but in reverse.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- RIGHT ANTI JOIN pattern
SELECT o.*
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL;
-- Returns orders with invalid customer references

-- Usually rewritten as LEFT ANTI JOIN
SELECT o.*
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;`} 
          />
        </div>
      </div>

      {/* Lecture 10: FULL ANTI JOIN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="full-anti-join">
            <span className="lecture-icon">▶️</span> FULL ANTI JOIN
          </h2>
          <div className="subtitle">Duration: 6:57</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            FULL ANTI JOIN returns rows from both tables that do NOT have a match in the other table. 
            It combines LEFT ANTI JOIN and RIGHT ANTI JOIN.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- FULL ANTI JOIN pattern (MySQL)
-- Customers without orders
SELECT c.customer_id, c.customer_name, NULL as order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL

UNION

-- Orders without valid customers
SELECT NULL as customer_id, NULL as customer_name, o.order_id
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;`} 
          />
        </div>
      </div>

      {/* Lecture 11: CROSS JOIN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="cross-join">
            <span className="lecture-icon">▶️</span> CROSS JOIN
          </h2>
          <div className="subtitle">Duration: 3:16</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            CROSS JOIN returns the Cartesian product of two tables - every row from the first table 
            combined with every row from the second table. Use with caution!
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- CROSS JOIN syntax
SELECT *
FROM colors
CROSS JOIN sizes;

-- If colors has 5 rows and sizes has 4 rows,
-- result has 5 × 4 = 20 rows

-- Practical example: Generate all combinations
SELECT 
  c.color_name,
  s.size_name,
  CONCAT(c.color_name, ' - ', s.size_name) AS variant
FROM colors c
CROSS JOIN sizes s;

-- Alternative syntax (implicit CROSS JOIN)
SELECT *
FROM colors, sizes;`} 
          />
          <div style={{ 
            padding: '20px', 
            background: '#fff3cd', 
            borderRadius: '8px',
            border: '2px solid #ffc107',
            marginTop: '24px',
            color: '#856404'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              ⚠️ WARNING: CROSS JOIN can create huge result sets! A CROSS JOIN of two tables with 
              1000 rows each produces 1,000,000 rows.
            </p>
          </div>
        </div>
      </div>

      {/* Lecture 12: How to Choose The Correct Join */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="choose-join">
            <span className="lecture-icon">▶️</span> How to Choose The Correct Join
          </h2>
          <div className="subtitle">Duration: 1:39</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Choosing the right join depends on what data you need. Here's a decision guide:
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">INNER JOIN</span>
              </div>
              <div className="simple">Only matching rows from both tables</div>
              <div className="example">Customers who have placed orders</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">LEFT JOIN</span>
              </div>
              <div className="simple">All from left + matching from right</div>
              <div className="example">All customers + their orders (if any)</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">RIGHT JOIN</span>
              </div>
              <div className="simple">All from right + matching from left</div>
              <div className="example">Rarely used - use LEFT JOIN instead</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">FULL JOIN</span>
              </div>
              <div className="simple">All rows from both tables</div>
              <div className="example">All customers and all orders</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">LEFT ANTI JOIN</span>
              </div>
              <div className="simple">Rows from left with NO match in right</div>
              <div className="example">Customers who never ordered</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">CROSS JOIN</span>
              </div>
              <div className="simple">All possible combinations</div>
              <div className="example">All color-size combinations</div>
            </div>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Decision Tree</h3>
          <ul className="prose">
            <li><strong>Need only related data?</strong> → INNER JOIN</li>
            <li><strong>Need all from main table + related data?</strong> → LEFT JOIN</li>
            <li><strong>Need to find missing relationships?</strong> → LEFT ANTI JOIN</li>
            <li><strong>Need all data from both tables?</strong> → FULL JOIN</li>
            <li><strong>Need all combinations?</strong> → CROSS JOIN</li>
          </ul>
        </div>
      </div>

      {/* Lecture 13: Multiple Table Joins */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="multiple-joins">
            <span className="lecture-icon">▶️</span> Multiple Table Joins
          </h2>
          <div className="subtitle">Duration: 13:22</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Real-world queries often need to join more than two tables. You can chain multiple 
            JOINs together to combine data from many related tables.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Joining 3 tables
SELECT 
  c.customer_name,
  o.order_id,
  o.order_date,
  p.product_name,
  oi.quantity,
  oi.price
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;

-- Joining 4+ tables
SELECT 
  e.employee_name,
  d.department_name,
  p.project_name,
  t.hours_worked,
  t.task_date
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN employee_projects ep ON e.employee_id = ep.employee_id
JOIN projects p ON ep.project_id = p.project_id
JOIN timesheets t ON e.employee_id = t.employee_id 
  AND p.project_id = t.project_id;

-- Mixing different join types
SELECT 
  c.customer_name,
  o.order_id,
  o.order_date,
  p.product_name,
  cat.category_name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.product_id
LEFT JOIN categories cat ON p.category_id = cat.category_id
WHERE c.country = 'USA';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Best Practices for Multiple Joins</h3>
          <ul className="prose">
            <li><strong>Use table aliases:</strong> Makes queries more readable (c, o, p instead of full names)</li>
            <li><strong>Join in logical order:</strong> Start with main table, add related tables</li>
            <li><strong>Be consistent with join types:</strong> Mix carefully (INNER vs LEFT)</li>
            <li><strong>Add WHERE filters after joins:</strong> Filter the combined result</li>
            <li><strong>Consider performance:</strong> More joins = slower queries (add indexes!)</li>
            <li><strong>Test incrementally:</strong> Add one join at a time to verify results</li>
          </ul>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Complex Example</h3>
          <CodeBlock 
            language="sql" 
            code={`-- E-commerce order summary with multiple joins
SELECT 
  c.customer_name,
  c.email,
  o.order_id,
  o.order_date,
  o.status,
  COUNT(oi.order_item_id) AS items_count,
  SUM(oi.quantity * oi.price) AS order_total,
  STRING_AGG(p.product_name, ', ') AS products,
  s.shipping_address,
  s.tracking_number
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
LEFT JOIN shipping s ON o.order_id = s.order_id
WHERE o.order_date >= '2024-01-01'
  AND o.status IN ('Shipped', 'Delivered')
GROUP BY 
  c.customer_id,
  c.customer_name,
  c.email,
  o.order_id,
  o.order_date,
  o.status,
  s.shipping_address,
  s.tracking_number
ORDER BY o.order_date DESC;`} 
          />
        </div>
      </div>

      {/* Quiz */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="quiz">
            <span className="lecture-icon">📝</span> Quiz | SQL Joins
          </h2>
          <div className="subtitle">Test your knowledge</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Test your understanding of SQL Joins. This quiz covers all join types including INNER, 
            LEFT, RIGHT, FULL, CROSS, ANTI joins, and multiple table joins.
          </p>
          <div style={{ 
            padding: '20px', 
            background: 'var(--card-bg)', 
            borderRadius: '8px',
            border: '2px solid var(--accent)',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 Ready to test your JOIN knowledge? Complete the quiz to reinforce what you've learned!
            </p>
          </div>
        </div>
      </div>

      {/* Visual Guide */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="visual-guide">Visual JOIN Guide</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Here's a quick visual reference for understanding different join types:
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">INNER JOIN</span>
              </div>
              <div className="simple">⚫ Intersection only</div>
              <div className="example">A ∩ B</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">LEFT JOIN</span>
              </div>
              <div className="simple">⚫ All A + intersection</div>
              <div className="example">A ∪ (A ∩ B)</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">RIGHT JOIN</span>
              </div>
              <div className="simple">⚫ All B + intersection</div>
              <div className="example">B ∪ (A ∩ B)</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">FULL JOIN</span>
              </div>
              <div className="simple">⚫ Everything</div>
              <div className="example">A ∪ B</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">LEFT ANTI</span>
              </div>
              <div className="simple">⚫ Only A (no match)</div>
              <div className="example">A - B</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">CROSS JOIN</span>
              </div>
              <div className="simple">⚫ All combinations</div>
              <div className="example">A × B</div>
            </div>
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
            Excellent! You've mastered SQL Joins and can now combine data from multiple tables 
            effectively. Next, you'll learn about SET operators to combine query results.
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
              onClick={() => onNavigate?.('sql-set-operators' as SubsectionId)}
            >
              Continue to SQL SET Operators →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SQLJoinsPage;
