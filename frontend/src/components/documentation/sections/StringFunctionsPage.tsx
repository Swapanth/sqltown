import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface StringFunctionsPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const StringFunctionsPage: React.FC<StringFunctionsPageProps> = ({ initialTheme = 'dark', onNavigate }) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}}
      breadcrumb={{ section: 'basics', subsection: 'string-functions' }}
      currentSection="string-functions"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>📝 MySQL Basics</span>
        </div>
        <h1>String Functions</h1>
        <p className="description">
          Master SQL string manipulation functions to transform, extract, and format text data. 
          Learn CONCAT, UPPER, LOWER, TRIM, REPLACE, SUBSTRING, and more.
        </p>
        <DifficultyBadge level="intermediate" />
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          10 lectures • 36min
        </div>
      </div>

      <FunFact text="String functions are essential for data cleaning, formatting reports, and preparing data for display!" />

      {/* Lecture 1: Intro - What is Data Transformation */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="intro-transformation">
            <span className="lecture-icon">▶️</span> Intro - What is Data Transformation
          </h2>
          <div className="subtitle">Duration: 1:03</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Data transformation is the process of converting data from one format or structure to another. 
            String functions are key tools for transforming text data in SQL queries.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Raw data
first_name: 'john', last_name: 'DOE'

-- Transformed data
full_name: 'John Doe'

-- Examples of transformation
SELECT 
  UPPER(first_name) AS first_upper,      -- 'JOHN'
  LOWER(last_name) AS last_lower,        -- 'doe'
  CONCAT(first_name, ' ', last_name) AS full_name  -- 'john DOE'
FROM employees;`} 
          />
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Why Transform?</span>
              </div>
              <div className="simple">Clean, format, standardize data</div>
              <div className="example">Consistent capitalization</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Common Uses</span>
              </div>
              <div className="simple">Reports, exports, data cleaning</div>
              <div className="example">Format names, emails, addresses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 2: SQL Functions */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="sql-functions">
            <span className="lecture-icon">▶️</span> SQL Functions
          </h2>
          <div className="subtitle">Duration: 5:16</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SQL provides built-in functions for various operations. String functions specifically 
            manipulate text data. Functions take input (arguments) and return output (results).
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Function syntax
FUNCTION_NAME(argument1, argument2, ...)

-- String function examples
SELECT 
  LENGTH('Hello') AS len,           -- 5
  UPPER('hello') AS upper_text,     -- 'HELLO'
  LOWER('WORLD') AS lower_text,     -- 'world'
  CONCAT('Hello', ' ', 'World') AS combined;  -- 'Hello World'

-- Functions in WHERE clause
SELECT * FROM customers
WHERE UPPER(email) LIKE '%@GMAIL.COM';

-- Functions in ORDER BY
SELECT first_name, last_name
FROM employees
ORDER BY UPPER(last_name);

-- Nested functions
SELECT 
  UPPER(TRIM(first_name)) AS clean_name
FROM employees;`} 
          />
          <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Categories of String Functions</h3>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Case Conversion</span>
              </div>
              <div className="simple">UPPER, LOWER, INITCAP</div>
              <div className="example">Change text case</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Concatenation</span>
              </div>
              <div className="simple">CONCAT, CONCAT_WS</div>
              <div className="example">Combine strings</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Trimming</span>
              </div>
              <div className="simple">TRIM, LTRIM, RTRIM</div>
              <div className="example">Remove whitespace</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Extraction</span>
              </div>
              <div className="simple">SUBSTRING, LEFT, RIGHT</div>
              <div className="example">Get part of string</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Replacement</span>
              </div>
              <div className="simple">REPLACE</div>
              <div className="example">Replace text</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Measurement</span>
              </div>
              <div className="simple">LENGTH, CHAR_LENGTH</div>
              <div className="example">Get string length</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 3: CONCAT */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="concat">
            <span className="lecture-icon">▶️</span> CONCAT
          </h2>
          <div className="subtitle">Duration: 3:04</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            CONCAT combines two or more strings into one. It's perfect for creating full names, 
            addresses, or any combined text fields.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic CONCAT
SELECT CONCAT('Hello', ' ', 'World');  -- 'Hello World'

-- Combine columns
SELECT 
  CONCAT(first_name, ' ', last_name) AS full_name
