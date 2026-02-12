# 🚀 SQLTown Database Setup Guide

## Quick Start

### 1. Prerequisites
```bash
# Install PostgreSQL 15+
brew install postgresql@15  # macOS
# or
sudo apt-get install postgresql-15  # Ubuntu

# Install Redis for caching
brew install redis  # macOS
# or
sudo apt-get install redis  # Ubuntu
```

### 2. Create Database
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
# or
sudo systemctl start postgresql  # Ubuntu

# Create database
psql postgres
CREATE DATABASE sqltown;
CREATE USER sqltown_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE sqltown TO sqltown_user;
\q
```

### 3. Load Schema
```bash
# Navigate to project directory
cd /Applications/XAMPP/xamppfiles/htdocs/sqltown

# Load the schema
psql -U sqltown_user -d sqltown -f database_schema.sql

# Verify tables created
psql -U sqltown_user -d sqltown -c "\dt"
```

### 4. Environment Configuration
Create `.env` file in `server/` directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sqltown
DB_USER=sqltown_user
DB_PASSWORD=your_secure_password
DB_POOL_MIN=20
DB_POOL_MAX=100

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# File Upload
MAX_FILE_SIZE_MB=5
UPLOAD_DIR=./uploads
AWS_S3_BUCKET=sqltown-uploads
AWS_REGION=us-east-1

# Email (SendGrid/Mailgun)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=noreply@sqltown.com

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Payment (Razorpay for India)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
NEW_RELIC_LICENSE_KEY=...

# SQL Execution Sandbox
DOCKER_ENABLED=true
SQL_TIMEOUT_SECONDS=5
SQL_MAX_MEMORY_MB=256
```

---

## 📦 Seed Data

Create `seed_data.sql`:

