# SQLTown - System Architecture & Scalability Guide

## 🎯 System Overview

SQLTown is a multi-dialect SQL learning platform that gamifies database education through city-building mechanics. The system is designed to handle **100,000+ users** with **10,000+ concurrent users**.

---

## 📊 Database Architecture Summary

### Total Tables: **50+**
### Main Categories:

```
┌─────────────────────────────────────────────────────────────┐
│                   SQLTOWN DATABASE STRUCTURE                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. USER MANAGEMENT (5 tables)                               │
│     └─ users, user_profiles, user_sessions, etc.            │
│                                                               │
│  2. SQL DIALECTS & VERSIONS (3 tables)                       │
│     └─ mysql, postgresql, sqlite, oracle, mssql, mariadb    │
│                                                               │
│  3. LEARNING CONTENT (6 tables)                              │
│     └─ paths → chapters → lessons → content                 │
│                                                               │
│  4. MULTI-DIALECT SUPPORT (2 tables)                         │
│     └─ Same lesson, different SQL syntax per dialect         │
│                                                               │
│  5. DOCUMENTATION SYSTEM (4 tables)                          │
│     └─ Categories, topics, search history                    │
│                                                               │
│  6. GAME MECHANICS (8 tables)                                │
│     └─ Cities, buildings, quests, achievements               │
│                                                               │
│  7. PROGRESS TRACKING (4 tables)                             │
│     └─ Lesson progress, submissions, achievements            │
│                                                               │
│  8. SOCIAL & LEADERBOARDS (6 tables)                         │
│     └─ Followers, city sharing, comments, rankings           │
│                                                               │
│  9. SUBSCRIPTION & PAYMENTS (3 tables)                       │
│     └─ Plans, subscriptions, transactions                    │
│                                                               │
│  10. ANALYTICS & MONITORING (4 tables)                       │
│     └─ Activity logs, errors, performance metrics            │
│                                                               │
│  11. NOTIFICATIONS (3 tables)                                │
│     └─ In-app, email, push notifications                     │
│                                                               │
│  12. ADMIN & MODERATION (2 tables)                           │
│     └─ Admin users, content reports                          │
│                                                               │
│  13. RECRUITMENT (1 table)                                   │
│     └─ Resume uploads, job applications                      │
│                                                               │
│  14. WAITLIST (1 table)                                      │
│     └─ Early access management                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Design Decisions

### 1. **Multi-Dialect Architecture**

Instead of separate databases for each SQL flavor, we use a **unified schema** with dialect-specific content:

```
Lesson: "Introduction to SELECT"
├─ MySQL Content
│  └─ SELECT * FROM users;
├─ PostgreSQL Content
│  └─ SELECT * FROM users;
└─ SQLite Content
   └─ SELECT * FROM users;
```

**Benefits:**
- Single codebase
- Shared progress tracking
- Easy to add new dialects
- Users can switch dialects seamlessly

### 2. **Game-First Data Model**

Traditional learning platforms: `user → course → lesson`
SQLTown: `user → city → building → quest → lesson`

**Why?** Emotional investment. Users don't just "complete lessons"—they **build their sacred city**.

### 3. **Horizontal Scalability**

```
┌──────────────────────────────────────────────────────────┐
│                    LOAD BALANCER                          │
└────────────────────┬─────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
    ┌─────────┐           ┌─────────┐
    │  App     │           │  App    │
    │  Server  │           │  Server │
    │  Node 1  │           │  Node 2 │
    └────┬────┘           └────┬────┘
         │                      │
         └───────┬──────────────┘
                 ▼
    ┌────────────────────────┐
    │   Master Database      │
    │   (Writes)             │
    └────────┬───────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌─────────┐   ┌─────────┐
