import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface FilteringDataPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const FilteringDataPage: React.FC<FilteringDataPageProps> = ({ initialTheme = 'dark', onNavigate }) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}}
      breadcrumb={{ section: 'basics', subsection: 'filtering-data' }}
      currentSection="filtering-data"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>🔎 MySQL Basics</span>
        </div>
        <h1>Filtering Data</h1>
        <p className="description">
          Learn to filter and refine your query results with WHERE clause operators. Master 
          comparison, logical, and pattern matching operators to retrieve exactly the data you need.
        </p>
        <DifficultyBadge level="beginner" />
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          8 lectures • 41min
        </div>
      </div>

      <FunFact text="The WHERE clause is one of the most powerful features in SQL - it allows you to filter millions of rows down to exactly what you need in milliseconds!" />

      {/* Lecture 1: Intro - What is Data Filtering */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="intro-filtering">
            <span className="lecture-icon">▶️</span> Intro - What is Data Filtering
          </h2>
          <div className="subtitle">Duration: 1:03</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Data filtering is the process of selecting specific rows from a table based on certain 
            conditions. Instead of retrieving all data, you use the WHERE clause to specify exactly 
            which rows you want to see.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Without filtering: Returns ALL rows
SELECT * FROM employees;

-- With filtering: Returns only matching rows
SELECT * FROM employees
WHERE department = 'Sales';

-- Filtering makes queries faster and more useful
SELECT * FROM orders
WHERE order_date >= '2024-01-01' AND total_amount > 1000;`} 
          />
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Why Filter?</span>
              </div>
              <div className="simple">Get only the data you need</div>
              <div className="example">Faster queries, relevant results</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">WHERE Clause</span>
              </div>
              <div className="simple">The main tool for filtering</div>
              <div className="example">WHERE condition = value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 2: Comparison Operators */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="comparison-operators">
            <span className="lecture-icon">▶️</span> Comparison Operators
          </h2>
          <div className="subtitle">Duration: 9:15</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Comparison operators allow you to compare values in your WHERE clause. They're the 
            foundation of data filtering and work with numbers, text, and dates.
          </p>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Equal To (=)</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Find exact matches
SELECT * FROM employees WHERE department = 'Sales';
SELECT * FROM products WHERE price = 99.99;
SELECT * FROM orders WHERE status = 'Shipped';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Not Equal To (!= or &lt;&gt;)</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Find non-matching values
SELECT * FROM employees WHERE department != 'Sales';
SELECT * FROM products WHERE status <> 'Discontinued';
SELECT * FROM customers WHERE country != 'USA';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Greater Than (&gt;)</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Find values greater than specified
SELECT * FROM employees WHERE salary > 50000;
SELECT * FROM products WHERE stock_quantity > 100;
SELECT * FROM orders WHERE order_date > '2024-01-01';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Less Than (&lt;)</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Find values less than specified
SELECT * FROM products WHERE price < 50;
SELECT * FROM employees WHERE age < 30;
SELECT * FROM orders WHERE total_amount < 100;`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Greater Than or Equal (&gt;=)</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Find values greater than or equal to specified
SELECT * FROM employees WHERE salary >= 60000;
SELECT * FROM students WHERE grade >= 90;
SELECT * FROM orders WHERE order_date >= '2024-01-01';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Less Than or Equal (&lt;=)</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Find values less than or equal to specified
SELECT * FROM products WHERE price <= 100;
SELECT * FROM employees WHERE years_of_service <= 5;
SELECT * FROM orders WHERE total_amount <= 500;`} 
          />

          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">=</span>
              </div>
              <div className="simple">Equal to</div>
              <div className="example">WHERE age = 25</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">!= or &lt;&gt;</span>
              </div>
              <div className="simple">Not equal to</div>
              <div className="example">WHERE status != 'Active'</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">&gt;</span>
              </div>
              <div className="simple">Greater than</div>
              <div className="example">WHERE salary &gt; 50000</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">&lt;</span>
              </div>
              <div className="simple">Less than</div>
              <div className="example">WHERE price &lt; 100</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">&gt;=</span>
              </div>
              <div className="simple">Greater than or equal</div>
              <div className="example">WHERE age &gt;= 18</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">&lt;=</span>
              </div>
              <div className="simple">Less than or equal</div>
              <div className="example">WHERE quantity &lt;= 10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 3: AND Operator */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="and-operator">
            <span className="lecture-icon">▶️</span> AND Operator
          </h2>
          <div className="subtitle">Duration: 4:41</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The AND operator combines multiple conditions. ALL conditions must be true for a row 
            to be included in the results. Use AND when you need to narrow down your results.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Two conditions with AND
SELECT * FROM employees
WHERE department = 'Sales' AND salary > 50000;

-- Three conditions with AND
SELECT * FROM products
WHERE category = 'Electronics' 
  AND price < 1000 
  AND stock_quantity > 0;

-- AND with different data types
SELECT * FROM orders
WHERE customer_id = 101 
  AND order_date >= '2024-01-01' 
  AND status = 'Shipped';

-- Multiple AND conditions
SELECT * FROM employees
WHERE department = 'Engineering'
  AND salary >= 70000
  AND years_of_service > 3
  AND performance_rating >= 4;`} 
          />
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>AND Logic</h3>
              <ul>
                <li>ALL conditions must be TRUE</li>
                <li>Narrows down results</li>
                <li>More restrictive</li>
                <li>Fewer rows returned</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>Example</h3>
              <ul>
                <li>dept = 'Sales' AND salary &gt; 50000</li>
                <li>Must be in Sales</li>
                <li>AND must earn over 50000</li>
                <li>Both conditions required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 4: OR Operator */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="or-operator">
            <span className="lecture-icon">▶️</span> OR Operator
          </h2>
          <div className="subtitle">Duration: 2:53</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The OR operator combines multiple conditions where AT LEAST ONE condition must be true. 
            Use OR when you want to broaden your search to include multiple possibilities.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Two conditions with OR
