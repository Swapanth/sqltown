import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface DataManipulationDMLPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const DataManipulationDMLPage: React.FC<DataManipulationDMLPageProps> = ({ initialTheme = 'dark', onNavigate }) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}}
      breadcrumb={{ section: 'basics', subsection: 'data-manipulation-dml' }}
      currentSection="data-manipulation-dml"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>✏️ MySQL Basics</span>
        </div>
        <h1>Data Manipulation (DML)</h1>
        <p className="description">
          Master the essential commands for manipulating data in your database. Learn to INSERT 
          new records, UPDATE existing data, and DELETE unwanted rows.
        </p>
        <DifficultyBadge level="beginner" />
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          3 lectures • 24min
        </div>
      </div>

      <FunFact text="DML stands for Data Manipulation Language - it's used to insert, update, and delete data in database tables. Unlike DDL, DML operations can typically be rolled back!" />

      {/* Lecture 1: INSERT */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="insert">
            <span className="lecture-icon">▶️</span> INSERT
          </h2>
          <div className="subtitle">Duration: 13:26 • Preview Available</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The INSERT statement adds new rows to a table. It's one of the most fundamental 
            operations in SQL, allowing you to populate your database with data.
          </p>
          
          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Basic INSERT Syntax</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Insert a single row with all columns
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date, salary)
VALUES (1, 'John', 'Doe', 'john.doe@company.com', '2024-01-15', 50000);

-- Insert without specifying column names (must match table order)
INSERT INTO employees
VALUES (2, 'Jane', 'Smith', 'jane.smith@company.com', '2024-02-01', 55000);

-- Insert with specific columns only
INSERT INTO employees (first_name, last_name, email)
VALUES ('Bob', 'Johnson', 'bob.johnson@company.com');`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Inserting Multiple Rows</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Insert multiple rows in a single statement
INSERT INTO employees (first_name, last_name, email, hire_date, salary)
VALUES 
  ('Alice', 'Williams', 'alice.w@company.com', '2024-03-01', 60000),
  ('Charlie', 'Brown', 'charlie.b@company.com', '2024-03-15', 52000),
  ('Diana', 'Davis', 'diana.d@company.com', '2024-04-01', 58000);

-- This is much more efficient than multiple INSERT statements`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>INSERT with SELECT (Copy Data)</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Insert data from another table
INSERT INTO employees_backup (employee_id, first_name, last_name, email)
SELECT employee_id, first_name, last_name, email
FROM employees
WHERE department = 'Sales';

-- Insert with calculations
INSERT INTO monthly_sales (employee_id, month, total_sales)
SELECT 
  employee_id,
  MONTH(sale_date) AS month,
  SUM(sale_amount) AS total_sales