│ Read     │   │ Read    │
│ Replica  │   │ Replica │
│ 1        │   │ 2       │
└─────────┘   └─────────┘
```

---

## 🚀 Scalability Strategy

### For 100,000 Users & 10,000 Concurrent Users

#### **1. Database Layer**

| Component | Configuration | Purpose |
|-----------|---------------|---------|
| **Master DB** | 8 vCPU, 32GB RAM | All writes (submissions, progress) |
| **Read Replica 1** | 4 vCPU, 16GB RAM | Lesson content, documentation |
| **Read Replica 2** | 4 vCPU, 16GB RAM | Leaderboards, analytics |
| **Connection Pool** | Min: 20, Max: 100 | Reuse connections |
| **Buffer Pool** | 70% of RAM | In-memory caching |

#### **2. Caching Strategy**

```javascript
// Example caching hierarchy
1. Browser Cache (Static assets) → 24 hours
2. CDN (Images, videos) → 7 days
3. Redis (User sessions) → 30 minutes
4. Memcached (Query results) → 5 minutes
5. Database (Source of truth) → Permanent
```

**What to Cache:**
- ✅ Lesson content (rarely changes)
- ✅ Documentation pages (static)
- ✅ Leaderboards (updated every 5 min)
- ✅ User progress (invalidate on update)
- ❌ Live submissions (need real-time)
- ❌ Payment transactions (critical data)

#### **3. Database Partitioning**

```sql
-- Partition logs by month for performance
CREATE TABLE user_activity_logs (
    log_id BIGSERIAL,
    user_id BIGINT,
    activity_type VARCHAR(50),
    created_at TIMESTAMP
) PARTITION BY RANGE (YEAR(created_at));

-- January 2026 partition
CREATE TABLE user_activity_logs_2026_01 
PARTITION OF user_activity_logs
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- February 2026 partition
CREATE TABLE user_activity_logs_2026_02 
PARTITION OF user_activity_logs
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

**Benefits:**
- Faster queries (scan only relevant partition)
- Easy archiving (drop old partitions)
- Better index performance

#### **4. Indexing Strategy**

```sql
-- BAD: Full table scan
SELECT * FROM user_progress WHERE user_id = 12345;
Execution: 2000ms (scanning 1M rows)

-- GOOD: Index lookup
CREATE INDEX idx_user_progress ON user_progress(user_id);
Execution: 5ms (direct lookup)

-- BEST: Composite index for common query
CREATE INDEX idx_user_progress_tracking 
ON user_progress(user_id, dialect_id, status, last_activity_at);
Execution: 2ms (covering index)
```

#### **5. Query Optimization**

**Before (Slow):**
```sql
-- N+1 Query Problem
SELECT * FROM lessons;
-- Then for each lesson:
SELECT * FROM code_examples WHERE lesson_id = ?;
-- 100 queries for 100 lessons!
```

**After (Fast):**
```sql
-- Single JOIN query
SELECT l.*, ce.sql_code, ce.dialect_id
FROM lessons l
LEFT JOIN code_examples ce ON l.lesson_id = ce.lesson_id
WHERE l.is_published = TRUE;
-- 1 query total!
```

---

## 📈 Load Testing Targets

### Expected Load (10K Concurrent Users)

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Page Load Time | < 500ms | < 2s |
| API Response Time | < 200ms | < 1s |
| Query Execution | < 100ms | < 500ms |
| Database Connections | 50-100 | < 200 |
| CPU Usage | < 60% | < 85% |
| Memory Usage | < 70% | < 90% |
| Error Rate | < 0.1% | < 1% |

### Traffic Patterns

```
Peak Hours: 7-10 PM IST (Indian users studying after work)
Off-Peak: 2-6 AM IST

Daily Pattern:
     │ 10K ┐              ┌─────┐
Load │     │              │     │
     │     │         ┌────┘     └────┐
     │     └────┬────┘                └─┬
     └──────────┴────────────────────────┴─→ Time
           6AM  12PM  6PM  12AM  6AM
```

---

## 🛡️ Data Protection & Backup

### Backup Strategy

```
┌─────────────────────────────────────┐
│ BACKUP SCHEDULE                      │
├─────────────────────────────────────┤
│                                      │
│ Daily Full Backup                    │
│ ├─ Time: 2:00 AM IST                │
│ ├─ Retention: 30 days               │
│ └─ Storage: AWS S3 (encrypted)      │
│                                      │
│ Hourly Incremental                   │
│ ├─ Time: Every hour                 │
│ ├─ Retention: 7 days                │
│ └─ Storage: Local + S3              │
│                                      │
│ Real-time Replication                │
│ ├─ Master → Replica (sync)          │
│ ├─ RPO: < 1 second                  │
│ └─ RTO: < 5 minutes                 │
│                                      │
└─────────────────────────────────────┘

RPO = Recovery Point Objective (max data loss)
RTO = Recovery Time Objective (max downtime)
```

