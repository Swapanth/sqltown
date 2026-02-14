# SQLTown - React Frontend Architecture Plan

## 🎨 Design Theme & Visual Identity

### Core Theme: **Sacred City Builder**
Based on the landing page, the entire app follows an **Indian sacred city aesthetic** with a modern, clean twist.

**Color Palette:**
- **Primary:** `#E67350` (Accent Orange/Terracotta)
- **Background:** `#FFFFFF` (Clean White)
- **Text:** `#000000` (Pure Black)
- **Secondary:** `#a9c1ed` (Sky Blue - from terminal visualization)
- **Success:** `#28C840` (Green)
- **Error:** `#FF5F57` (Red)

**Typography:**
- **Headings:** 'Playfair Display' (Serif) - Elegant, classic
- **Body:** 'Syne' (Sans-serif) - Modern, readable
- **Code:** 'JetBrains Mono' (Monospace) - Terminal style

**Visual Elements:**
- Animated city buildings (dharamshala, temples, ashrams, pilgrims)
- Terminal-style code editors
- Walking pilgrims/characters
- Street lamps with glows
- Trees and nature elements
- Billboard with Telugu/Sanskrit text

---

## 🏗️ React MVC Architecture Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── assets/
│   │   ├── images/
│   │   │   ├── buildings/
│   │   │   ├── characters/
│   │   │   ├── icons/
│   │   │   └── backgrounds/
│   │   └── sounds/
│   └── favicon.png
├── src/
│   ├── index.js
│   ├── App.js
│   │
│   ├── models/                    # MODEL LAYER
│   │   ├── User.model.js
│   │   ├── City.model.js
│   │   ├── Lesson.model.js
│   │   ├── Quest.model.js
│   │   ├── Achievement.model.js
│   │   ├── Dialect.model.js
│   │   └── Progress.model.js
│   │
│   ├── views/                     # VIEW LAYER (Pages)
│   │   ├── auth/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SettingsPage.jsx
│   │   │
│   │   ├── learning/
│   │   │   ├── LearningPathsPage.jsx
│   │   │   ├── ChapterPage.jsx
│   │   │   ├── LessonPage.jsx
│   │   │   └── InteractiveLessonPage.jsx
│   │   │
│   │   ├── city/
│   │   │   ├── CityBuilderPage.jsx
│   │   │   ├── BuildingDetailPage.jsx
│   │   │   └── CitySharingPage.jsx
│   │   │
│   │   ├── quests/
│   │   │   ├── QuestsPage.jsx
│   │   │   └── QuestDetailPage.jsx
│   │   │
│   │   ├── community/
│   │   │   ├── LeaderboardPage.jsx
│   │   │   ├── ExploreCitiesPage.jsx
│   │   │   └── UserProfilePage.jsx
│   │   │
│   │   ├── documentation/
│   │   │   ├── DocsHomePage.jsx
│   │   │   ├── DocsCategoryPage.jsx
│   │   │   └── DocsTopicPage.jsx
│   │   │
│   │   └── misc/
│   │       ├── WaitlistPage.jsx
│   │       ├── RecruitmentPage.jsx
│   │       └── NotFoundPage.jsx
│   │
│   ├── controllers/               # CONTROLLER LAYER
│   │   ├── AuthController.js
│   │   ├── CityController.js
│   │   ├── LessonController.js
│   │   ├── QuestController.js
│   │   ├── ProgressController.js
│   │   ├── LeaderboardController.js
│   │   └── DocumentationController.js
│   │
│   ├── components/                # Reusable UI Components
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Loading.jsx
│   │   │
│   │   ├── game/
│   │   │   ├── CityVisualization.jsx
│   │   │   ├── BuildingCard.jsx
│   │   │   ├── BuildingAnimation.jsx
│   │   │   ├── CharacterAnimation.jsx
│   │   │   ├── XPBar.jsx
│   │   │   ├── CoinsDisplay.jsx
│   │   │   └── LevelBadge.jsx
│   │   │
│   │   ├── learning/
│   │   │   ├── TerminalEditor.jsx
│   │   │   ├── CodeExample.jsx
│   │   │   ├── SQLValidator.jsx
│   │   │   ├── ProgressCard.jsx
│   │   │   ├── ChapterCard.jsx
│   │   │   ├── LessonCard.jsx
│   │   │   └── DialectSelector.jsx
│   │   │
│   │   ├── quests/
│   │   │   ├── QuestCard.jsx
│   │   │   ├── ObjectiveList.jsx
│   │   │   └── RewardDisplay.jsx
│   │   │
│   │   └── social/
│   │       ├── LeaderboardTable.jsx
│   │       ├── CityCard.jsx
│   │       ├── CommentSection.jsx
│   │       └── FollowButton.jsx
│   │
│   ├── services/                  # API Services
│   │   ├── api.service.js
│   │   ├── auth.service.js
│   │   ├── city.service.js
│   │   ├── lesson.service.js
│   │   ├── quest.service.js
│   │   └── storage.service.js
│   │
│   ├── hooks/                     # Custom React Hooks
│   │   ├── useAuth.js
│   │   ├── useCity.js
│   │   ├── useProgress.js
│   │   ├── useLeaderboard.js
│   │   └── useAnimation.js
│   │
│   ├── utils/                     # Utility Functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── sqlParser.js
│   │   └── animations.js
│   │
│   ├── routes/                    # Routing Configuration
│   │   ├── AppRoutes.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── styles/                    # Global Styles
│   │   ├── global.css
│   │   ├── variables.css
│   │   ├── animations.css
│   │   ├── terminal.css
│   │   └── city.css
│   │
│   └── data/                      # Static/Mock Data
│       ├── mockUsers.js
│       ├── mockLessons.js
│       ├── mockCities.js
│       └── dialects.js
```

---

## 📱 Detailed Screen Specifications

### 1. **Landing Page** (`/`)
**Purpose:** First impression, conversion, waitlist signup

**Sections:**
1. **Hero Section**
   - Animated title: "Build SQL like a town"
   - Terminal window with live city building animation
   - Buildings appear as SQL commands execute
   - Walking characters (pilgrims)
   - Call-to-action: "Join Waitlist" / "Get Started"

2. **Features Section**
   - Multi-dialect support cards (MySQL, PostgreSQL, SQLite, etc.)
   - Interactive code examples
   - Visual showcase of city building

3. **Learning Path Preview**
   - Roadmap visualization
   - Path cards with difficulty levels
   - Animated progression indicators

4. **Game Demo**
   - Interactive city preview
   - Click buildings to see what they represent
   - Hover effects on elements

5. **Join Us / Recruitment**
   - Resume upload section

6. **FAQ Section**
   - Expandable questions

**Components Used:**
- `HeroSection`
- `TerminalWindow`
- `CityAnimationPreview`
- `FeatureCards`
- `LearningPathPreview`
- `WaitlistForm`

---

### 2. **Authentication Pages**

#### A. **Login Page** (`/login`)
**Design:**
```
┌─────────────────────────────────────┐
│  [SQLTown Logo]                     │
│                                     │
│  Welcome back to Vrindavan          │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Email                        │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Password                     │  │
│  └──────────────────────────────┘  │
│                                     │
│  [Forgot Password?]                │
│                                     │
│  [LOGIN BUTTON]                    │
│                                     │
│  Don't have a city? [Sign Up]      │
│                                     │
│  ─── or continue with ───          │
│  [Google] [GitHub]                 │
└─────────────────────────────────────┘
```

#### B. **Signup Page** (`/signup`)
**Additional Fields:**
- Username
- Full Name
- Preferred SQL Dialect
- Experience Level

**Animation:** Mini city grows as they fill the form

---

### 3. **Dashboard Home** (`/dashboard`)
**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ [Logo] SQLTown        [Coins: 1,500] [XP: 2,340]  [👤] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Welcome back, Swapanth! 👋                             │
│  Current City: Vrindavan (MySQL) - Level 5              │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Your Progress   │  │  Active Quests   │             │
│  │  ──────────      │  │  🎯 3 ongoing    │             │
│  │  65% complete    │  │  ⭐ 2 pending    │             │
│  └─────────────────┘  └─────────────────┘             │
│                                                          │
│  [City Visualization - Interactive Canvas]              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🏠 dharamshala   🕌 temples   🏛️ ashrams      │   │
│  │                                                  │   │
│  │     [Animated Sacred City]                      │   │
│  │                                                  │   │
│  │  🚶 pilgrims coming and going                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Quick Actions:                                         │
│  [Continue Learning] [Build City] [View Quests]        │
│                                                          │
│  Recent Achievements:                                   │
│  🏆 First Query     🏆 City Founder     🎓 Scholar     │
└──────────────────────────────────────────────────────────┘
```