```sql
-- ============================================
-- SEED DATA FOR DEVELOPMENT
-- ============================================

-- 1. SQL Dialects
INSERT INTO sql_dialects (dialect_name, display_name, description, is_active, sort_order) VALUES
('mysql', 'MySQL', 'Most popular open-source relational database', true, 1),
('postgresql', 'PostgreSQL', 'Advanced open-source relational database', true, 2),
('sqlite', 'SQLite', 'Lightweight embedded database', true, 3),
('oracle', 'Oracle Database', 'Enterprise-grade relational database', true, 4),
('mssql', 'Microsoft SQL Server', 'Microsoft enterprise database', true, 5);

-- 2. SQL Versions
INSERT INTO sql_versions (dialect_id, version_number, display_name, is_default, is_active) VALUES
(1, '8.0', 'MySQL 8.0', true, true),
(1, '5.7', 'MySQL 5.7', false, true),
(2, '15', 'PostgreSQL 15', true, true),
(2, '14', 'PostgreSQL 14', false, true),
(3, '3.40', 'SQLite 3.40', true, true);

-- 3. Subscription Plans
INSERT INTO subscription_plans (plan_name, display_name, description, price_usd, price_inr, billing_cycle, features, max_dialects, is_active) VALUES
('free', 'Free Explorer', 'Perfect for beginners', 0.00, 0.00, 'monthly', '["1 SQL dialect", "10 lessons", "Community support"]'::json, 1, true),
('pro', 'Pro Builder', 'Serious learners', 9.99, 799.00, 'monthly', '["All SQL dialects", "Unlimited lessons", "Priority support", "Certificates"]'::json, 999, true),
('lifetime', 'Lifetime Access', 'One-time payment', 199.99, 14999.00, 'lifetime', '["Everything in Pro", "Lifetime updates", "Early access"]'::json, 999, true);

-- 4. Building Types
INSERT INTO building_types (building_name, display_name, description, category, unlock_level, base_cost_coins, base_population) VALUES
('dharamshala', 'Dharamshala', 'Guest houses for pilgrims', 'residential', 1, 0, 2),
('temples', 'Temple', 'Sacred places of worship', 'religious', 2, 100, 0),
('ashrams', 'Ashram', 'Spiritual retreats', 'religious', 3, 200, 5),
('pilgrims', 'Pilgrim House', 'Small dwelling', 'residential', 1, 50, 1);

-- 5. Learning Path
INSERT INTO learning_paths (path_name, display_title, description, difficulty_level, estimated_hours, is_published) VALUES
('sql-basics', 'SQL Fundamentals', 'Start your SQL journey', 'beginner', 10, true),
('sql-intermediate', 'Intermediate SQL', 'Level up your skills', 'intermediate', 15, true),
('sql-advanced', 'Advanced SQL', 'Master complex queries', 'advanced', 20, true);

-- 6. Chapters
INSERT INTO chapters (path_id, chapter_number, chapter_title, description, estimated_minutes, is_published) VALUES
(1, 1, 'Introduction to Databases', 'Understanding databases and SQL', 60, true),
(1, 2, 'Basic SELECT Queries', 'Retrieving data from tables', 90, true),
(1, 3, 'Filtering Data', 'Using WHERE clauses', 120, true),
(1, 4, 'Sorting and Limiting', 'ORDER BY and LIMIT', 90, true);

-- 7. Lessons
INSERT INTO lessons (chapter_id, lesson_number, lesson_title, lesson_type, description, estimated_minutes, xp_reward, coins_reward, is_published) VALUES
(1, 1, 'What is a Database?', 'tutorial', 'Introduction to databases', 15, 10, 5, true),
(1, 2, 'Understanding Tables', 'tutorial', 'Tables, rows, and columns', 20, 15, 10, true),
(2, 1, 'Your First SELECT', 'challenge', 'Write your first query', 30, 25, 15, true),
(2, 2, 'Selecting Specific Columns', 'challenge', 'Choose what to retrieve', 25, 20, 10, true);

-- 8. Code Examples (MySQL)
INSERT INTO code_examples (lesson_id, dialect_id, example_title, sql_code, explanation, sort_order) VALUES
(3, 1, 'Basic SELECT', 'SELECT * FROM dharamshala;', 'Retrieve all rows from dharamshala table', 1),
(3, 1, 'Select Columns', 'SELECT name FROM dharamshala;', 'Get only the name column', 2),
(4, 1, 'Specific Columns', 'SELECT id, name FROM dharamshala WHERE id = 1;', 'Get specific pilgrim details', 1);

-- 9. Code Examples (PostgreSQL) - same lessons, different syntax if needed
INSERT INTO code_examples (lesson_id, dialect_id, example_title, sql_code, explanation, sort_order) VALUES
(3, 2, 'Basic SELECT', 'SELECT * FROM dharamshala;', 'Retrieve all rows from dharamshala table', 1),
(3, 2, 'Select Columns', 'SELECT name FROM dharamshala;', 'Get only the name column', 2),
(4, 2, 'Specific Columns', 'SELECT id, name FROM dharamshala WHERE id = 1;', 'Get specific pilgrim details', 1);

-- 10. Achievements
INSERT INTO user_achievements (achievement_name, display_title, description, rarity, xp_reward) VALUES
('first_select', 'First Query', 'Execute your first SELECT query', 'common', 10),
('city_builder', 'City Builder', 'Build your first city', 'common', 25),
('hundred_lessons', 'Century', 'Complete 100 lessons', 'rare', 500),
('sql_master', 'SQL Master', 'Complete all advanced lessons', 'legendary', 1000);

-- 11. Test Users (password: Test@123)
INSERT INTO users (username, email, password_hash, full_name, email_verified, created_at) VALUES
('testuser1', 'test1@sqltown.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewM3GyRXwMnE8Zm6', 'Test User 1', true, CURRENT_TIMESTAMP),
('testuser2', 'test2@sqltown.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewM3GyRXwMnE8Zm6', 'Test User 2', true, CURRENT_TIMESTAMP);

-- 12. Test User Cities
INSERT INTO cities (user_id, dialect_id, city_name, city_level, total_xp, total_coins, is_public) VALUES
(1, 1, 'Vrindavan', 5, 500, 250, true),
(1, 2, 'Mathura', 3, 150, 100, true),
(2, 1, 'Ayodhya', 2, 75, 50, true);

-- 13. Documentation Categories
INSERT INTO documentation_categories (category_name, description, icon, sort_order) VALUES
('sql-basics', 'SQL Fundamentals', 'book', 1),
('data-types', 'SQL Data Types', 'type', 2),
('functions', 'SQL Functions', 'function', 3),
('best-practices', 'Best Practices', 'star', 4);

-- 14. Leaderboards
INSERT INTO leaderboards (leaderboard_type, dialect_id, time_period, is_active) VALUES
('global_xp', NULL, 'all_time', true),
('global_xp', NULL, 'weekly', true),
('dialect_xp', 1, 'all_time', true),
('dialect_xp', 2, 'all_time', true);
```

Load seed data:
```bash
psql -U sqltown_user -d sqltown -f seed_data.sql
```

---

## 🧪 Testing the Setup

### 1. Verify Data
```sql
-- Connect to database
psql -U sqltown_user -d sqltown

-- Check SQL dialects
SELECT * FROM sql_dialects;

-- Check lessons
SELECT l.lesson_title, c.chapter_title, lp.path_name 
FROM lessons l
JOIN chapters c ON l.chapter_id = c.chapter_id
JOIN learning_paths lp ON c.path_id = lp.path_id;

-- Check test users
SELECT username, email, created_at FROM users;

-- Check cities
SELECT u.username, c.city_name, sd.display_name as dialect, c.city_level, c.total_xp
FROM cities c
JOIN users u ON c.user_id = u.user_id
JOIN sql_dialects sd ON c.dialect_id = sd.dialect_id;
```