### Security Measures

1. **Encryption**
   - At rest: AES-256
   - In transit: TLS 1.3
   - Passwords: bcrypt (cost factor: 12)

2. **Access Control**
   - Role-based access (RBAC)
   - Least privilege principle
   - Regular audit logs

3. **SQL Injection Prevention**
   - Prepared statements only
   - Input validation
   - Parameterized queries

---

## 🎮 Game Mechanics Data Flow

### Example: User Completes Lesson

```
1. User submits SQL query
   ↓
2. Validate syntax (backend)
   ↓
3. Execute in sandboxed environment
   ↓
4. Store submission in user_sql_submissions
   ↓
5. Update user_progress (status = 'completed')
   ↓
6. Trigger: sp_complete_lesson()
   ├─ Award XP (cities.total_xp +50)
   ├─ Award coins (cities.total_coins +10)
   └─ Check level up (recalculate city_level)
   ↓
7. Check achievements
   ├─ "First SELECT" unlocked?
   └─ Insert into user_unlocked_achievements
   ↓
8. Update leaderboards
   ├─ Recalculate rank
   └─ Update leaderboard_entries
   ↓
9. Send notification
   ├─ "You earned 50 XP!"
   └─ Insert into user_notifications
   ↓
10. Return to frontend
    └─ Show animation (building appears in city)
```

### City Building Example

```sql
-- User wants to build a temple
BEGIN TRANSACTION;

-- Check if user has enough coins
SELECT total_coins FROM cities WHERE city_id = 123;
-- Result: 500 coins

-- Get building cost
SELECT base_cost_coins FROM building_types WHERE building_name = 'temples';
-- Cost: 100 coins

-- Deduct coins
UPDATE cities SET total_coins = total_coins - 100 WHERE city_id = 123;

-- Add building
INSERT INTO city_buildings (city_id, building_type_id, position_x, position_y)
VALUES (123, 2, 5, 3);

-- Update population
UPDATE cities SET population = population + 0 WHERE city_id = 123;

COMMIT;
```

---

## 🌐 Multi-Dialect Content Management

### How It Works

```javascript
// Frontend: User selects dialect
const userDialect = "postgresql"; // or "mysql", "sqlite"

// Fetch lesson with dialect-specific content
fetch(`/api/lessons/101?dialect=${userDialect}`)
  .then(response => response.json())
  .then(lesson => {
    // Lesson structure:
    {
      lesson_id: 101,
      lesson_title: "Your First SELECT Query",
      common_content: "Learn to retrieve data from tables...",
      code_examples: [
        {
          dialect: "postgresql",
          sql_code: "SELECT * FROM dharamshala;",
          explanation: "PostgreSQL-specific notes..."
        }
      ],
      animation_config: {
        building: "dharamshala",
        action: "highlight_windows"
      }
    }
  });
```

### Database Query

```sql
-- Get lesson with dialect-specific content
SELECT 
    l.lesson_id,
    l.lesson_title,
    l.lesson_type,
    lc.content_text as common_content,
    ce.sql_code as dialect_code,
    ce.explanation as dialect_notes,
    ce.animation_config
FROM lessons l
LEFT JOIN lesson_contents lc 
    ON l.lesson_id = lc.lesson_id 
    AND lc.dialect_id IS NULL  -- Common content
LEFT JOIN code_examples ce 
    ON l.lesson_id = ce.lesson_id 
    AND ce.dialect_id = 5  -- PostgreSQL
WHERE l.lesson_id = 101;
```

---

## 📊 Analytics & Monitoring

### Key Metrics Dashboard