**Key Features:**
- Live city visualization
- Progress overview
- Quick access to main features
- Achievement showcase
- Daily quest reminders

---

### 4. **Learning Paths Page** (`/learn`)
**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  📚 Learning Paths                                   │
│                                                      │
│  [MySQL ▼] Selected Dialect                        │
│                                                      │
│  ┌────────────────────────────────────────────────┐│
│  │ 🌱 Beginner Path                               ││
│  │ ━━━━━━━━━━━━━━━━━━━ 45%                        ││
│  │                                                 ││
│  │ Chapter 1: Database Basics ✓                   ││
│  │ Chapter 2: SELECT Statements (In Progress)     ││
│  │ Chapter 3: WHERE Clauses 🔒                    ││
│  │                                                 ││
│  │ [Continue Learning]                            ││
│  └────────────────────────────────────────────────┘│
│                                                      │
│  ┌────────────────────────────────────────────────┐│
│  │ 🔥 Intermediate Path                           ││
│  │ ━━━━━━━━━ 12%                                  ││
│  │                                                 ││
│  │ Chapter 1: JOINs & Relations 🔒                ││
│  │ Unlock at Level 5                              ││
│  └────────────────────────────────────────────────┘│
│                                                      │
│  ┌────────────────────────────────────────────────┐│
│  │ ⚡ Advanced Path                               ││
│  │ ━━━ 0%                                         ││
│  │ Locked - Complete Intermediate Path            ││
│  └────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Features:**
- Path cards with progress bars
- Lock/unlock indicators
- Difficulty badges
- Estimated completion time
- Switch between dialects

