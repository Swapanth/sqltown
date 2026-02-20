import React from 'react';
import { CodeBlock } from '../CodeBlock';
import './docs-theme.css';

interface CaseWhenPageProps {
  initialTheme?: 'dark' | 'light';
}

const CaseWhenPage: React.FC<CaseWhenPageProps> = () => {
  return (
    <div className="docs-page">
      {/* Hero Section */}
      <section className="docs-hero">
        <div className="docs-hero-badge">MySQL Basics</div>
        <h1 className="docs-hero-title">CASE WHEN Statement</h1>
        <p className="docs-hero-subtitle">
          Master conditional logic in SQL with CASE WHEN statements. Learn to categorize data, 
          map values, handle NULLs, and create dynamic calculations based on conditions.
        </p>
        <div className="docs-hero-meta">
          <span>⏱️ 33min</span>
          <span>📚 6 lectures</span>
          <span>🎯 Intermediate</span>
        </div>
      </section>

      {/* Lecture 1: Introduction to CASE Statements */}
      <section className="docs-lecture">
        <div className="lecture-card">
          <div className="lecture-play-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#3B82F6" />
              <path d="M10 8l6 4-6 4v-8z" fill="white" />
            </svg>
          </div>
          <div className="lecture-info">
            <h2 className="lecture-title">What is Introduction to CASE Statements</h2>
            <p className="lecture-duration">Duration: 7:28</p>
          </div>
        </div>
        
        <div className="docs-content">
          <p>
            CASE statements are SQL's way of implementing conditional logic, similar to IF-THEN-ELSE 
            statements in programming languages. They allow you to return different values based on specific conditions.
          </p>

          <h3>What is CASE?</h3>
          <ul>
            <li>Conditional expression that returns a value based on conditions</li>
            <li>Can be used in SELECT, WHERE, ORDER BY, and GROUP BY clauses</li>
            <li>Supports multiple WHEN-THEN pairs with an optional ELSE</li>
            <li>Evaluates conditions in order and returns first match</li>
          </ul>

          <h3>Basic CASE Syntax</h3>
          <CodeBlock 
            code={`-- Simple CASE expression
CASE column_name
    WHEN value1 THEN result1
    WHEN value2 THEN result2
    ELSE default_result
END

-- Searched CASE expression
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ELSE default_result
END`}
            language="sql"
          />

          <h3>Simple vs Searched CASE</h3>
          <div className="docs-grid-2">
            <div className="docs-card">
              <h4>Simple CASE</h4>
              <p>Compares a single expression to multiple values</p>
              <CodeBlock 
                code={`CASE department_id
    WHEN 1 THEN 'Sales'
    WHEN 2 THEN 'Marketing'
    WHEN 3 THEN 'IT'
    ELSE 'Other'
END`}
                language="sql"
              />
            </div>
            <div className="docs-card">
              <h4>Searched CASE</h4>
              <p>Evaluates multiple independent conditions</p>
              <CodeBlock 
                code={`CASE
    WHEN salary < 30000 THEN 'Low'
    WHEN salary < 60000 THEN 'Medium'
    WHEN salary >= 60000 THEN 'High'
END`}
                language="sql"
              />
            </div>
          </div>

          <div className="docs-callout docs-callout-tip">
            <strong>💡 Best Practice:</strong> Use searched CASE when you need to compare 
            different columns or use complex conditions. Use simple CASE for straightforward value matching.
          </div>
        </div>
      </section>

      {/* Lecture 2: Use Case: Categorizing Data */}
      <section className="docs-lecture">
        <div className="lecture-card">
          <div className="lecture-play-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#3B82F6" />
              <path d="M10 8l6 4-6 4v-8z" fill="white" />
            </svg>
          </div>
          <div className="lecture-info">
            <h2 className="lecture-title">Use Case: Categorizing Data</h2>
            <p className="lecture-duration">Duration: 5:18</p>
          </div>
        </div>
        
        <div className="docs-content">
          <p>
            One of the most common uses of CASE statements is categorizing continuous data into 
            meaningful groups. This is especially useful for creating reports and dashboards.
          </p>

          <h3>Salary Categories</h3>
          <CodeBlock 
            code={`-- Categorize employees by salary ranges
SELECT 
    employee_name,
    salary,
    CASE
        WHEN salary < 30000 THEN 'Entry Level'
        WHEN salary < 50000 THEN 'Junior'
        WHEN salary < 75000 THEN 'Mid-Level'
        WHEN salary < 100000 THEN 'Senior'
        ELSE 'Executive'
    END AS salary_category
FROM employees;`}
            language="sql"
          />

          <h3>Age Groups</h3>
          <CodeBlock 
            code={`-- Group customers by age demographics
SELECT 
    customer_name,
    birth_date,
    TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age,
    CASE
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 18 THEN 'Minor'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 25 THEN 'Young Adult'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 40 THEN 'Adult'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 65 THEN 'Middle Age'
        ELSE 'Senior'
    END AS age_group
FROM customers;`}
            language="sql"
          />

          <h3>Performance Ratings</h3>
          <CodeBlock 
            code={`-- Convert numeric scores to letter grades
SELECT 
    student_name,
    test_score,
    CASE
        WHEN test_score >= 90 THEN 'A'
        WHEN test_score >= 80 THEN 'B'
        WHEN test_score >= 70 THEN 'C'
        WHEN test_score >= 60 THEN 'D'
        ELSE 'F'
    END AS grade
FROM test_results;`}
            language="sql"
          />

          <div className="docs-callout docs-callout-warning">
            <strong>⚠️ Important:</strong> CASE expressions evaluate conditions in order. 
            Always arrange conditions from most specific to most general to avoid unexpected results.
          </div>
        </div>
      </section>

      {/* Lecture 3: CASE Rules */}
      <section className="docs-lecture">
        <div className="lecture-card">
          <div className="lecture-play-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#3B82F6" />
              <path d="M10 8l6 4-6 4v-8z" fill="white" />
            </svg>
          </div>
          <div className="lecture-info">
            <h2 className="lecture-title">CASE Rules</h2>
            <p className="lecture-duration">Duration: 1:30</p>
          </div>
        </div>
        
        <div className="docs-content">
          <p>
            Understanding the rules and behavior of CASE statements is crucial for writing correct 
            and efficient conditional logic in SQL.
          </p>

          <h3>Key Rules</h3>
          <div className="docs-grid-2">
            <div className="docs-card">
              <h4>✅ Must Follow</h4>
              <ul>
                <li>Every CASE must end with END</li>
                <li>All WHEN clauses must have THEN</li>
                <li>Data types should be consistent</li>
                <li>At least one WHEN clause required</li>
              </ul>
            </div>
            <div className="docs-card">
              <h4>⚠️ Important Notes</h4>
              <ul>
                <li>Evaluates in sequential order</li>
                <li>Returns first matching condition</li>
                <li>ELSE is optional</li>
                <li>Can be nested within other CASE</li>
              </ul>
            </div>
          </div>

          <h3>Data Type Consistency</h3>
          <CodeBlock language="sql">
{`-- GOOD: All return values are strings
CASE department_id
    WHEN 1 THEN 'Sales'
    WHEN 2 THEN 'Marketing'
    ELSE 'Unknown'
END

-- BAD: Mixed data types (may cause errors)
CASE department_id
    WHEN 1 THEN 'Sales'      -- String
    WHEN 2 THEN 25          -- Number
    ELSE NULL               -- NULL
END`}
          </CodeBlock>

          <div className="docs-callout docs-callout-info">
            <strong>📝 Rule of Thumb:</strong> Always ensure all possible return values in a CASE 
            expression have the same or compatible data types to avoid conversion issues.
          </div>
        </div>
      </section>

      {/* Lecture 4: Use Case: Mapping Values */}
      <section className="docs-lecture">
        <div className="lecture-card">
          <div className="lecture-play-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#3B82F6" />
              <path d="M10 8l6 4-6 4v-8z" fill="white" />
            </svg>
          </div>
          <div className="lecture-info">
            <h2 className="lecture-title">Use Case: Mapping Values</h2>
            <p className="lecture-duration">Duration: 8:51</p>
          </div>
        </div>
        
        <div className="docs-content">
          <p>
            CASE statements are perfect for mapping codes, abbreviations, or cryptic values 
            to human-readable descriptions. This is essential for creating user-friendly reports.
          </p>

          <h3>Status Code Mapping</h3>
          <CodeBlock language="sql">
{`-- Convert status codes to descriptions
SELECT 
    order_id,
    status_code,
    CASE status_code
        WHEN 'P' THEN 'Pending'
        WHEN 'C' THEN 'Confirmed'
        WHEN 'S' THEN 'Shipped'
        WHEN 'D' THEN 'Delivered'
        WHEN 'X' THEN 'Cancelled'
        ELSE 'Unknown Status'
    END AS status_description
FROM orders;`}
          </CodeBlock>

          <h3>Country Code to Full Name</h3>
          <CodeBlock language="sql">
{`-- Expand country abbreviations
SELECT 
    customer_name,
    country_code,
    CASE country_code
        WHEN 'US' THEN 'United States'
        WHEN 'CA' THEN 'Canada'
        WHEN 'UK' THEN 'United Kingdom'
        WHEN 'AU' THEN 'Australia'
        WHEN 'DE' THEN 'Germany'
        ELSE 'International'
    END AS country_name
FROM customers;`}
          </CodeBlock>

          <h3>Day of Week Mapping</h3>
          <CodeBlock language="sql">
{`-- Convert day numbers to names
SELECT 
    order_date,
    DAYOFWEEK(order_date) AS day_number,
    CASE DAYOFWEEK(order_date)
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
    END AS day_name
FROM orders;`}
          </CodeBlock>

          <h3>Product Category Mapping</h3>
          <CodeBlock language="sql">
{`-- Map product codes to categories
SELECT 
    product_name,
    product_code,
    CASE
        WHEN product_code LIKE 'ELEC%' THEN 'Electronics'
        WHEN product_code LIKE 'CLOTH%' THEN 'Clothing'
        WHEN product_code LIKE 'FOOD%' THEN 'Food & Beverages'
        WHEN product_code LIKE 'BOOK%' THEN 'Books'
        WHEN product_code LIKE 'TOY%' THEN 'Toys & Games'
        ELSE 'Other'
    END AS category
FROM products;`}
          </CodeBlock>

          <div className="docs-callout docs-callout-tip">
            <strong>💡 Pro Tip:</strong> For complex mappings with many values, consider using 
            a lookup table instead of a large CASE statement for better maintainability.
          </div>
        </div>
      </section>

      {/* Lecture 5: Use Case: Handling Nulls */}
      <section className="docs-lecture">
        <div className="lecture-card">
          <div className="lecture-play-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#3B82F6" />
              <path d="M10 8l6 4-6 4v-8z" fill="white" />
            </svg>
          </div>
          <div className="lecture-info">
            <h2 className="lecture-title">Use Case: Handling Nulls</h2>
            <p className="lecture-duration">Duration: 8:32</p>
          </div>
        </div>
        
        <div className="docs-content">
          <p>
            CASE statements provide flexible ways to handle NULL values, allowing you to provide 
            default values, special handling, or conditional logic based on NULL presence.
          </p>

          <h3>NULL Detection and Replacement</h3>
          <CodeBlock language="sql">
{`-- Replace NULL with meaningful defaults
SELECT 
    employee_name,
    phone_number,
    CASE
        WHEN phone_number IS NULL THEN 'No phone provided'
        ELSE phone_number
    END AS contact_phone,
    
    email,
    CASE
        WHEN email IS NULL THEN 'No email provided'
        ELSE email
    END AS contact_email
FROM employees;`}
          </CodeBlock>

          <h3>Conditional NULL Handling</h3>
          <CodeBlock language="sql">
{`-- Different handling based on multiple NULL conditions
SELECT 
    customer_name,
    phone,
    email,
    CASE
        WHEN phone IS NULL AND email IS NULL THEN 'No contact info'
        WHEN phone IS NULL AND email IS NOT NULL THEN 'Email only'
        WHEN phone IS NOT NULL AND email IS NULL THEN 'Phone only'
        ELSE 'Full contact info'
    END AS contact_status
FROM customers;`}
          </CodeBlock>

          <h3>NULL in Calculations</h3>
          <CodeBlock language="sql">
{`-- Safe calculations with NULL handling
SELECT 
    product_name,
    regular_price,
    sale_price,
    CASE
        WHEN regular_price IS NULL THEN 'Price not set'
        WHEN sale_price IS NULL THEN regular_price
        WHEN sale_price >= regular_price THEN 'No discount'
        ELSE CONCAT('Save ', regular_price - sale_price)
    END AS price_info
FROM products;`}
          </CodeBlock>

          <h3>NULL vs Empty String</h3>
          <CodeBlock language="sql">
{`-- Handle both NULL and empty strings
SELECT 
    customer_name,
    address,
    CASE
        WHEN address IS NULL THEN 'No address'
        WHEN TRIM(address) = '' THEN 'Empty address'
        ELSE address
    END AS formatted_address
FROM customers;`}
          </CodeBlock>

          <div className="docs-callout docs-callout-warning">
            <strong>⚠️ Remember:</strong> NULL = NULL is always NULL (never TRUE). 
            Always use IS NULL or IS NOT NULL to check for NULL values in CASE statements.
          </div>
        </div>
      </section>

      {/* Lecture 6: CASE Statement Summary */}
      <section className="docs-lecture">
        <div className="lecture-card">
          <div className="lecture-play-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#3B82F6" />
              <path d="M10 8l6 4-6 4v-8z" fill="white" />
            </svg>
          </div>
          <div className="lecture-info">
            <h2 className="lecture-title">CASE Statement Summary</h2>
            <p className="lecture-duration">Duration: 1:49</p>
          </div>
        </div>
        
        <div className="docs-content">
          <p>
            Let's recap the key concepts and best practices for using CASE statements effectively in SQL.
          </p>

          <h3>Key CASE Concepts</h3>
          <div className="docs-grid-2">
            <div className="docs-card">
              <h4>Simple CASE</h4>
              <p>Compare single expression to values</p>
              <CodeBlock language="sql">
{`CASE column
    WHEN value1 THEN result1
    WHEN value2 THEN result2
    ELSE default
END`}
              </CodeBlock>
            </div>
            <div className="docs-card">
              <h4>Searched CASE</h4>
              <p>Evaluate multiple conditions</p>
              <CodeBlock language="sql">
{`CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ELSE default
END`}
              </CodeBlock>
            </div>
          </div>

          <h3>Common Use Cases</h3>
          <div className="docs-grid-3">
            <div className="docs-card">
              <h4>📊 Categorization</h4>
              <p>Group continuous data into ranges</p>
            </div>
            <div className="docs-card">
              <h4>🔄 Value Mapping</h4>
              <p>Convert codes to descriptions</p>
            </div>
            <div className="docs-card">
              <h4>⚠️ NULL Handling</h4>
              <p>Provide defaults for missing data</p>
            </div>
          </div>

          <h3>Best Practices</h3>
          <div className="docs-callout docs-callout-info">
            <ol>
              <li><strong>Order Matters:</strong> Arrange conditions from specific to general</li>
              <li><strong>Consistent Types:</strong> Return same data type in all branches</li>
              <li><strong>Use ELSE:</strong> Always provide a default case</li>
              <li><strong>Performance:</strong> Consider indexes for CASE in WHERE clauses</li>
              <li><strong>Readability:</strong> Keep CASE expressions simple and clear</li>
            </ol>
          </div>

          <h3>Quick Reference</h3>
          <CodeBlock language="sql">
{`-- Complete example with best practices
SELECT 
    employee_name,
    salary,
    department,
    CASE
        WHEN salary IS NULL THEN 'Salary not set'
        WHEN department = 'Sales' AND salary > 100000 THEN 'Top Sales Performer'
        WHEN department = 'IT' AND salary > 90000 THEN 'Senior Developer'
        WHEN salary >= 75000 THEN 'High Earner'
        WHEN salary >= 50000 THEN 'Mid Range'
        ELSE 'Entry Level'
    END AS employee_category
FROM employees
WHERE status = 'Active';`}
          </CodeBlock>
        </div>
      </section>
    </div>
  );
};

export default CaseWhenPage;