```
┌────────────────────────────────────────────────────────┐
│ SQLTOWN ANALYTICS DASHBOARD                            │
├────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 User Metrics                                        │
│    Total Users: 85,432                                 │
│    Active Today: 12,456 (14.6%)                        │
│    New Signups: +342 today                             │
│    Retention (30d): 68%                                │
│                                                         │
│ 🎮 Engagement                                          │
│    Lessons Completed: 1,234,567                        │
│    Avg Time/Session: 24 minutes                        │
│    Cities Built: 42,891                                │
│    Quests Completed: 89,234                            │
│                                                         │
│ 🔥 Most Popular Dialect                                │
│    1. MySQL (45%)                                      │
│    2. PostgreSQL (32%)                                 │
│    3. SQLite (15%)                                     │
│    4. Others (8%)                                      │
│                                                         │
│ ⚡ Performance                                          │
│    Avg API Response: 156ms                             │
│    Database Query Time: 42ms                           │
│    Error Rate: 0.08%                                   │
│    Uptime: 99.97%                                      │
│                                                         │
│ 💰 Revenue                                             │
│    MRR: $24,567                                        │
│    Paid Users: 2,456 (2.9%)                            │
│    Churn Rate: 4.2%                                    │
│    ARPU: $10.01                                        │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Monitoring Queries

```sql
-- Daily Active Users
SELECT 
    DATE(last_active_at) as date,
    COUNT(DISTINCT user_id) as dau
FROM users
WHERE last_active_at >= CURRENT_DATE - INTERVAL 7 DAY
GROUP BY DATE(last_active_at)
ORDER BY date DESC;

-- Most Popular Lessons
SELECT 
    l.lesson_title,
    COUNT(DISTINCT up.user_id) as total_users,
    AVG(up.completion_percentage) as avg_completion,
    AVG(up.time_spent_seconds) / 60 as avg_minutes
FROM lessons l
JOIN user_progress up ON l.lesson_id = up.lesson_id
WHERE up.last_activity_at >= CURRENT_DATE - INTERVAL 30 DAY
GROUP BY l.lesson_id
ORDER BY total_users DESC
LIMIT 10;

-- Conversion Funnel
SELECT 
    'Signup' as stage, COUNT(*) as users FROM users
UNION ALL
SELECT 
    'Started Lesson', COUNT(DISTINCT user_id) FROM user_progress
UNION ALL
SELECT 
    'Completed Lesson', COUNT(DISTINCT user_id) 
    FROM user_progress WHERE status = 'completed'
UNION ALL
SELECT 
    'Built City', COUNT(DISTINCT user_id) FROM cities
UNION ALL
SELECT 
    'Paid User', COUNT(DISTINCT user_id) 
    FROM user_subscriptions WHERE status = 'active';
```

---

## 🔄 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Next.js)                                     │
│  ├─ Vercel/Netlify                                      │
│  ├─ CDN: Cloudflare                                     │
│  └─ Static Assets: AWS S3 + CloudFront                  │
│                                                          │
│  Backend (Node.js/Express)                              │
│  ├─ AWS EC2 / Google Cloud Run                          │
│  ├─ Auto-scaling: 2-10 instances                        │
│  └─ Load Balancer: AWS ALB                              │
│                                                          │
│  Database (PostgreSQL)                                   │
│  ├─ AWS RDS / Google Cloud SQL                          │
│  ├─ Master: db.m5.xlarge (4 vCPU, 16GB)                │
│  └─ Replicas: 2x db.m5.large (2 vCPU, 8GB)             │
│                                                          │
│  Caching                                                 │
│  ├─ Redis: AWS ElastiCache (cache.m5.large)            │
│  └─ Memcached: Session management                       │
│                                                          │
│  File Storage                                            │
│  ├─ User uploads: AWS S3                                │
│  ├─ Backups: S3 Glacier                                 │
│  └─ CDN: CloudFront                                     │
│                                                          │
│  SQL Execution (Sandboxed)                               │
│  ├─ Docker containers                                    │
│  ├─ Timeout: 5 seconds                                  │
│  └─ Resource limits: 256MB RAM, 0.5 CPU                 │
│                                                          │
│  Monitoring                                              │
│  ├─ Application: New Relic / Datadog                    │
│  ├─ Errors: Sentry                                      │
│  └─ Logs: ELK Stack / CloudWatch                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Implementation Phases

### Phase 1: MVP (3 months)
- ✅ User authentication
- ✅ MySQL support only
- ✅ 10 beginner lessons
- ✅ Basic city building (4 structures)
- ✅ Single-server setup
- **Target:** 1,000 users

### Phase 2: Multi-Dialect (2 months)
- ✅ Add PostgreSQL support
- ✅ Add SQLite support
- ✅ 30 total lessons (beginner + intermediate)
- ✅ Quest system
- ✅ Leaderboards
- **Target:** 10,000 users

### Phase 3: Scale (3 months)
- ✅ Read replicas
- ✅ Caching layer
- ✅ Advanced lessons (50 total)
- ✅ Achievement system
- ✅ Social features
- **Target:** 50,000 users

### Phase 4: Enterprise (Ongoing)
- ✅ Oracle support
- ✅ MS SQL Server support
- ✅ Certification program
- ✅ B2B features
- ✅ Multi-region deployment
- **Target:** 100,000+ users

---

## 🔧 Technology Stack Recommendations

```
Frontend:
├─ Framework: Next.js 14 (React)
├─ Styling: Tailwind CSS + custom animations
├─ State: Redux Toolkit / Zustand
├─ Real-time: Socket.io
└─ Charts: D3.js / Recharts