---

### 5. **Interactive Lesson Page** (`/learn/:pathId/:chapterId/:lessonId`)
**Most Important Page - Where Learning Happens**

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [← Back] Lesson 1.2: Basic SELECT                  [?] │
├───────────────────────────────────────────────────────┬─┤
│                                                       │ │
│ 📖 LESSON CONTENT                      🏙️ LIVE CITY │ │
│                                                       │ │
│ The SELECT statement retrieves data                  │ │
│ from your database tables.                           │ │
│                                                       │ │
│ Syntax:                                              │🏠│
│ ┌─────────────────────────────────────┐             │🕌│
│ │ SELECT column_name                  │             │🏛️│
│ │ FROM table_name;                    │             │ │
│ └─────────────────────────────────────┘             │ │
│                                                       │ │
│ Try it yourself:                                     │ │
│ ┌─────────────────────────────────────┐             │ │
│ │ [Terminal Editor]                   │             │ │
│ │ →                                   │             │ │
│ │                                    █│             │ │
│ │                                     │             │ │
│ │                                     │             │ │
│ └─────────────────────────────────────┘             │ │
│                                                       │ │
│ [Run Query] [Reset] [Hint]                          │ │
│                                                       │ │
│ Results:                                             │ │
│ ┌─────────────────────────────────────┐             │ │
│ │ (Query results appear here)         │             │ │
│ └─────────────────────────────────────┘             │ │
│                                                       │ │
│ [Previous Lesson] [Mark Complete] [Next Lesson]     │ │
└───────────────────────────────────────────────────────┴─┘
```

**Key Features:**
- Split view: Lesson content + Live city
- Terminal-style code editor
- Real-time SQL validation
- Instant feedback
- City animates based on query results
- XP earned on completion
- Dialect-specific examples

---

### 6. **City Builder Page** (`/city`)
**The Game Element - User's Personal City**

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ 🏙️ Vrindavan (MySQL) - Level 5                         │
│ Population: 234 | Coins: 1,500 | XP: 2,340              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Interactive City Canvas - Drag & Drop]                │
│  ┌────────────────────────────────────────────────────┐ │
│  │                   [Sun] ☀️                         │ │
│  │  ☁️        ☁️             ☁️                       │ │
│  │                                                     │ │
│  │  🏠      🕌       🏛️                              │ │
│  │  dharamshala  temples  ashrams                     │ │
│  │  Tables: 3    Tables: 5  Tables: 2                 │ │
│  │                                                     │ │
│  │     🚶        💡          🌳                       │ │
│  │           pilgrims   streetlamp   tree             │ │
│  │                                                     │ │
│  │  🏠                      🏠                        │ │
│  │  (Empty Plot)            pilgrims                  │ │
│  │  [+ Build]                                         │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Available Buildings:                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                  │
│  │🏪 Market│ │🎭 Theatre│ │⛩️ Gate │                  │
│  │ 500 💰 │ │ 1000 💰 │ │ 2000 💰│                  │
│  │ Level 3 │ │ Level 5 │ │ Level 8│                  │
│  └─────────┘ └─────────┘ └─────────┘                  │
│                                                          │
│  [Share City] [View Stats] [City Settings]             │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Drag-and-drop building placement
- Buildings represent database objects:
  - 🏠 dharamshala = Tables
  - 🕌 temples = Views
  - 🏛️ ashrams = Stored Procedures
  - 🚶 pilgrims = Rows/Data
- Upgrade buildings
- City themes (Vrindavan, Mathura, Ayodhya, Kashi)
- Share city with friends
- City grows with learning progress

---

### 7. **Quests Page** (`/quests`)
**Gamified Challenges**

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ ⚔️ Quests & Missions                                    │
│                                                          │
│  [Daily] [Weekly] [Main Story] [Side Quests]           │
│                                                          │
│  📅 Daily Quests (Refreshes in 8h)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ⭐ Complete 3 Lessons                               │ │
│  │    Progress: ▓▓▓▓░░ 2/3                            │ │
│  │    Reward: 100 XP, 50 Coins                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  🎯 Main Story Quests                                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📜 The Foundation (Chapter 1)                      │ │
│  │    Build your first dharamshala table              │ │
│  │    Status: In Progress ⏳                          │ │
│  │    Reward: 500 XP, 200 Coins, 🏆 City Founder     │ │
│  │    [Continue]                                       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📜 The Temple of JOINs (Chapter 2)                │ │
│  │    Master the art of combining tables              │ │
│  │    Status: Locked 🔒 (Complete Chapter 1)         │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Types:**
- Daily quests (refresh every 24h)
- Weekly challenges
- Main story (follows learning path)
- Side quests (optional, fun challenges)

---

### 8. **Leaderboard Page** (`/leaderboard`)
```
┌─────────────────────────────────────────────────────────┐
│ 🏆 Leaderboards                                         │
│                                                          │
│  [Global] [MySQL] [PostgreSQL] [Weekly] [Monthly]      │
│                                                          │
│  🌍 Global XP Rankings                                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Rank  User          City Level    XP     Dialect   │ │
│  ├────────────────────────────────────────────────────┤ │
│  │  🥇  Bhardwaj       42         125,340   MySQL     │ │
│  │  🥈  Priya_SQL      38          98,230   PostgreSQL│ │
│  │  🥉  CodeGuru       35          87,120   MySQL     │ │
│  │  4   RamDev         32          75,890   SQLite    │ │
│  │  5   DataQueen      30          72,340   PostgreSQL│ │
│  │  ...                                                │ │
│  │  142 You (Swapanth) 5            2,340   MySQL     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Your City Rank: #142 out of 10,234 builders           │
│  Keep building! 🚀                                      │
└─────────────────────────────────────────────────────────┘
```

---

### 9. **Explore Cities Page** (`/explore`)
**Social Feature - Browse Other Users' Cities**

```
┌─────────────────────────────────────────────────────────┐
│ 🌍 Explore Sacred Cities                                │
│                                                          │
│  [Search...] [Filter: Level ▼] [Sort: Popular ▼]      │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ Vrindavan│ │ Mathura  │ │ Ayodhya  │               │
│  │ by Bhardw│ │ by Priya │ │ by CodeG │               │
│  │          │ │          │ │          │               │
│  │ [City👁️] │ │ [City👁️] │ │ [City👁️] │               │
│  │          │ │          │ │          │               │
│  │ Level 42 │ │ Level 38 │ │ Level 35 │               │
│  │ ❤️ 1.2k  │ │ ❤️ 890   │ │ ❤️ 654   │               │
│  │ 👁️ 5.3k  │ │ 👁️ 3.2k  │ │ 👁️ 2.1k  │               │
│  └──────────┘ └──────────┘ └──────────┘               │
└─────────────────────────────────────────────────────────┘
```

---

### 10. **Documentation Page** (`/docs`)
**SQL Reference & Learning Materials**

```
┌─────────────────────────────────────────────────────────┐
│ 📚 SQL Documentation                                     │
│                                                          │
│  [Search documentation...]                              │
│                                                          │
│  ┌─────────────┬─────────────────────────────────────┐ │
│  │ Categories  │  SELECT Statement                    │ │
│  ├─────────────┤                                      │ │
│  │ ► Basics    │  The SELECT statement is used to    │ │
│  │ ▼ Queries   │  retrieve data from database...     │ │
│  │   - SELECT  │                                      │ │
│  │   - WHERE   │  Syntax:                            │ │
│  │   - GROUP BY│  ┌──────────────────────────────┐  │ │
│  │   - ORDER BY│  │ SELECT column1, column2      │  │ │
│  │ ► JOINs     │  │ FROM table_name              │  │ │
│  │ ► Functions │  │ WHERE condition;             │  │ │
│  │ ► DDL       │  └──────────────────────────────┘  │ │
│  │ ► DML       │                                      │ │
│  │             │  Examples:                          │ │
│  │             │  [MySQL] [PostgreSQL] [SQLite]     │ │
│  │             │                                      │ │
│  └─────────────┴─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