### 2. Test API Endpoints

Create `test_api.sh`:
```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "🧪 Testing SQLTown API..."

# Test user registration
echo "\n1. Register new user"
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@test.com",
    "password": "Test@123",
    "full_name": "New User"
  }'

# Test login
echo "\n\n2. Login"
TOKEN=$(curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@sqltown.com",
    "password": "Test@123"
  }' | jq -r '.token')

echo "Token: $TOKEN"

# Test get dialects
echo "\n\n3. Get SQL dialects"
curl -X GET $BASE_URL/dialects \
  -H "Authorization: Bearer $TOKEN"

# Test get lessons
echo "\n\n4. Get lessons"
curl -X GET $BASE_URL/lessons?path_id=1 \
  -H "Authorization: Bearer $TOKEN"

# Test user progress
echo "\n\n5. Get user progress"
curl -X GET $BASE_URL/progress \
  -H "Authorization: Bearer $TOKEN"

# Test leaderboard
echo "\n\n6. Get leaderboard"
curl -X GET $BASE_URL/leaderboard/global_xp \
  -H "Authorization: Bearer $TOKEN"

echo "\n\n✅ API tests complete!"
```

Run tests:
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 📊 Performance Testing

### 1. Install k6 (Load Testing Tool)
```bash
brew install k6  # macOS
# or
sudo apt-get install k6  # Ubuntu
```

### 2. Create Load Test Script

Create `load_test.js`:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 1000 },  // Ramp up to 1000 users
    { duration: '5m', target: 1000 },  // Stay at 1000 users
    { duration: '2m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],    // Error rate must be below 1%
  },
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
  // Login
  let loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'test1@sqltown.com',
    password: 'Test@123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  let token = JSON.parse(loginRes.body).token;

  // Get lessons
  let lessonsRes = http.get(`${BASE_URL}/lessons?path_id=1`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(lessonsRes, {
    'lessons retrieved': (r) => r.status === 200,
  });

  // Get progress
  let progressRes = http.get(`${BASE_URL}/progress`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(progressRes, {
    'progress retrieved': (r) => r.status === 200,
  });

  sleep(1);
}
```

Run load test:
```bash
k6 run load_test.js
```

---

## 🔧 Backend Setup (Node.js/Express)

### 1. Initialize Backend
```bash
cd server
npm init -y

# Install dependencies
npm install express pg redis dotenv bcrypt jsonwebtoken cors helmet express-rate-limit

# Install dev dependencies
npm install -D nodemon jest supertest
```

### 2. Database Connection

Create `server/db/connection.js`:
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min: parseInt(process.env.DB_POOL_MIN) || 20,
  max: parseInt(process.env.DB_POOL_MAX) || 100,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

module.exports = pool;
```

### 3. Redis Connection

Create `server/db/redis.js`:
```javascript
const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis cache');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

module.exports = redisClient;
```

---

## 📈 Monitoring Setup

### 1. Health Check Endpoint

Create `server/routes/health.js`:
```javascript
const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const redisClient = require('../db/redis');

router.get('/health', async (req, res) => {
  try {
    // Check database
    const dbCheck = await pool.query('SELECT NOW()');
    
    // Check Redis
    const redisCheck = await new Promise((resolve, reject) => {
      redisClient.ping((err, result) => {
        if (err) reject(err);
        else resolve(result === 'PONG');
      });
    });

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbCheck.rows ? 'connected' : 'disconnected',
        redis: redisCheck ? 'connected' : 'disconnected',
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

module.exports = router;
```

---

## 🚀 Deployment Checklist

### Before Going Live:

- [ ] Run all migrations
- [ ] Load production data
- [ ] Set up SSL certificates
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure monitoring (New Relic/Datadog)
- [ ] Set up error tracking (Sentry)
- [ ] Configure CDN for static assets
- [ ] Set up log aggregation (ELK Stack)
- [ ] Test disaster recovery procedures
- [ ] Run load tests (10K concurrent users)
- [ ] Security audit (SQL injection, XSS, CSRF)
- [ ] Set up CI/CD pipeline
- [ ] Configure auto-scaling rules
- [ ] Set up status page (status.sqltown.com)

---

## 📞 Support

**Database Issues:** Check logs at `/var/log/postgresql/`
**Cache Issues:** `redis-cli INFO` to check Redis status
**Performance:** Use `EXPLAIN ANALYZE` on slow queries

**Common Issues:**

```sql
-- Too many connections?
SELECT count(*) FROM pg_stat_activity;
-- Kill idle connections
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';

-- Slow queries?
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Table bloat?
VACUUM ANALYZE;
```

---

**Setup Complete! 🎉**

Next: Start building the API endpoints and frontend!