Backend:
├─ Runtime: Node.js 20+
├─ Framework: Express.js / Fastify
├─ API: REST + GraphQL (Apollo)
├─ Validation: Zod / Joi
└─ Testing: Jest + Supertest

Database:
├─ Primary: PostgreSQL 15+ (JSONB support)
├─ Caching: Redis 7+
├─ Search: Elasticsearch (documentation)
└─ Queue: Bull (background jobs)

DevOps:
├─ CI/CD: GitHub Actions
├─ Containers: Docker + Kubernetes
├─ Monitoring: Prometheus + Grafana
├─ Logging: Winston + ELK Stack
└─ Testing: k6 (load testing)

Security:
├─ Auth: JWT + Refresh Tokens
├─ Rate Limiting: Express Rate Limit
├─ SQL Execution: Docker sandboxing
└─ Secrets: AWS Secrets Manager
```

---

## 📝 Key Takeaways

### ✅ What This Architecture Provides

1. **Scalability:** Handle 100K users, 10K concurrent
2. **Multi-Dialect:** Same platform, any SQL flavor
3. **Gamification:** City building keeps users engaged
4. **Performance:** < 200ms API responses, < 100ms queries
5. **Reliability:** 99.9% uptime, automatic failover
6. **Analytics:** Track everything, optimize continuously
7. **Monetization:** Freemium + B2B ready
8. **Future-Proof:** Easy to add features, dialects, content

### ⚠️ Potential Challenges

1. **SQL Execution Security:**
   - Need robust sandboxing
   - Prevent malicious queries
   - Resource limits per query

2. **Real-time Animations:**
   - Sync city state across devices
   - Handle concurrent updates
   - Smooth performance on mobile

3. **Content Creation:**
   - 50+ lessons × 6 dialects = 300+ code examples
   - Need content management workflow
   - Quality assurance

4. **Cost Management:**
   - Database scaling is expensive
   - Optimize query efficiency
   - Cache aggressively

---

## 🚀 Next Steps

1. **Set up development environment**
   ```bash
   # Initialize database
   psql -U postgres -f database_schema.sql
   
   # Start backend
   cd server && npm install && npm start
   
   # Start frontend
   cd client && npm install && npm run dev
   ```

2. **Load seed data**
   - Insert sample SQL dialects
   - Create test users
   - Add demo lessons

3. **Run migrations**
   - Set up migration tool (Knex/Prisma)
   - Version control schema changes
   - Test rollback procedures

4. **Begin load testing**
   - Use k6 or Apache JMeter
   - Simulate 10K concurrent users
   - Identify bottlenecks

---

**Database Schema Location:** `database_schema.sql`  
**Last Updated:** 10 February 2026  
**Version:** 1.0.0