### 11. **Profile Page** (`/profile/:username`)
```
┌─────────────────────────────────────────────────────────┐
│ [Avatar]  Swapanth                                      │
│           @swapanth_sql                                 │
│           Level 5 SQL Builder                           │
│           Joined: Jan 2026                              │
│                                                          │
│           [Edit Profile] [Settings]                     │
│                                                          │
│  ┌─────────────────────────────────────────────────────┤
│  │ Stats:                                              │
│  │ • Total XP: 2,340                                   │
│  │ • Cities Built: 1                                   │
│  │ • Lessons Completed: 12                             │
│  │ • Quests Completed: 8                               │
│  │ • Achievements: 5                                   │
│  │                                                      │
│  │ Preferred Dialect: MySQL 8.0                        │
│  └─────────────────────────────────────────────────────┘
│                                                          │
│  Cities:                                                │
│  ┌──────────┐                                           │
│  │ Vrindavan│                                           │
│  │ (MySQL)  │                                           │
│  │ Level 5  │                                           │
│  └──────────┘                                           │
│                                                          │
│  Recent Achievements:                                   │
│  🏆 City Founder  🎓 First Query  ⚡ Speed Runner       │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Specifications

### Key Interactive Components

#### 1. **TerminalEditor Component**
- Syntax highlighting for SQL
- Auto-completion
- Error highlighting
- Line numbers
- Terminal-style theme

#### 2. **CityVisualization Component**
- Canvas-based rendering
- Smooth animations
- Drag-and-drop building placement
- Click interactions
- Real-time updates

#### 3. **BuildingAnimation Component**
- CSS/Canvas animations
- Loading states
- Hover effects
- Click interactions
- Particle effects

#### 4. **DialectSelector Component**
- Switch between SQL dialects
- Visual dialect logos
- Smooth transitions
- Persistent selection

#### 5. **ProgressCard Component**
- Circular/linear progress bars
- XP display
- Level indicators
- Animated on updates

---

## 🎨 Animation & Interaction Guidelines

### Animations to Implement:

1. **Page Transitions**
   - Fade in/out
   - Slide transitions
   - Duration: 300ms

2. **City Building Animations**
   - Buildings rise from ground when created
   - Windows light up randomly
   - Smoke from chimneys
   - Walking characters
   - Clouds moving
   - Day/night cycle

3. **Success Animations**
   - Confetti on quest completion
   - XP bar fill animation
   - Coin collection animation
   - Achievement popup

4. **Loading States**
   - Skeleton screens
   - Animated placeholders
   - City construction progress

5. **Hover Effects**
   - Buildings glow
   - Street lamps brighten
   - Cards lift slightly
   - Cursor changes

---

## 📊 State Management

### Using React Context + Hooks

```javascript
Contexts:
├── AuthContext          // User authentication
├── CityContext          // City state & buildings
├── ProgressContext      // Learning progress
├── ThemeContext         // Light/dark mode
└── NotificationContext  // Toasts & alerts
```

---

## 🚀 Static Data Structure (For Now)

### Mock Data Files:

#### `mockUsers.js`
```javascript
export const currentUser = {
  user_id: 1,
  username: "swapanth",
  full_name: "Swapanth",
  avatar_url: "/assets/avatars/user1.png",
  total_xp: 2340,
  total_coins: 1500,
  level: 5,
  preferred_dialect: "mysql",
  cities: [/* city objects */],
  achievements: [/* achievement objects */]
};
```

#### `mockLessons.js`
```javascript
export const learningPaths = [
  {
    path_id: 1,
    path_name: "beginner_mysql",
    display_title: "MySQL Fundamentals",
    chapters: [
      {
        chapter_id: 1,
        chapter_title: "Database Basics",
        lessons: [/* lesson objects */]
      }
    ]
  }
];
```

#### `mockCities.js`
```javascript
export const userCity = {
  city_id: 1,
  city_name: "Vrindavan",
  city_level: 5,
  dialect: "mysql",
  buildings: [
    {
      building_id: 1,
      type: "dharamshala",
      position_x: 100,
      position_y: 200,
      level: 2
    }
  ]
};
```

---

## 🎯 Routing Structure

```javascript
/ → LandingPage
/login → LoginPage
/signup → SignupPage
/dashboard → DashboardHome (Protected)
/learn → LearningPathsPage (Protected)
/learn/:pathId → ChapterPage (Protected)
/learn/:pathId/:chapterId/:lessonId → LessonPage (Protected)
/city → CityBuilderPage (Protected)
/quests → QuestsPage (Protected)
/leaderboard → LeaderboardPage (Protected)
/explore → ExploreCitiesPage (Protected)
/docs → DocsHomePage
/docs/:category/:topic → DocsTopicPage
/profile/:username → UserProfilePage
/waitlist → WaitlistPage
/recruitment → RecruitmentPage
/404 → NotFoundPage
```

---

## 📱 Responsive Design Breakpoints

```css
/* Mobile First Approach */
--mobile: 320px - 767px
--tablet: 768px - 1023px
--desktop: 1024px - 1439px
--wide: 1440px+