FROM employees;

-- Multiple values
SELECT 
  CONCAT(street, ', ', city, ', ', state, ' ', zip) AS full_address
FROM addresses;

-- With literals
SELECT 
  CONCAT('Employee: ', first_name, ' ', last_name) AS label
FROM employees;

-- CONCAT_WS (with separator)
SELECT 
  CONCAT_WS(' ', first_name, middle_name, last_name) AS full_name
FROM employees;
-- Automatically adds space between non-NULL values

-- CONCAT_WS with different separator
SELECT 
  CONCAT_WS(', ', city, state, country) AS location
FROM customers;

-- Handling NULL values
SELECT 
  CONCAT(first_name, ' ', middle_name, ' ', last_name) AS name1,
  -- If middle_name is NULL, entire result is NULL
  
  CONCAT_WS(' ', first_name, middle_name, last_name) AS name2
  -- CONCAT_WS skips NULL values
FROM employees;`} 
          />
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>CONCAT</h3>
              <ul>
                <li>Combines all arguments</li>
                <li>Returns NULL if any arg is NULL</li>
                <li>Must specify separators</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>CONCAT_WS</h3>
              <ul>
                <li>First arg is separator</li>
                <li>Skips NULL values</li>
                <li>Auto-adds separator</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 4: UPPER & LOWER */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="upper-lower">
            <span className="lecture-icon">▶️</span> UPPER & LOWER
          </h2>
          <div className="subtitle">Duration: 2:30</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            UPPER converts text to uppercase, LOWER converts to lowercase. Essential for 
            standardizing data and case-insensitive comparisons.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- UPPER function
SELECT UPPER('hello world');  -- 'HELLO WORLD'

SELECT 
  first_name,
  UPPER(first_name) AS first_upper,
  last_name,
  UPPER(last_name) AS last_upper
FROM employees;

-- LOWER function
SELECT LOWER('HELLO WORLD');  -- 'hello world'

SELECT 
  email,
  LOWER(email) AS email_lower
FROM customers;

-- Case-insensitive search
SELECT * FROM customers
WHERE UPPER(email) = UPPER('John.Doe@Email.COM');

-- Standardize data
UPDATE customers
SET email = LOWER(email)
WHERE email != LOWER(email);

-- Format names properly (Title Case - requires more work)
SELECT 
  CONCAT(
    UPPER(LEFT(first_name, 1)),
    LOWER(SUBSTRING(first_name, 2))
  ) AS proper_first_name
FROM employees;`} 
          />
        </div>
      </div>

      {/* Lecture 5: TRIM */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="trim">
            <span className="lecture-icon">▶️</span> TRIM
          </h2>
          <div className="subtitle">Duration: 5:27</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            TRIM removes unwanted characters (usually spaces) from the beginning and/or end of strings. 
            Essential for data cleaning.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic TRIM (removes spaces from both ends)
SELECT TRIM('   Hello World   ');  -- 'Hello World'

-- LTRIM (left trim - removes from start)
SELECT LTRIM('   Hello World   ');  -- 'Hello World   '

-- RTRIM (right trim - removes from end)
SELECT RTRIM('   Hello World   ');  -- '   Hello World'

-- Clean user input
SELECT 
  customer_name,
  TRIM(customer_name) AS clean_name
FROM customers;

-- TRIM specific characters
SELECT TRIM('x' FROM 'xxxHelloxxx');  -- 'Hello'
SELECT TRIM(BOTH 'x' FROM 'xxxHelloxxx');  -- 'Hello'
SELECT TRIM(LEADING 'x' FROM 'xxxHelloxxx');  -- 'Helloxxx'
SELECT TRIM(TRAILING 'x' FROM 'xxxHelloxxx');  -- 'xxxHello'

-- Clean data in UPDATE
UPDATE products
SET product_name = TRIM(product_name)
WHERE product_name != TRIM(product_name);

-- Remove multiple types of whitespace
SELECT 
  TRIM(CHAR(9) FROM TRIM(CHAR(10) FROM TRIM(column_name)))
FROM table_name;
-- Removes tabs and newlines

-- Practical example: Clean email addresses
SELECT 
  email,
  LOWER(TRIM(email)) AS clean_email
FROM customers
WHERE email LIKE '% %' OR email != TRIM(email);`} 
          />
          <FunFact text="TRIM is one of the most important functions for data quality - it prevents issues caused by invisible whitespace!" />
        </div>
      </div>

      {/* Lecture 6: REPLACE */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="replace">
            <span className="lecture-icon">▶️</span> REPLACE
          </h2>
          <div className="subtitle">Duration: 3:31</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            REPLACE substitutes all occurrences of a substring with another substring. Perfect for 
            data standardization and corrections.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic REPLACE
SELECT REPLACE('Hello World', 'World', 'SQL');  -- 'Hello SQL'

-- Replace in column
SELECT 
  phone,
  REPLACE(phone, '-', '') AS phone_no_dashes
FROM customers;

-- Multiple replacements (nest REPLACE functions)
SELECT 
  REPLACE(
    REPLACE(
      REPLACE(phone, '-', ''),
      '(', ''
    ),
    ')', ''
  ) AS clean_phone
FROM customers;

-- Standardize data
UPDATE products
SET description = REPLACE(description, 'colour', 'color')
WHERE description LIKE '%colour%';

-- Remove unwanted characters
SELECT 
  product_code,
  REPLACE(REPLACE(REPLACE(product_code, ' ', ''), '-', ''), '_', '') AS clean_code
FROM products;

-- Format phone numbers
SELECT 
  phone,
  CONCAT(
    '(',
    SUBSTRING(REPLACE(phone, '-', ''), 1, 3),
    ') ',
    SUBSTRING(REPLACE(phone, '-', ''), 4, 3),
    '-',
    SUBSTRING(REPLACE(phone, '-', ''), 7, 4)
  ) AS formatted_phone
FROM customers;

-- Case-sensitive replacement
SELECT REPLACE('Hello hello HELLO', 'hello', 'hi');
-- Result: 'Hello hi HELLO' (only lowercase 'hello' replaced)`} 
          />
        </div>
      </div>

      {/* Lecture 7: LEN */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="len">
            <span className="lecture-icon">▶️</span> LEN
          </h2>
          <div className="subtitle">Duration: 1:49</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            LENGTH (or LEN in some databases) returns the number of characters in a string. 
            Useful for validation and data quality checks.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic LENGTH
SELECT LENGTH('Hello World');  -- 11

-- Check string lengths
SELECT 
  product_name,
  LENGTH(product_name) AS name_length
FROM products;

-- Find long descriptions
SELECT product_name, description
FROM products
WHERE LENGTH(description) > 500;

-- Validation: Find invalid phone numbers
SELECT customer_name, phone
FROM customers
WHERE LENGTH(REPLACE(REPLACE(phone, '-', ''), ' ', '')) != 10;

-- Find empty or very short values
SELECT * FROM products
WHERE LENGTH(TRIM(product_name)) < 3;

-- CHAR_LENGTH vs LENGTH
-- CHAR_LENGTH counts characters
-- LENGTH counts bytes (different for multi-byte characters)
SELECT 
  'Hello' AS text,
  CHAR_LENGTH('Hello') AS char_len,  -- 5
  LENGTH('Hello') AS byte_len;        -- 5

-- With multi-byte characters (e.g., emoji, Chinese)
SELECT 
  '你好' AS text,
  CHAR_LENGTH('你好') AS char_len,  -- 2 characters
  LENGTH('你好') AS byte_len;        -- 6 bytes (UTF-8)`} 
          />
        </div>
      </div>

      {/* Lecture 8: LEFT & RIGHT */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="left-right">
            <span className="lecture-icon">▶️</span> LEFT & RIGHT
          </h2>
          <div className="subtitle">Duration: 3:11</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            LEFT extracts characters from the beginning of a string, RIGHT extracts from the end. 
            Perfect for extracting prefixes, suffixes, or fixed-position data.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- LEFT function
SELECT LEFT('Hello World', 5);  -- 'Hello'

-- Extract area code from phone
SELECT 
  phone,
  LEFT(phone, 3) AS area_code
FROM customers;

-- RIGHT function
SELECT RIGHT('Hello World', 5);  -- 'World'

-- Extract file extension
SELECT 
  filename,
  RIGHT(filename, 4) AS extension
FROM files;

-- Extract initials
SELECT 
  first_name,
  last_name,
  CONCAT(LEFT(first_name, 1), LEFT(last_name, 1)) AS initials
FROM employees;

-- Get first 3 characters of product code
SELECT 
  product_code,
  LEFT(product_code, 3) AS category_code
FROM products;

-- Extract last 4 digits of credit card
SELECT 
  customer_name,
  CONCAT('****-****-****-', RIGHT(credit_card, 4)) AS masked_card
FROM customers;

-- Combine LEFT and RIGHT
SELECT 
  full_name,
  LEFT(full_name, LOCATE(' ', full_name) - 1) AS first_name,
  RIGHT(full_name, LENGTH(full_name) - LOCATE(' ', full_name)) AS last_name
FROM contacts;`} 
          />
        </div>
      </div>

      {/* Lecture 9: SUBSTRING */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="substring">
            <span className="lecture-icon">▶️</span> SUBSTRING
          </h2>
          <div className="subtitle">Duration: 6:08</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SUBSTRING (or SUBSTR) extracts a portion of a string from a specified position. 
            More flexible than LEFT/RIGHT for extracting middle portions.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Basic SUBSTRING
-- SUBSTRING(string, start_position, length)
SELECT SUBSTRING('Hello World', 1, 5);  -- 'Hello'
SELECT SUBSTRING('Hello World', 7, 5);  -- 'World'

-- Start position only (to end of string)
SELECT SUBSTRING('Hello World', 7);  -- 'World'

-- Extract middle name
SELECT 
  full_name,
  SUBSTRING(
    full_name,
    LOCATE(' ', full_name) + 1,
    LOCATE(' ', full_name, LOCATE(' ', full_name) + 1) - LOCATE(' ', full_name) - 1
  ) AS middle_name
FROM employees;

-- Extract date parts
SELECT 
  order_date,
  SUBSTRING(order_date, 1, 4) AS year,
  SUBSTRING(order_date, 6, 2) AS month,
  SUBSTRING(order_date, 9, 2) AS day
FROM orders;

-- Extract from end (negative position in some databases)
-- MySQL: Use LENGTH to calculate
SELECT 
  product_code,
  SUBSTRING(product_code, LENGTH(product_code) - 2, 3) AS last_3_chars
FROM products;

-- Parse structured data
SELECT 
  log_entry,
  SUBSTRING(log_entry, 1, 10) AS log_date,
  SUBSTRING(log_entry, 12, 8) AS log_time,
  SUBSTRING(log_entry, 21) AS log_message
FROM system_logs;

-- Extract email domain
SELECT 
  email,
  SUBSTRING(email, LOCATE('@', email) + 1) AS domain
FROM customers;

-- SUBSTRING_INDEX (MySQL specific)
SELECT 
  email,
  SUBSTRING_INDEX(email, '@', 1) AS username,
  SUBSTRING_INDEX(email, '@', -1) AS domain
FROM customers;`} 
          />
        </div>
      </div>

      {/* Lecture 10: Number Functions */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="number-functions">
            <span className="lecture-icon">▶️</span> Number Functions
          </h2>
          <div className="subtitle">Duration: 4:14</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            While focusing on strings, it's useful to know functions that work with numbers in strings, 
            like LPAD, RPAD for formatting, and CAST for conversion.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- LPAD (left pad) - add characters to left
SELECT LPAD('42', 5, '0');  -- '00042'

-- Format invoice numbers
SELECT 
  invoice_id,
  CONCAT('INV-', LPAD(invoice_id, 6, '0')) AS formatted_invoice
FROM invoices;
-- Result: INV-000042

-- RPAD (right pad) - add characters to right
SELECT RPAD('Hello', 10, '.');  -- 'Hello.....'

-- Format product codes
SELECT 
  RPAD(category_code, 10, '-') AS padded_code
FROM products;

-- REPEAT - repeat string N times
SELECT REPEAT('*', 5);  -- '*****'

-- Create visual indicators
SELECT 
  product_name,
  rating,
  REPEAT('⭐', rating) AS stars
FROM products;

-- SPACE - create spaces
SELECT CONCAT('Hello', SPACE(5), 'World');  -- 'Hello     World'

-- ASCII and CHAR
SELECT ASCII('A');  -- 65
SELECT CHAR(65);    -- 'A'

-- REVERSE - reverse string
SELECT REVERSE('Hello');  -- 'olleH'

-- FORMAT - format numbers with commas
SELECT FORMAT(1234567.89, 2);  -- '1,234,567.89'

-- Format currency
SELECT 
  product_name,
  CONCAT('$', FORMAT(price, 2)) AS formatted_price
FROM products;`} 
          />
        </div>
      </div>

      {/* Quiz */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="quiz">
            <span className="lecture-icon">📝</span> Quiz | String Functions
          </h2>
          <div className="subtitle">Test your knowledge</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Test your understanding of String Functions. This quiz covers CONCAT, UPPER, LOWER, 
            TRIM, REPLACE, LENGTH, LEFT, RIGHT, SUBSTRING, and formatting functions.
          </p>
          <div style={{ 
            padding: '20px', 
            background: 'var(--card-bg)', 
            borderRadius: '8px',
            border: '2px solid var(--accent)',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 Ready to test your string manipulation skills? Complete the quiz!
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Example */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="comprehensive-example">Comprehensive String Functions Example</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Here's a complex example combining multiple string functions:
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Clean and format customer data
SELECT 
  customer_id,
  
  -- Clean and format name
  CONCAT(
    UPPER(LEFT(TRIM(first_name), 1)),
    LOWER(SUBSTRING(TRIM(first_name), 2)),
    ' ',
    UPPER(LEFT(TRIM(last_name), 1)),
    LOWER(SUBSTRING(TRIM(last_name), 2))
  ) AS formatted_name,
  
  -- Clean and standardize email
  LOWER(TRIM(email)) AS clean_email,
  
  -- Extract email domain
  SUBSTRING_INDEX(LOWER(TRIM(email)), '@', -1) AS email_domain,
  
  -- Format phone number
  CONCAT(
    '(',
    SUBSTRING(REPLACE(REPLACE(phone, '-', ''), ' ', ''), 1, 3),
    ') ',
    SUBSTRING(REPLACE(REPLACE(phone, '-', ''), ' ', ''), 4, 3),
    '-',
    SUBSTRING(REPLACE(REPLACE(phone, '-', ''), ' ', ''), 7, 4)
  ) AS formatted_phone,
  
  -- Create initials
  CONCAT(
    UPPER(LEFT(TRIM(first_name), 1)),
    UPPER(LEFT(TRIM(last_name), 1))
  ) AS initials,
  
  -- Format address
  CONCAT_WS(', ',
    TRIM(street),
    TRIM(city),
    UPPER(TRIM(state)),
    LPAD(zip_code, 5, '0')
  ) AS full_address,
  
  -- Data quality check
  CASE
    WHEN LENGTH(TRIM(first_name)) < 2 THEN 'Invalid Name'
    WHEN email NOT LIKE '%@%.%' THEN 'Invalid Email'
    WHEN LENGTH(REPLACE(REPLACE(phone, '-', ''), ' ', '')) != 10 THEN 'Invalid Phone'
    ELSE 'Valid'
  END AS data_quality_status
  
FROM customers;`} 
          />
        </div>
      </div>

      {/* Best Practices */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="best-practices">String Functions Best Practices</h2>
        </div>
        <div className="doc-card-body">
          <ul className="prose">
            <li><strong>Always TRIM user input:</strong> Prevents issues with whitespace</li>
            <li><strong>Use CONCAT_WS for NULL safety:</strong> Skips NULL values automatically</li>
            <li><strong>Standardize case early:</strong> Use UPPER/LOWER for comparisons</li>
            <li><strong>Validate string lengths:</strong> Check LENGTH before/after operations</li>
            <li><strong>Be careful with SUBSTRING positions:</strong> SQL uses 1-based indexing</li>
            <li><strong>Consider performance:</strong> String functions can be slow on large datasets</li>
            <li><strong>Use REPLACE carefully:</strong> It replaces ALL occurrences</li>
            <li><strong>Test with edge cases:</strong> Empty strings, NULL values, special characters</li>
            <li><strong>Document complex string operations:</strong> Add comments for clarity</li>
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
            Excellent! You've mastered string manipulation in SQL. Next, you'll learn about 
            Date & Time Functions to work with temporal data.
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
              onClick={() => onNavigate?.('date-time-functions' as SubsectionId)}
            >
              Continue to Date & Time Functions →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default StringFunctionsPage;