FROM sales
WHERE YEAR(sale_date) = 2024
GROUP BY employee_id, MONTH(sale_date);`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>INSERT with DEFAULT and NULL</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Use DEFAULT keyword for default values
INSERT INTO employees (first_name, last_name, email, status)
VALUES ('Eve', 'Martinez', 'eve.m@company.com', DEFAULT);

-- Insert NULL values explicitly
INSERT INTO employees (first_name, last_name, email, phone)
VALUES ('Frank', 'Garcia', 'frank.g@company.com', NULL);

-- Skip optional columns (they'll use DEFAULT or NULL)
INSERT INTO employees (first_name, last_name, email)
VALUES ('Grace', 'Lee', 'grace.l@company.com');`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>INSERT IGNORE and ON DUPLICATE KEY</h3>
          <CodeBlock 
            language="sql" 
            code={`-- INSERT IGNORE: Skip rows that would cause errors
INSERT IGNORE INTO employees (employee_id, first_name, last_name, email)
VALUES (1, 'John', 'Doe', 'john.doe@company.com');
-- If employee_id 1 exists, this row is skipped

-- ON DUPLICATE KEY UPDATE: Update if key exists
INSERT INTO employees (employee_id, first_name, last_name, email, salary)
VALUES (1, 'John', 'Doe', 'john.doe@company.com', 55000)
ON DUPLICATE KEY UPDATE 
  salary = VALUES(salary),
  last_name = VALUES(last_name);`} 
          />

          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Single Row Insert</span>
              </div>
              <div className="simple">Insert one record at a time</div>
              <div className="example">INSERT INTO table VALUES (1, 'data')</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Multiple Row Insert</span>
              </div>
              <div className="simple">Insert many records in one statement</div>
              <div className="example">VALUES (1, 'a'), (2, 'b'), (3, 'c')</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">INSERT SELECT</span>
              </div>
              <div className="simple">Copy data from another table</div>
              <div className="example">INSERT INTO t1 SELECT * FROM t2</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">AUTO_INCREMENT</span>
              </div>
              <div className="simple">Database generates ID automatically</div>
              <div className="example">Skip ID column in INSERT</div>
            </div>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Best Practices</h3>
          <ul className="prose">
            <li><strong>Always specify column names:</strong> Makes code more maintainable</li>
            <li><strong>Use multiple row inserts:</strong> Much faster than individual inserts</li>
            <li><strong>Validate data before inserting:</strong> Prevent constraint violations</li>
            <li><strong>Use transactions for bulk inserts:</strong> Ensure data consistency</li>
            <li><strong>Handle duplicates appropriately:</strong> Use INSERT IGNORE or ON DUPLICATE KEY</li>
          </ul>
        </div>
      </div>

      {/* Lecture 2: UPDATE */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="update">
            <span className="lecture-icon">▶️</span> UPDATE
          </h2>
          <div className="subtitle">Duration: 6:30</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The UPDATE statement modifies existing data in a table. You can update one or more 
            columns in one or more rows based on specified conditions.
          </p>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Basic UPDATE Syntax</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Update a single column
UPDATE employees
SET salary = 60000
WHERE employee_id = 1;

-- Update multiple columns
UPDATE employees
SET 
  salary = 65000,
  department = 'Engineering',
  last_updated = CURRENT_TIMESTAMP
WHERE employee_id = 2;

-- Update all rows (be careful!)
UPDATE employees
SET status = 'Active';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>UPDATE with Calculations</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Increase salary by 10%
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'Sales';

-- Increment a counter
UPDATE products
SET stock_quantity = stock_quantity - 1
WHERE product_id = 101;

-- Update based on current value
UPDATE employees
SET bonus = salary * 0.15
WHERE performance_rating >= 4;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>UPDATE with Multiple Conditions</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Update with AND condition
UPDATE employees
SET salary = salary * 1.15
WHERE department = 'Engineering' 
  AND years_of_service > 5;

-- Update with OR condition
UPDATE orders
SET status = 'Urgent'
WHERE order_date < '2024-01-01' 
   OR total_amount > 10000;

-- Update with IN clause
UPDATE employees
SET remote_eligible = TRUE
WHERE department IN ('IT', 'Marketing', 'Design');

-- Update with BETWEEN
UPDATE products
SET discount = 0.20
WHERE price BETWEEN 100 AND 500;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>UPDATE with Subquery</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Update based on data from another table
UPDATE employees e
SET salary = (
  SELECT AVG(salary)
  FROM employees
  WHERE department = e.department
)
WHERE employee_id = 10;

-- Update using EXISTS
UPDATE products
SET featured = TRUE
WHERE EXISTS (
  SELECT 1
  FROM orders
  WHERE orders.product_id = products.product_id
  GROUP BY product_id
  HAVING COUNT(*) > 100
);`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>UPDATE with JOIN</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Update using JOIN (MySQL syntax)
UPDATE employees e
JOIN departments d ON e.department_id = d.department_id
SET e.department_name = d.name
WHERE d.active = TRUE;

-- Update multiple tables
UPDATE orders o
JOIN customers c ON o.customer_id = c.customer_id
SET 
  o.customer_name = c.full_name,
  o.customer_email = c.email
WHERE o.order_date >= '2024-01-01';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>UPDATE with CASE</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Conditional updates using CASE
UPDATE employees
SET salary = CASE
  WHEN performance_rating = 5 THEN salary * 1.20
  WHEN performance_rating = 4 THEN salary * 1.15
  WHEN performance_rating = 3 THEN salary * 1.10
  ELSE salary
END
WHERE review_date >= '2024-01-01';

-- Multiple column updates with CASE
UPDATE products
SET 
  status = CASE
    WHEN stock_quantity = 0 THEN 'Out of Stock'
    WHEN stock_quantity < 10 THEN 'Low Stock'
    ELSE 'In Stock'
  END,
  reorder_needed = CASE
    WHEN stock_quantity < 10 THEN TRUE
    ELSE FALSE
  END;`} 
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
              ⚠️ WARNING: Always use a WHERE clause with UPDATE! Without it, you'll update ALL rows 
              in the table. Test your WHERE clause with SELECT first to verify which rows will be affected.
            </p>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Best Practices</h3>
          <ul className="prose">
            <li><strong>Always use WHERE clause:</strong> Unless you really want to update all rows</li>
            <li><strong>Test with SELECT first:</strong> Verify which rows will be affected</li>
            <li><strong>Use transactions:</strong> Allows rollback if something goes wrong</li>
            <li><strong>Backup before bulk updates:</strong> Especially in production</li>
            <li><strong>Check affected rows:</strong> Verify the update worked as expected</li>
          </ul>
        </div>
      </div>

      {/* Lecture 3: DELETE */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="delete">
            <span className="lecture-icon">▶️</span> DELETE
          </h2>
          <div className="subtitle">Duration: 4:21</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The DELETE statement removes rows from a table. Unlike DROP which removes the entire 
            table, DELETE removes specific rows while keeping the table structure intact.
          </p>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Basic DELETE Syntax</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Delete specific rows
DELETE FROM employees
WHERE employee_id = 10;

-- Delete multiple rows with condition
DELETE FROM orders
WHERE order_date < '2023-01-01';

-- Delete all rows (keeps table structure)
DELETE FROM temp_data;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>DELETE with Multiple Conditions</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Delete with AND condition
DELETE FROM products
WHERE stock_quantity = 0 
  AND discontinued = TRUE;

-- Delete with OR condition
DELETE FROM logs
WHERE log_date < '2024-01-01' 
   OR log_level = 'DEBUG';

-- Delete with IN clause
DELETE FROM employees
WHERE department IN ('Temp', 'Contractor', 'Intern')
  AND end_date < CURRENT_DATE;

-- Delete with BETWEEN
DELETE FROM transactions
WHERE transaction_date BETWEEN '2023-01-01' AND '2023-12-31'
  AND status = 'Cancelled';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>DELETE with Subquery</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Delete based on data from another table
DELETE FROM orders
WHERE customer_id IN (
  SELECT customer_id
  FROM customers
  WHERE account_status = 'Closed'
);

-- Delete using NOT EXISTS
DELETE FROM products
WHERE NOT EXISTS (
  SELECT 1
  FROM orders
  WHERE orders.product_id = products.product_id
)
AND created_date < '2023-01-01';

-- Delete duplicates (keep only one)
DELETE FROM employees
WHERE employee_id NOT IN (
  SELECT MIN(employee_id)
  FROM employees
  GROUP BY email
);`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>DELETE with JOIN</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Delete using JOIN (MySQL syntax)
DELETE o
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE c.account_status = 'Inactive'
  AND o.order_date < '2023-01-01';

-- Delete from multiple tables
DELETE o, oi
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.status = 'Cancelled'
  AND o.order_date < '2023-01-01';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>DELETE with LIMIT</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Delete only a specific number of rows
DELETE FROM logs
WHERE log_level = 'DEBUG'
ORDER BY log_date ASC
LIMIT 1000;

-- Delete oldest records
DELETE FROM audit_trail
WHERE created_date < DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
ORDER BY created_date ASC
LIMIT 5000;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>DELETE vs TRUNCATE vs DROP</h3>
          <CodeBlock 
            language="sql" 
            code={`-- DELETE: Removes specific rows, can use WHERE, slower, can rollback
DELETE FROM employees WHERE department = 'Temp';

-- TRUNCATE: Removes all rows, faster, resets AUTO_INCREMENT, can't rollback
TRUNCATE TABLE employees;

-- DROP: Removes entire table including structure
DROP TABLE employees;`} 
          />

          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>DELETE</h3>
              <ul>
                <li>Removes specific rows</li>
                <li>Can use WHERE clause</li>
                <li>Slower for large tables</li>
                <li>Can be rolled back</li>
                <li>Triggers fire</li>
                <li>Keeps AUTO_INCREMENT value</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>TRUNCATE</h3>
              <ul>
                <li>Removes all rows</li>
                <li>No WHERE clause</li>
                <li>Much faster</li>
                <li>Cannot be rolled back</li>
                <li>Triggers don't fire</li>
                <li>Resets AUTO_INCREMENT</li>
              </ul>
            </div>
          </div>

          <div style={{ 
            padding: '20px', 
            background: '#f8d7da', 
            borderRadius: '8px',
            border: '2px solid #dc3545',
            marginTop: '24px',
            color: '#721c24'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              🚨 CRITICAL WARNING: DELETE is permanent! Always use a WHERE clause unless you want 
              to delete ALL rows. Test your WHERE clause with SELECT first. Use transactions and 
              backups for important data.
            </p>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Best Practices</h3>
          <ul className="prose">
            <li><strong>ALWAYS use WHERE clause:</strong> Unless deleting all rows intentionally</li>
            <li><strong>Test with SELECT first:</strong> See exactly what will be deleted</li>
            <li><strong>Use transactions:</strong> Allows rollback if needed</li>
            <li><strong>Backup critical data:</strong> Before bulk deletes</li>
            <li><strong>Consider soft deletes:</strong> Use a 'deleted' flag instead of actual deletion</li>
            <li><strong>Check foreign key constraints:</strong> Ensure referential integrity</li>
            <li><strong>Use LIMIT for large deletes:</strong> Delete in batches to avoid locking</li>
          </ul>
        </div>
      </div>

      {/* Lecture 4: Quiz */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="quiz">
            <span className="lecture-icon">📝</span> Quiz | DML
          </h2>
          <div className="subtitle">Test your knowledge</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Test your understanding of Data Manipulation Language (DML). This quiz covers INSERT, 
            UPDATE, and DELETE statements, including advanced techniques like subqueries, joins, 
            and conditional operations.
          </p>
          <div style={{ 
            padding: '20px', 
            background: 'var(--card-bg)', 
            borderRadius: '8px',
            border: '2px solid var(--accent)',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 Ready to test your DML knowledge? Complete the quiz to reinforce what you've learned!
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Example */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="comprehensive-example">Comprehensive DML Example</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Here's a complete example showing INSERT, UPDATE, and DELETE operations in a real-world scenario:
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Start a transaction for safety
START TRANSACTION;

-- INSERT: Add new employees
INSERT INTO employees (first_name, last_name, email, department, salary, hire_date)
VALUES 
  ('John', 'Doe', 'john.doe@company.com', 'Engineering', 75000, '2024-01-15'),
  ('Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 65000, '2024-02-01'),
  ('Bob', 'Johnson', 'bob.j@company.com', 'Sales', 60000, '2024-02-15');

-- INSERT: Copy high performers to awards table
INSERT INTO employee_awards (employee_id, award_type, award_date)
SELECT employee_id, 'Top Performer', CURRENT_DATE
FROM employees
WHERE performance_rating >= 4.5
  AND hire_date < DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR);

-- UPDATE: Give raises to deserving employees
UPDATE employees
SET 
  salary = CASE
    WHEN performance_rating >= 4.5 THEN salary * 1.15
    WHEN performance_rating >= 4.0 THEN salary * 1.10
    WHEN performance_rating >= 3.5 THEN salary * 1.05
    ELSE salary
  END,
  last_review_date = CURRENT_DATE
WHERE review_due = TRUE;

-- UPDATE: Sync department names from departments table
UPDATE employees e
JOIN departments d ON e.department_id = d.department_id
SET e.department_name = d.name
WHERE d.updated_at > e.last_sync_date;

-- DELETE: Remove inactive employees
DELETE FROM employees
WHERE status = 'Terminated'
  AND termination_date < DATE_SUB(CURRENT_DATE, INTERVAL 2 YEAR);

-- DELETE: Clean up old temporary records
DELETE FROM temp_calculations
WHERE created_date < DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY);

-- Commit if everything looks good
COMMIT;

-- Or rollback if there's an issue
-- ROLLBACK;`} 
          />
        </div>
      </div>

      {/* Transactions and Safety */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="transactions">Using Transactions for Safety</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Always use transactions when performing DML operations, especially in production:
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Start transaction
START TRANSACTION;

-- Test your changes with SELECT first
SELECT * FROM employees WHERE department = 'Sales';

-- Perform the update
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'Sales';

-- Verify the changes
SELECT * FROM employees WHERE department = 'Sales';

-- If everything looks good, commit
COMMIT;

-- If something is wrong, rollback
-- ROLLBACK;`} 
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
            Excellent! You now know how to manipulate data with INSERT, UPDATE, and DELETE. 
            Next, you'll learn advanced filtering techniques to query your data more effectively.
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
              onClick={() => onNavigate?.('filtering-data' as SubsectionId)}
            >
              Continue to Filtering Data →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DataManipulationDMLPage;