/* City visualization adapts:
   - Mobile: Simplified 2D view
   - Tablet: Moderate animations
   - Desktop: Full 3D-like experience
*/
```

---

## ✨ Progressive Enhancement Features

### Phase 1 (Static):
- ✅ All pages with mock data
- ✅ City visualization (static)
- ✅ Terminal editor (UI only)
- ✅ Navigation & routing
- ✅ Animations & interactions

### Phase 2 (Connected to Backend):
- 🔄 User authentication
- 🔄 Real progress tracking
- 🔄 SQL execution
- 🔄 Database operations

### Phase 3 (Advanced):
- 🔄 Real-time multiplayer features
- 🔄 Live leaderboards
- 🔄 Social features
- 🔄 Payment integration

---

## 🎨 Design System

### Component Library:
All components follow the sacred city theme with:
- Terminal-inspired UI elements
- Building metaphors for data structures
- Cultural visual elements
- Clean, modern aesthetics
- Accessibility-first approach

### Color Usage:
- **Primary Actions:** `#E67350` (Orange/Terracotta)
- **Success States:** `#28C840` (Green)
- **Error States:** `#FF5F57` (Red)
- **Information:** `#a9c1ed` (Sky Blue)
- **Neutral:** Black & White contrast

This architecture ensures a scalable, maintainable, and delightful user experience while maintaining the unique sacred city theme! 🏙️✨