SELECT * FROM employees
WHERE department = 'Sales' OR department = 'Marketing';

-- OR with different columns
SELECT * FROM products
WHERE price < 50 OR stock_quantity > 1000;

-- Multiple OR conditions
SELECT * FROM customers
WHERE country = 'USA' 
   OR country = 'Canada' 
   OR country = 'Mexico';

-- Combining AND and OR (use parentheses!)
SELECT * FROM orders
WHERE (status = 'Shipped' OR status = 'Delivered')
  AND order_date >= '2024-01-01';`} 
          />
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>OR Logic</h3>
              <ul>
                <li>At least ONE condition must be TRUE</li>
                <li>Broadens results</li>
                <li>Less restrictive</li>
                <li>More rows returned</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>Example</h3>
              <ul>
                <li>dept = 'Sales' OR dept = 'Marketing'</li>
                <li>Can be in Sales</li>
                <li>OR can be in Marketing</li>
                <li>Either condition works</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 5: NOT Operator */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="not-operator">
            <span className="lecture-icon">▶️</span> NOT Operator
          </h2>
          <div className="subtitle">Duration: 3:28</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The NOT operator negates a condition, returning rows where the condition is FALSE. 
            It's useful for excluding specific values or patterns.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- NOT with equality
SELECT * FROM employees
WHERE NOT department = 'Sales';
-- Same as: WHERE department != 'Sales'

-- NOT with comparison
SELECT * FROM products
WHERE NOT price > 100;
-- Same as: WHERE price <= 100

-- NOT with IN
SELECT * FROM customers
WHERE country NOT IN ('USA', 'Canada', 'Mexico');

-- NOT with LIKE
SELECT * FROM employees
WHERE email NOT LIKE '%@gmail.com';

-- NOT with BETWEEN
SELECT * FROM products
WHERE price NOT BETWEEN 50 AND 100;

-- NOT with NULL
SELECT * FROM customers
WHERE phone IS NOT NULL;`} 
          />
        </div>
      </div>

      {/* Lecture 6: BETWEEN Operator */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="between-operator">
            <span className="lecture-icon">▶️</span> BETWEEN Operator
          </h2>
          <div className="subtitle">Duration: 4:28</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The BETWEEN operator selects values within a given range. It's inclusive, meaning it 
            includes both the start and end values. Works with numbers, dates, and text.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- BETWEEN with numbers
SELECT * FROM products
WHERE price BETWEEN 100 AND 500;
-- Same as: WHERE price >= 100 AND price <= 500

-- BETWEEN with dates
SELECT * FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';

-- BETWEEN with text (alphabetical)
SELECT * FROM customers
WHERE last_name BETWEEN 'A' AND 'M'
ORDER BY last_name;

-- NOT BETWEEN
SELECT * FROM employees
WHERE salary NOT BETWEEN 30000 AND 50000;

-- BETWEEN in complex queries
SELECT * FROM sales
WHERE sale_date BETWEEN '2024-01-01' AND '2024-03-31'
  AND amount BETWEEN 1000 AND 5000
  AND region = 'North';`} 
          />
          <FunFact text="BETWEEN is inclusive - it includes both boundary values. So 'BETWEEN 1 AND 10' includes both 1 and 10!" />
        </div>
      </div>

      {/* Lecture 7: IN Operator */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="in-operator">
            <span className="lecture-icon">▶️</span> IN Operator
          </h2>
          <div className="subtitle">Duration: 4:14</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The IN operator allows you to specify multiple values in a WHERE clause. It's a cleaner 
            alternative to multiple OR conditions and makes your queries more readable.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- IN with text values
SELECT * FROM employees
WHERE department IN ('Sales', 'Marketing', 'HR');
-- Same as: WHERE department = 'Sales' OR department = 'Marketing' OR department = 'HR'

-- IN with numbers
SELECT * FROM products
WHERE product_id IN (101, 105, 110, 115, 120);

-- IN with dates
SELECT * FROM orders
WHERE order_date IN ('2024-01-15', '2024-02-20', '2024-03-10');

-- NOT IN
SELECT * FROM customers
WHERE country NOT IN ('USA', 'Canada', 'Mexico');

-- IN with subquery
SELECT * FROM orders
WHERE customer_id IN (
  SELECT customer_id 
  FROM customers 
  WHERE country = 'USA'
);

-- IN with multiple columns (some databases)
SELECT * FROM employees
WHERE (department, job_title) IN (
  ('Sales', 'Manager'),
  ('Marketing', 'Director'),
  ('IT', 'Lead')
);`} 
          />
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>Using OR</h3>
              <div style={{ 
                background: 'var(--code-bg)', 
                padding: '12px', 
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '14px',
                fontFamily: 'monospace',
                whiteSpace: 'pre'
              }}>
                SELECT * FROM employees{'\n'}
                WHERE dept = 'Sales'{'\n'}
                   OR dept = 'Marketing'{'\n'}
                   OR dept = 'HR'{'\n'}
                   OR dept = 'IT';
              </div>
            </div>
            <div className="comparison-col right">
              <h3>Using IN</h3>
              <div style={{ 
                background: 'var(--code-bg)', 
                padding: '12px', 
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '14px',
                fontFamily: 'monospace',
                whiteSpace: 'pre'
              }}>
                SELECT * FROM employees{'\n'}
                WHERE dept IN ({'\n'}
                  'Sales',{'\n'}
                  'Marketing',{'\n'}
                  'HR',{'\n'}
                  'IT'{'\n'}
                );
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 8: LIKE Operators */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="like-operators">
            <span className="lecture-icon">▶️</span> LIKE Operators
          </h2>
          <div className="subtitle">Duration: 10:46</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            The LIKE operator is used for pattern matching in text columns. It uses wildcards 
            to search for specific patterns within strings, making it perfect for flexible text searches.
          </p>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Percent (%) Wildcard</h3>
          <p className="prose">
            The % wildcard matches zero or more characters of any kind.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Starts with pattern
