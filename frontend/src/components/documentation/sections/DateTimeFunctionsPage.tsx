import React from 'react';
import { PageLayout, CodeBlock, FunFact, DifficultyBadge } from './PageLayout';
import type { SubsectionId } from './index';
import './docs-theme.css';

interface DateTimeFunctionsPageProps {
  initialTheme?: 'dark' | 'light';
  onNavigate?: (sectionId: SubsectionId) => void;
}

const DateTimeFunctionsPage: React.FC<DateTimeFunctionsPageProps> = ({ initialTheme = 'dark', onNavigate }) => {
  return (
    <PageLayout
      theme={initialTheme}
      onToggleTheme={() => {}}
      breadcrumb={{ section: 'basics', subsection: 'date-time-functions' }}
      currentSection="date-time-functions"
      onNavigate={onNavigate}
    >
      {/* Hero */}
      <div className="section-hero">
        <div className="emoji-badge">
          <span>📅 MySQL Basics</span>
        </div>
        <h1>Date & Time Functions</h1>
        <p className="description">
          Master SQL date and time manipulation. Learn to extract, format, calculate, and compare 
          dates and times for reporting, analysis, and business logic.
        </p>
        <DifficultyBadge level="intermediate" />
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          18 lectures • 1hr 34min
        </div>
      </div>

      <FunFact text="Date and time functions are crucial for time-series analysis, scheduling, and calculating business metrics like age, tenure, and deadlines!" />

      {/* Lecture 1: What is Date & Time */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="what-is-datetime">
            <span className="lecture-icon">▶️</span> What is Date & Time
          </h2>
          <div className="subtitle">Duration: 3:31</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Date and time data types store temporal information. SQL provides various data types 
            and functions to work with dates, times, and timestamps.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Date and Time data types
DATE        -- '2024-12-25' (YYYY-MM-DD)
TIME        -- '14:30:00' (HH:MM:SS)
DATETIME    -- '2024-12-25 14:30:00'
TIMESTAMP   -- '2024-12-25 14:30:00' (with timezone)
YEAR        -- 2024

-- Examples
CREATE TABLE events (
  event_id INT PRIMARY KEY,
  event_name VARCHAR(100),
  event_date DATE,
  event_time TIME,
  created_at DATETIME,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`} 
          />
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">DATE</span>
              </div>
              <div className="simple">Stores date only</div>
              <div className="example">2024-12-25</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">TIME</span>
              </div>
              <div className="simple">Stores time only</div>
              <div className="example">14:30:00</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">DATETIME</span>
              </div>
              <div className="simple">Stores date and time</div>
              <div className="example">2024-12-25 14:30:00</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">TIMESTAMP</span>
              </div>
              <div className="simple">Date/time with timezone</div>
              <div className="example">Auto-updates on change</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 2: Overview Date & Time Functions */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="overview-functions">
            <span className="lecture-icon">▶️</span> Overview Date & Time Functions
          </h2>
          <div className="subtitle">Duration: 2:39</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            SQL provides numerous functions for working with dates and times. These functions 
            fall into several categories based on their purpose.
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Current Date/Time</span>
              </div>
              <div className="simple">NOW(), CURDATE(), CURTIME()</div>
              <div className="example">Get current date/time</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Extraction</span>
              </div>
              <div className="simple">YEAR(), MONTH(), DAY()</div>
              <div className="example">Extract parts of date</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Formatting</span>
              </div>
              <div className="simple">DATE_FORMAT(), STR_TO_DATE()</div>
              <div className="example">Format date display</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Calculation</span>
              </div>
              <div className="simple">DATEADD(), DATEDIFF()</div>
              <div className="example">Add/subtract dates</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Comparison</span>
              </div>
              <div className="simple">BETWEEN, &gt;, &lt;</div>
              <div className="example">Compare dates</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Conversion</span>
              </div>
              <div className="simple">CAST(), CONVERT()</div>
              <div className="example">Change data types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 3: Date & Time Scripts */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="datetime-scripts">
            <span className="lecture-icon">📄</span> Date & Time Scripts
          </h2>
          <div className="subtitle">Duration: 0:10</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Access to downloadable SQL scripts with date and time function examples for practice.
          </p>
        </div>
      </div>

      {/* Lecture 4: DAY, MONTH, YEAR */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="day-month-year">
            <span className="lecture-icon">▶️</span> DAY, MONTH, YEAR
          </h2>
          <div className="subtitle">Duration: 2:59</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Extract specific components from date values using DAY(), MONTH(), and YEAR() functions.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- YEAR function
SELECT YEAR('2024-12-25');  -- 2024
SELECT YEAR(NOW());         -- Current year

-- MONTH function
SELECT MONTH('2024-12-25');  -- 12
SELECT MONTH(NOW());         -- Current month

-- DAY function
SELECT DAY('2024-12-25');    -- 25
SELECT DAY(NOW());           -- Current day

-- Extract from table data
SELECT 
  order_id,
  order_date,
  YEAR(order_date) AS order_year,
  MONTH(order_date) AS order_month,
  DAY(order_date) AS order_day
FROM orders;

-- Group by year and month
SELECT 
  YEAR(order_date) AS year,
  MONTH(order_date) AS month,
  COUNT(*) AS order_count,
  SUM(total_amount) AS monthly_revenue
FROM orders
GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY year DESC, month DESC;

-- Filter by specific year
SELECT * FROM orders
WHERE YEAR(order_date) = 2024;

-- Filter by specific month
SELECT * FROM orders
WHERE YEAR(order_date) = 2024 AND MONTH(order_date) = 12;`} 
          />
        </div>
      </div>

      {/* Lecture 5: DATEPART */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="datepart">
            <span className="lecture-icon">▶️</span> DATEPART
          </h2>
          <div className="subtitle">Duration: 5:53</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            DATEPART extracts a specific part of a date. It's more flexible than individual 
            functions and can extract various date components.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- DATEPART syntax (SQL Server)
-- DATEPART(datepart, date)

-- Extract year
SELECT DATEPART(YEAR, '2024-12-25');     -- 2024

-- Extract month
SELECT DATEPART(MONTH, '2024-12-25');    -- 12

-- Extract day
SELECT DATEPART(DAY, '2024-12-25');      -- 25

-- Extract quarter
SELECT DATEPART(QUARTER, '2024-12-25');  -- 4

-- Extract week
SELECT DATEPART(WEEK, '2024-12-25');     -- 52

-- Extract day of week (1=Sunday, 7=Saturday)
SELECT DATEPART(WEEKDAY, '2024-12-25');  -- 4 (Wednesday)

-- Extract day of year
SELECT DATEPART(DAYOFYEAR, '2024-12-25'); -- 360

-- Extract hour, minute, second
SELECT 
  DATEPART(HOUR, '2024-12-25 14:30:45') AS hour,      -- 14
  DATEPART(MINUTE, '2024-12-25 14:30:45') AS minute,  -- 30
  DATEPART(SECOND, '2024-12-25 14:30:45') AS second;  -- 45

-- MySQL equivalent: EXTRACT
SELECT EXTRACT(YEAR FROM '2024-12-25');
SELECT EXTRACT(MONTH FROM '2024-12-25');
SELECT EXTRACT(DAY FROM '2024-12-25');
SELECT EXTRACT(QUARTER FROM '2024-12-25');`} 
          />
        </div>
      </div>

      {/* Lecture 6: DATENAME */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="datename">
            <span className="lecture-icon">▶️</span> DATENAME
          </h2>
          <div className="subtitle">Duration: 4:34</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            DATENAME returns the name of a date part as a string. Useful for getting month names, 
            day names, etc.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- DATENAME syntax (SQL Server)
-- DATENAME(datepart, date)

-- Get month name
SELECT DATENAME(MONTH, '2024-12-25');    -- 'December'

-- Get day name
SELECT DATENAME(WEEKDAY, '2024-12-25');  -- 'Wednesday'

-- Get full date information
SELECT 
  order_date,
  DATENAME(MONTH, order_date) AS month_name,
  DATENAME(WEEKDAY, order_date) AS day_name,
  DATEPART(YEAR, order_date) AS year
FROM orders;

-- MySQL equivalent: DATE_FORMAT or DAYNAME/MONTHNAME
SELECT DATE_FORMAT('2024-12-25', '%M');     -- 'December'
SELECT DATE_FORMAT('2024-12-25', '%W');     -- 'Wednesday'
SELECT MONTHNAME('2024-12-25');             -- 'December'
SELECT DAYNAME('2024-12-25');               -- 'Wednesday'

-- Create readable reports
SELECT 
  CONCAT(
    DATENAME(WEEKDAY, order_date),
    ', ',
    DATENAME(MONTH, order_date),
    ' ',
    DATEPART(DAY, order_date),
    ', ',
    DATEPART(YEAR, order_date)
  ) AS formatted_date
FROM orders;
-- Result: 'Wednesday, December 25, 2024'`} 
          />
        </div>
      </div>

      {/* Lecture 7: DATETRUNC */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="datetrunc">
            <span className="lecture-icon">▶️</span> DATETRUNC
          </h2>
          <div className="subtitle">Duration: 8:10</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            DATETRUNC truncates a date to a specified precision. Useful for grouping dates by 
            year, month, week, etc.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- DATETRUNC syntax (PostgreSQL/SQL Server 2022+)
-- DATETRUNC(datepart, date)

-- Truncate to year (first day of year)
SELECT DATETRUNC(YEAR, '2024-12-25');
-- Result: '2024-01-01'

-- Truncate to month (first day of month)
SELECT DATETRUNC(MONTH, '2024-12-25');
-- Result: '2024-12-01'

-- Truncate to week (first day of week)
SELECT DATETRUNC(WEEK, '2024-12-25');
-- Result: '2024-12-23' (Monday)

-- Truncate to day (removes time)
SELECT DATETRUNC(DAY, '2024-12-25 14:30:45');
-- Result: '2024-12-25 00:00:00'

-- Group sales by month
SELECT 
  DATETRUNC(MONTH, order_date) AS month_start,
  COUNT(*) AS order_count,
  SUM(total_amount) AS monthly_revenue
FROM orders
GROUP BY DATETRUNC(MONTH, order_date)
ORDER BY month_start;

-- MySQL alternative: DATE_FORMAT or DATE()
SELECT DATE(order_date) AS day FROM orders;
SELECT DATE_FORMAT(order_date, '%Y-%m-01') AS month_start FROM orders;`} 
          />
        </div>
      </div>

      {/* Lecture 8: EOMONTH */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="eomonth">
            <span className="lecture-icon">▶️</span> EOMONTH
          </h2>
          <div className="subtitle">Duration: 3:31</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            EOMONTH returns the last day of the month for a given date. Useful for calculating 
            month-end dates and date ranges.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- EOMONTH syntax (SQL Server)
-- EOMONTH(date, [month_offset])

-- Get last day of current month
SELECT EOMONTH('2024-12-15');
-- Result: '2024-12-31'

-- Get last day of next month
SELECT EOMONTH('2024-12-15', 1);
-- Result: '2025-01-31'

-- Get last day of previous month
SELECT EOMONTH('2024-12-15', -1);
-- Result: '2024-11-30'

-- Find orders in last month
SELECT * FROM orders
WHERE order_date BETWEEN 
  DATEADD(MONTH, -1, DATEADD(DAY, 1, EOMONTH(GETDATE(), -2)))
  AND EOMONTH(GETDATE(), -1);

-- MySQL alternative: LAST_DAY
SELECT LAST_DAY('2024-12-15');
-- Result: '2024-12-31'

-- Calculate days remaining in month
SELECT 
  order_date,
  EOMONTH(order_date) AS month_end,
  DATEDIFF(DAY, order_date, EOMONTH(order_date)) AS days_remaining
FROM orders;`} 
          />
        </div>
      </div>

      {/* Lecture 9: Use Cases: Date Extraction */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="usecase-extraction">
            <span className="lecture-icon">▶️</span> Use Cases: Date Extraction
          </h2>
          <div className="subtitle">Duration: 5:03</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Real-world examples of extracting and using date components for business analysis.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Sales by year and quarter
SELECT 
  YEAR(order_date) AS year,
  DATEPART(QUARTER, order_date) AS quarter,
  COUNT(*) AS orders,
  SUM(total_amount) AS revenue
FROM orders
GROUP BY YEAR(order_date), DATEPART(QUARTER, order_date)
ORDER BY year DESC, quarter DESC;

-- Monthly sales trend
SELECT 
  YEAR(order_date) AS year,
  MONTH(order_date) AS month,
  DATENAME(MONTH, order_date) AS month_name,
  COUNT(*) AS order_count,
  AVG(total_amount) AS avg_order_value
FROM orders
WHERE order_date >= DATEADD(YEAR, -1, GETDATE())
GROUP BY YEAR(order_date), MONTH(order_date), DATENAME(MONTH, order_date)
ORDER BY year, month;

-- Day of week analysis
SELECT 
  DATENAME(WEEKDAY, order_date) AS day_of_week,
  DATEPART(WEEKDAY, order_date) AS day_number,
  COUNT(*) AS order_count,
  AVG(total_amount) AS avg_revenue
FROM orders
GROUP BY DATENAME(WEEKDAY, order_date), DATEPART(WEEKDAY, order_date)
ORDER BY day_number;

-- Peak hours analysis
SELECT 
  DATEPART(HOUR, order_time) AS hour,
  COUNT(*) AS order_count
FROM orders
GROUP BY DATEPART(HOUR, order_time)
ORDER BY hour;`} 
          />
        </div>
      </div>

      {/* Lecture 10: Compare Extract Functions */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="compare-extract">
            <span className="lecture-icon">▶️</span> Compare Extract Functions
          </h2>
          <div className="subtitle">Duration: 3:38</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Comparison of different date extraction methods across SQL databases.
          </p>
          <div className="comparison-grid">
            <div className="comparison-col left">
              <h3>SQL Server</h3>
              <ul>
                <li>DATEPART(YEAR, date)</li>
                <li>DATENAME(MONTH, date)</li>
                <li>YEAR(date), MONTH(date)</li>
                <li>DAY(date)</li>
              </ul>
            </div>
            <div className="comparison-col right">
              <h3>MySQL</h3>
              <ul>
                <li>EXTRACT(YEAR FROM date)</li>
                <li>MONTHNAME(date)</li>
                <li>YEAR(date), MONTH(date)</li>
                <li>DAY(date)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lecture 11: Intro to Formatting & Casting */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="intro-formatting">
            <span className="lecture-icon">▶️</span> Intro to Formatting & Casting
          </h2>
          <div className="subtitle">Duration: 5:34</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Learn to format dates for display and convert between data types.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Why format dates?
-- 1. User-friendly display
-- 2. Export to reports
-- 3. Match specific formats
-- 4. Internationalization

-- Default format
SELECT order_date FROM orders;
-- Result: 2024-12-25 14:30:00

-- Formatted for display
SELECT DATE_FORMAT(order_date, '%M %d, %Y') FROM orders;
-- Result: December 25, 2024

-- Why cast/convert?
-- 1. Change data types
-- 2. String to date conversion
-- 3. Date to string conversion
-- 4. Ensure compatibility`} 
          />
        </div>
      </div>

      {/* Lecture 12: FORMAT */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="format">
            <span className="lecture-icon">▶️</span> FORMAT
          </h2>
          <div className="subtitle">Duration: 13:13</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            FORMAT function provides flexible date and number formatting with culture-specific options.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- FORMAT syntax (SQL Server)
-- FORMAT(value, format_string, [culture])

-- Common date formats
SELECT FORMAT(GETDATE(), 'yyyy-MM-dd');           -- 2024-12-25
SELECT FORMAT(GETDATE(), 'MM/dd/yyyy');           -- 12/25/2024
SELECT FORMAT(GETDATE(), 'dd-MMM-yyyy');          -- 25-Dec-2024
SELECT FORMAT(GETDATE(), 'MMMM dd, yyyy');        -- December 25, 2024
SELECT FORMAT(GETDATE(), 'dddd, MMMM dd, yyyy');  -- Wednesday, December 25, 2024

-- Time formats
SELECT FORMAT(GETDATE(), 'HH:mm:ss');             -- 14:30:45
SELECT FORMAT(GETDATE(), 'hh:mm tt');             -- 02:30 PM

-- Combined date and time
SELECT FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm:ss'); -- 2024-12-25 14:30:45

-- MySQL: DATE_FORMAT
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d');            -- 2024-12-25
SELECT DATE_FORMAT(NOW(), '%m/%d/%Y');            -- 12/25/2024
SELECT DATE_FORMAT(NOW(), '%d-%b-%Y');            -- 25-Dec-2024
SELECT DATE_FORMAT(NOW(), '%M %d, %Y');           -- December 25, 2024
SELECT DATE_FORMAT(NOW(), '%W, %M %d, %Y');       -- Wednesday, December 25, 2024
SELECT DATE_FORMAT(NOW(), '%H:%i:%s');            -- 14:30:45
SELECT DATE_FORMAT(NOW(), '%h:%i %p');            -- 02:30 PM

-- Format in queries
SELECT 
  order_id,
  FORMAT(order_date, 'MMMM dd, yyyy') AS formatted_date,
  FORMAT(total_amount, 'C', 'en-US') AS formatted_amount
FROM orders;`} 
          />
        </div>
      </div>

      {/* Lecture 13: CONVERT */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="convert">
            <span className="lecture-icon">▶️</span> CONVERT
          </h2>
          <div className="subtitle">Duration: 6:23</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            CONVERT changes data from one type to another with optional style codes for dates.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- CONVERT syntax (SQL Server)
-- CONVERT(data_type, value, [style])

-- Convert date to string
SELECT CONVERT(VARCHAR, GETDATE(), 101);  -- 12/25/2024 (mm/dd/yyyy)
SELECT CONVERT(VARCHAR, GETDATE(), 103);  -- 25/12/2024 (dd/mm/yyyy)
SELECT CONVERT(VARCHAR, GETDATE(), 105);  -- 25-12-2024 (dd-mm-yyyy)
SELECT CONVERT(VARCHAR, GETDATE(), 110);  -- 12-25-2024 (mm-dd-yyyy)
SELECT CONVERT(VARCHAR, GETDATE(), 111);  -- 2024/12/25 (yyyy/mm/dd)

-- Convert string to date
SELECT CONVERT(DATE, '2024-12-25');
SELECT CONVERT(DATE, '12/25/2024', 101);
SELECT CONVERT(DATETIME, '2024-12-25 14:30:00');

-- Common style codes
-- 101: mm/dd/yyyy
-- 103: dd/mm/yyyy
-- 105: dd-mm-yyyy
-- 110: mm-dd-yyyy
-- 111: yyyy/mm/dd
-- 112: yyyymmdd
-- 120: yyyy-mm-dd hh:mi:ss
-- 121: yyyy-mm-dd hh:mi:ss.mmm

-- MySQL: STR_TO_DATE
SELECT STR_TO_DATE('25/12/2024', '%d/%m/%Y');
SELECT STR_TO_DATE('December 25, 2024', '%M %d, %Y');`} 
          />
        </div>
      </div>

      {/* Lecture 14: CAST */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="cast">
            <span className="lecture-icon">▶️</span> CAST
          </h2>
          <div className="subtitle">Duration: 5:08</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            CAST is the ANSI standard way to convert between data types. Works across all SQL databases.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- CAST syntax
-- CAST(value AS data_type)

-- Cast string to date
SELECT CAST('2024-12-25' AS DATE);
SELECT CAST('2024-12-25 14:30:00' AS DATETIME);

-- Cast date to string
SELECT CAST(GETDATE() AS VARCHAR);
SELECT CAST(order_date AS VARCHAR(10)) FROM orders;

-- Cast to remove time portion
SELECT CAST(GETDATE() AS DATE);
-- Result: 2024-12-25 (no time)

-- Cast in WHERE clause
SELECT * FROM orders
WHERE CAST(order_date AS DATE) = '2024-12-25';

-- Cast for comparisons
SELECT * FROM orders
WHERE CAST(order_date AS DATE) >= CAST(GETDATE() AS DATE);

-- CAST vs CONVERT
-- CAST: ANSI standard, works everywhere
-- CONVERT: SQL Server specific, more formatting options`} 
          />
        </div>
      </div>

      {/* Lecture 15: DATEADD */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="dateadd">
            <span className="lecture-icon">▶️</span> DATEADD
          </h2>
          <div className="subtitle">Duration: 4:43</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            DATEADD adds or subtracts a time interval from a date. Essential for calculating 
            future or past dates.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- DATEADD syntax (SQL Server)
-- DATEADD(datepart, number, date)

-- Add days
SELECT DATEADD(DAY, 7, '2024-12-25');
-- Result: 2025-01-01

-- Add months
SELECT DATEADD(MONTH, 3, '2024-12-25');
-- Result: 2025-03-25

-- Add years
SELECT DATEADD(YEAR, 1, '2024-12-25');
-- Result: 2025-12-25

-- Subtract (use negative numbers)
SELECT DATEADD(DAY, -7, '2024-12-25');
-- Result: 2024-12-18

-- Add hours, minutes, seconds
SELECT DATEADD(HOUR, 2, GETDATE());
SELECT DATEADD(MINUTE, 30, GETDATE());
SELECT DATEADD(SECOND, 45, GETDATE());

-- Calculate due dates
SELECT 
  order_id,
  order_date,
  DATEADD(DAY, 30, order_date) AS payment_due_date,
  DATEADD(DAY, 7, order_date) AS shipping_date
FROM orders;

-- MySQL: DATE_ADD, DATE_SUB
SELECT DATE_ADD('2024-12-25', INTERVAL 7 DAY);
SELECT DATE_ADD('2024-12-25', INTERVAL 3 MONTH);
SELECT DATE_SUB('2024-12-25', INTERVAL 7 DAY);

-- Find records from last 30 days
SELECT * FROM orders
WHERE order_date >= DATEADD(DAY, -30, GETDATE());`} 
          />
        </div>
      </div>

      {/* Lecture 16: DATEDIFF */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="datediff">
            <span className="lecture-icon">▶️</span> DATEDIFF
          </h2>
          <div className="subtitle">Duration: 10:04</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            DATEDIFF calculates the difference between two dates. Perfect for calculating age, 
            tenure, days until deadline, etc.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- DATEDIFF syntax (SQL Server)
-- DATEDIFF(datepart, start_date, end_date)

-- Days between dates
SELECT DATEDIFF(DAY, '2024-12-01', '2024-12-25');
-- Result: 24

-- Months between dates
SELECT DATEDIFF(MONTH, '2024-01-01', '2024-12-25');
-- Result: 11

-- Years between dates
SELECT DATEDIFF(YEAR, '2020-01-01', '2024-12-25');
-- Result: 4

-- Calculate age
SELECT 
  employee_name,
  birth_date,
  DATEDIFF(YEAR, birth_date, GETDATE()) AS age
FROM employees;

-- Calculate tenure
SELECT 
  employee_name,
  hire_date,
  DATEDIFF(YEAR, hire_date, GETDATE()) AS years_employed,
  DATEDIFF(MONTH, hire_date, GETDATE()) AS months_employed,
  DATEDIFF(DAY, hire_date, GETDATE()) AS days_employed
FROM employees;

-- Days until deadline
SELECT 
  project_name,
  deadline,
  DATEDIFF(DAY, GETDATE(), deadline) AS days_remaining
FROM projects
WHERE deadline >= GETDATE();

-- Order processing time
SELECT 
  order_id,
  order_date,
  ship_date,
  DATEDIFF(DAY, order_date, ship_date) AS processing_days
FROM orders
WHERE ship_date IS NOT NULL;

-- MySQL: DATEDIFF (only returns days)
SELECT DATEDIFF('2024-12-25', '2024-12-01');
-- Result: 24

-- For months/years in MySQL, use TIMESTAMPDIFF
SELECT TIMESTAMPDIFF(MONTH, '2024-01-01', '2024-12-25');
SELECT TIMESTAMPDIFF(YEAR, '2020-01-01', '2024-12-25');`} 
          />
        </div>
      </div>

      {/* Lecture 17: ISDATE */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="isdate">
            <span className="lecture-icon">▶️</span> ISDATE
          </h2>
          <div className="subtitle">Duration: 7:24</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            ISDATE checks if a value is a valid date. Useful for data validation and cleaning.
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- ISDATE syntax (SQL Server)
-- ISDATE(expression)
-- Returns 1 if valid date, 0 if not

-- Valid dates
SELECT ISDATE('2024-12-25');           -- 1
SELECT ISDATE('12/25/2024');           -- 1
SELECT ISDATE('December 25, 2024');    -- 1

-- Invalid dates
SELECT ISDATE('2024-13-01');           -- 0 (invalid month)
SELECT ISDATE('2024-02-30');           -- 0 (invalid day)
SELECT ISDATE('not a date');           -- 0
SELECT ISDATE('');                     -- 0

-- Validate data before conversion
SELECT 
  date_string,
  CASE 
    WHEN ISDATE(date_string) = 1 
    THEN CAST(date_string AS DATE)
    ELSE NULL
  END AS converted_date
FROM imported_data;

-- Find invalid dates in table
SELECT * FROM orders
WHERE ISDATE(order_date_string) = 0;

-- Clean data
UPDATE orders
SET order_date = CAST(order_date_string AS DATE)
WHERE ISDATE(order_date_string) = 1;

-- MySQL alternative: STR_TO_DATE with error handling
SELECT 
  date_string,
  CASE 
    WHEN date_string REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    THEN STR_TO_DATE(date_string, '%Y-%m-%d')
    ELSE NULL
  END AS converted_date
FROM imported_data;`} 
          />
        </div>
      </div>

      {/* Lecture 18: Date & Time Summary */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="datetime-summary">
            <span className="lecture-icon">▶️</span> Date & Time Summary
          </h2>
          <div className="subtitle">Duration: 1:07</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Quick reference summary of all date and time functions covered.
          </p>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Current Date/Time</span>
              </div>
              <div className="simple">NOW(), GETDATE(), CURDATE()</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Extract Parts</span>
              </div>
              <div className="simple">YEAR(), MONTH(), DAY(), DATEPART()</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Format</span>
              </div>
              <div className="simple">FORMAT(), DATE_FORMAT()</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Convert</span>
              </div>
              <div className="simple">CAST(), CONVERT()</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Calculate</span>
              </div>
              <div className="simple">DATEADD(), DATEDIFF()</div>
            </div>
            <div className="concept-card">
              <div className="term-header">
                <span className="term-name">Validate</span>
              </div>
              <div className="simple">ISDATE()</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="quiz">
            <span className="lecture-icon">📝</span> Quiz | Date & Time Functions
          </h2>
          <div className="subtitle">Test your knowledge</div>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Test your understanding of Date & Time Functions. This quiz covers extraction, 
            formatting, conversion, and calculation functions.
          </p>
          <div style={{ 
            padding: '20px', 
            background: 'var(--card-bg)', 
            borderRadius: '8px',
            border: '2px solid var(--accent)',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 Ready to test your date & time skills? Complete the quiz!
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Example */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="comprehensive-example">Comprehensive Date & Time Example</h2>
        </div>
        <div className="doc-card-body">
          <p className="prose">
            Here's a complex example combining multiple date and time functions:
          </p>
          <CodeBlock 
            language="sql" 
            code={`-- Employee analytics with date functions
SELECT 
  employee_id,
  employee_name,
  birth_date,
  hire_date,
  
  -- Age calculation
  DATEDIFF(YEAR, birth_date, GETDATE()) AS age,
  
  -- Tenure calculation
  DATEDIFF(YEAR, hire_date, GETDATE()) AS years_employed,
  DATEDIFF(MONTH, hire_date, GETDATE()) % 12 AS additional_months,
  
  -- Formatted dates
  FORMAT(birth_date, 'MMMM dd, yyyy') AS formatted_birth_date,
  FORMAT(hire_date, 'MMM dd, yyyy') AS formatted_hire_date,
  
  -- Extract components
  YEAR(hire_date) AS hire_year,
  DATENAME(MONTH, hire_date) AS hire_month,
  DATENAME(WEEKDAY, hire_date) AS hire_day_of_week,
  
  -- Calculate anniversary
  DATEADD(YEAR, 
    DATEDIFF(YEAR, hire_date, GETDATE()) + 1, 
    hire_date
  ) AS next_anniversary,
  
  -- Days until anniversary
  DATEDIFF(DAY, 
    GETDATE(),
    DATEADD(YEAR, 
      DATEDIFF(YEAR, hire_date, GETDATE()) + 1, 
      hire_date
    )
  ) AS days_to_anniversary,
  
  -- Retirement date (age 65)
  DATEADD(YEAR, 65, birth_date) AS retirement_date,
  
  -- Years until retirement
  DATEDIFF(YEAR, GETDATE(), DATEADD(YEAR, 65, birth_date)) AS years_to_retirement,
  
  -- Quarter hired
  DATEPART(QUARTER, hire_date) AS hire_quarter,
  
  -- Categorize by tenure
  CASE 
    WHEN DATEDIFF(YEAR, hire_date, GETDATE()) < 1 THEN 'New'
    WHEN DATEDIFF(YEAR, hire_date, GETDATE()) < 5 THEN 'Mid-Level'
    WHEN DATEDIFF(YEAR, hire_date, GETDATE()) < 10 THEN 'Senior'
    ELSE 'Veteran'
  END AS tenure_category
  
FROM employees
WHERE hire_date IS NOT NULL
ORDER BY years_employed DESC;`} 
          />
        </div>
      </div>

      {/* Best Practices */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="best-practices">Date & Time Best Practices</h2>
        </div>
        <div className="doc-card-body">
          <ul className="prose">
            <li><strong>Use appropriate data types:</strong> DATE for dates, DATETIME for timestamps</li>
            <li><strong>Store in UTC:</strong> Convert to local time only for display</li>
            <li><strong>Validate before converting:</strong> Use ISDATE() or try-catch</li>
            <li><strong>Be careful with time zones:</strong> TIMESTAMP vs DATETIME</li>
            <li><strong>Use CAST for portability:</strong> Works across all databases</li>
            <li><strong>Index date columns:</strong> Improves query performance</li>
            <li><strong>Avoid functions in WHERE:</strong> Can prevent index usage</li>
            <li><strong>Consider leap years:</strong> When calculating date differences</li>
            <li><strong>Test edge cases:</strong> Month-end dates, February 29, etc.</li>
            <li><strong>Document date formats:</strong> Especially for international applications</li>
          </ul>
        </div>
      </div>

      {/* Common Patterns */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 id="common-patterns">Common Date & Time Patterns</h2>
        </div>
        <div className="doc-card-body">
          <CodeBlock 
            language="sql" 
            code={`-- Get first day of current month
SELECT DATEADD(DAY, 1-DAY(GETDATE()), CAST(GETDATE() AS DATE));

-- Get last day of current month
SELECT EOMONTH(GETDATE());

-- Get first day of current year
SELECT DATEFROMPARTS(YEAR(GETDATE()), 1, 1);

-- Get records from today
SELECT * FROM orders
WHERE CAST(order_date AS DATE) = CAST(GETDATE() AS DATE);

-- Get records from this week
SELECT * FROM orders
WHERE order_date >= DATEADD(DAY, 1-DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE))
  AND order_date < DATEADD(DAY, 8-DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE));

-- Get records from this month
SELECT * FROM orders
WHERE YEAR(order_date) = YEAR(GETDATE())
  AND MONTH(order_date) = MONTH(GETDATE());

-- Get records from last 7 days
SELECT * FROM orders
WHERE order_date >= DATEADD(DAY, -7, GETDATE());

-- Get records from same day last year
SELECT * FROM orders
WHERE CAST(order_date AS DATE) = DATEADD(YEAR, -1, CAST(GETDATE() AS DATE));`} 
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
            Excellent work! You've mastered date and time manipulation in SQL. Next, you'll 
            learn about NULL Functions to handle missing data effectively.
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
              onClick={() => onNavigate?.('null-functions' as SubsectionId)}
            >
              Continue to NULL Functions →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DateTimeFunctionsPage;