SELECT * FROM customers
WHERE last_name LIKE 'Smith%';
-- Matches: Smith, Smithson, Smithers, etc.

-- Ends with pattern
SELECT * FROM employees
WHERE email LIKE '%@gmail.com';
-- Matches any email ending with @gmail.com

-- Contains pattern
SELECT * FROM products
WHERE product_name LIKE '%phone%';
-- Matches: iPhone, smartphone, telephone, etc.

-- Multiple % wildcards
SELECT * FROM customers
WHERE address LIKE '%Main%Street%';
-- Matches addresses containing both "Main" and "Street"`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Underscore (_) Wildcard</h3>
          <p className="prose">
            The _ wildcard matches exactly one character.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Match specific pattern length
SELECT * FROM products
WHERE product_code LIKE 'A_123';
-- Matches: A1123, A2123, AB123, etc. (exactly 5 characters)

-- Multiple underscores
SELECT * FROM customers
WHERE phone LIKE '555-____-____';
-- Matches: 555-1234-5678 format

-- Combining _ and %
SELECT * FROM employees
WHERE name LIKE 'J_n%';
-- Matches: John, Jane, Jennifer, etc.`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>NOT LIKE</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Exclude patterns
SELECT * FROM employees
WHERE email NOT LIKE '%@company.com';

-- Exclude multiple patterns
SELECT * FROM products
WHERE product_name NOT LIKE '%discontinued%'
  AND product_name NOT LIKE '%obsolete%';`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Case Sensitivity</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Case-insensitive (default in MySQL)
SELECT * FROM customers
WHERE name LIKE '%john%';
-- Matches: John, JOHN, john, Johnny

-- Case-sensitive (use BINARY)
SELECT * FROM customers
WHERE name LIKE BINARY '%John%';
-- Matches only: John, Johnny (not JOHN or john)`} 
          />

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Escaping Special Characters</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Search for literal % or _
SELECT * FROM products
WHERE description LIKE '%50\\% off%';
-- Matches: "Get 50% off today"

-- Custom escape character
SELECT * FROM products
WHERE description LIKE '%50!% off%' ESCAPE '!';`} 
          />

          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">% Wildcard</span>
              </div>
              <div className="simple">Matches zero or more characters</div>
              <div className="example">LIKE 'J%' → John, Jane, Jack</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">_ Wildcard</span>
              </div>
              <div className="simple">Matches exactly one character</div>
              <div className="example">LIKE 'J_n' → Jon, Jan, Jin</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Starts With</span>
              </div>
              <div className="simple">Pattern at beginning</div>
              <div className="example">LIKE 'Smith%'</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Ends With</span>
              </div>
              <div className="simple">Pattern at end</div>
              <div className="example">LIKE '%@gmail.com'</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Contains</span>
              </div>
              <div className="simple">Pattern anywhere</div>
              <div className="example">LIKE '%phone%'</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">NOT LIKE</span>
              </div>
              <div className="simple">Exclude patterns</div>
              <div className="example">NOT LIKE '%test%'</div>
            </div>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Common LIKE Patterns</h3>
          <CodeBlock 
            language="sql" 
            code={`-- Find names starting with vowels
SELECT * FROM customers
WHERE name LIKE 'A%' OR name LIKE 'E%' OR name LIKE 'I%' 
   OR name LIKE 'O%' OR name LIKE 'U%';

-- Find phone numbers with specific area code
SELECT * FROM contacts
WHERE phone LIKE '555-%';

-- Find emails from specific domains
SELECT * FROM users
WHERE email LIKE '%@gmail.com' OR email LIKE '%@yahoo.com';

-- Find products with version numbers
SELECT * FROM products
WHERE name LIKE '%v_.%';
-- Matches: v1.0, v2.5, etc.`} 
          />
        </div>
      </div>

      {/* Quiz */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="quiz">
            <span className="lecture-icon">📝</span> Quiz | Filtering Data
          </h2>
          <div className="subtitle">Test your knowledge</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Test your understanding of data filtering. This quiz covers comparison operators, 
            logical operators (AND, OR, NOT), BETWEEN, IN, and LIKE pattern matching.
          </p>
          <div style={{ 
            padding: '20px', 
            background: 'var(--card-bg)', 
            borderRadius: '8px',
            border: '2px solid var(--accent)',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 Ready to test your filtering skills? Complete the quiz to reinforce what you've learned!
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Example */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="comprehensive-example">Comprehensive Filtering Example</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Here's a complex example combining multiple filtering techniques:
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Complex filtering query
SELECT 
  employee_id,
  first_name,
  last_name,
  department,
  salary,
  hire_date,
  email
FROM employees
WHERE 
  -- Department filter with IN
  department IN ('Sales', 'Marketing', 'Engineering')
  
  -- Salary range with BETWEEN
  AND salary BETWEEN 50000 AND 100000
  
  -- Hire date filter
  AND hire_date >= '2020-01-01'
  
  -- Email pattern matching
  AND email LIKE '%@company.com'
  
  -- Exclude specific conditions
  AND status != 'Terminated'
  
  -- Complex condition with OR (use parentheses!)
  AND (
    performance_rating >= 4 
    OR years_of_service > 5
  )
  
  -- NOT NULL check
  AND phone IS NOT NULL
  
ORDER BY salary DESC, hire_date ASC;`} 
          />
        </div>
      </div>

      {/* Best Practices */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="best-practices">Filtering Best Practices</h2>
        </div>
        <div className="doc-card-body">
          <ul className="prose">
            <li><strong>Use parentheses with AND/OR:</strong> Makes logic clear and prevents errors</li>
            <li><strong>Use IN instead of multiple ORs:</strong> More readable and often faster</li>
            <li><strong>Use BETWEEN for ranges:</strong> Cleaner than = AND =</li>
            <li><strong>Be careful with LIKE:</strong> Can be slow on large tables without indexes</li>
            <li><strong>Test complex filters:</strong> Start simple, add conditions gradually</li>
            <li><strong>Consider NULL values:</strong> Use IS NULL or IS NOT NULL explicitly</li>
            <li><strong>Use appropriate data types:</strong> Don't compare strings to numbers</li>
            <li><strong>Index filtered columns:</strong> Improves query performance significantly</li>
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
            Excellent work! You now know how to filter data effectively using various operators. 
            Next, you'll learn about SQL Joins to combine data from multiple tables.
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
              onClick={() => onNavigate?.('sql-joins' as SubsectionId)}
            >
              Continue to SQL Joins →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FilteringDataPage;
