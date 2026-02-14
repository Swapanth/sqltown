# SQLTown - React Frontend Development Roadmap

## 🚀 Quick Start Guide

### Prerequisites
```bash
- Node.js 18+ and npm/yarn
- VS Code or preferred IDE
- Basic React knowledge
- Familiarity with hooks and context
```

### Initial Setup

#### 1. Create React App with Vite (Recommended)
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/sqltown

# Create frontend directory
npm create vite@latest frontend -- --template react

cd frontend
npm install
```

#### 2. Install Core Dependencies
```bash
# UI & Styling
npm install tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npm install framer-motion  # For animations

# Routing
npm install react-router-dom

# State Management
npm install zustand  # Or use Context API

# Code Editor
npm install @monaco-editor/react  # For terminal editor
npm install prismjs react-syntax-highlighter  # For syntax highlighting

# Forms & Validation
npm install react-hook-form zod

# Utilities
npm install clsx classnames
npm install date-fns  # Date formatting
npm install axios  # API calls (for later)

# Development Tools
npm install -D @types/react @types/node
npm install -D eslint prettier
```

#### 3. Setup Tailwind CSS
```bash
npx tailwindcss init -p
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E67350',
        'primary-hover': '#d15d3f',
        terminal: '#000000',
        'sky-blue': '#a9c1ed',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Syne', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'building-rise': 'buildingRise 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        buildingRise: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

#### 4. Project Structure Setup
```bash
cd src

# Create directory structure
mkdir -p models views/{auth,dashboard,learning,city,quests,community,documentation,misc}
mkdir -p controllers components/{common,game,learning,quests,social}
mkdir -p services hooks utils routes styles data
```

---

## 📅 Development Phases

### **Phase 1: Foundation (Week 1-2)**
**Goal:** Setup project structure, design system, and basic navigation

#### Tasks:
- [x] Project initialization
- [ ] Setup Tailwind CSS with custom theme
- [ ] Create design tokens file (`styles/tokens.js`)
- [ ] Implement layout components:
  - [ ] Header
  - [ ] Sidebar
  - [ ] Footer
  - [ ] Container
- [ ] Setup React Router
- [ ] Create basic routing structure
- [ ] Implement common components:
  - [ ] Button (all variants)
  - [ ] Card
  - [ ] Input
  - [ ] Modal
  - [ ] Toast
- [ ] Setup Context for:
  - [ ] Theme
  - [ ] Toast/Notifications

**Deliverables:**
- Working navigation
- Reusable component library
- Design system implemented

---

### **Phase 2: Authentication Pages (Week 3)**
**Goal:** Complete auth flow and landing page

#### Tasks:
- [ ] Landing Page
  - [ ] Hero section with terminal animation
  - [ ] Features section
  - [ ] Learning path preview
  - [ ] Waitlist form
- [ ] Login Page
  - [ ] Form with validation
  - [ ] Social login buttons (UI only)
- [ ] Signup Page
  - [ ] Multi-step form
  - [ ] Dialect selection
  - [ ] City name input
- [ ] Welcome Tutorial (Modal)

**Mock Data Needed:**
- `mockDialects.js`
- `mockCityThemes.js`

**Deliverables:**
- Complete landing page
- Auth pages with validation
- Welcome flow

---

### **Phase 3: Dashboard & Profile (Week 4)**
**Goal:** User dashboard and profile management

#### Tasks:
- [ ] Dashboard Home
  - [ ] Welcome message
  - [ ] Progress overview cards
  - [ ] Quick actions
  - [ ] Mini city preview
  - [ ] Recent achievements
- [ ] Profile Page
  - [ ] User info display
  - [ ] Stats cards
  - [ ] Cities list
  - [ ] Achievements showcase
- [ ] Settings Page
  - [ ] Profile editing
  - [ ] Dialect preferences
  - [ ] Theme toggle (if implementing)

**Mock Data Needed:**
- `mockUsers.js`
- `mockProgress.js`
- `mockAchievements.js`

**Components to Build:**
- `ProgressCard`
- `AchievementBadge`
- `StatsCard`
- `UserAvatar`

**Deliverables:**
- Functional dashboard
- User profile
- Settings page

---

### **Phase 4: Learning System (Week 5-6)**
**Goal:** Core learning experience - THE MOST IMPORTANT PART

#### Tasks:

##### Week 5: Learning Paths & Chapters
- [ ] Learning Paths Page
  - [ ] Path cards with progress
  - [ ] Dialect selector
  - [ ] Filter by difficulty
- [ ] Chapter Page
  - [ ] Lesson list
  - [ ] Progress indicators
  - [ ] Lock/unlock states
- [ ] Components:
  - [ ] `LessonCard`
  - [ ] `ChapterCard`
  - [ ] `ProgressBar`
  - [ ] `DialectSelector`

##### Week 6: Interactive Lesson Page
- [ ] Lesson Content Layout
  - [ ] Split view: Content + City
  - [ ] Markdown rendering
  - [ ] Code examples
- [ ] Terminal Editor
  - [ ] Syntax highlighting
  - [ ] Basic editor functionality
  - [ ] Run button (mock execution for now)
- [ ] Results Display
  - [ ] Table rendering
  - [ ] Error messages
- [ ] Lesson Navigation
  - [ ] Previous/Next buttons
  - [ ] Complete lesson button
  - [ ] Progress tracking

**Mock Data Needed:**
- `mockLearningPaths.js`
- `mockChapters.js`
- `mockLessons.js`
- `mockLessonContent.js`

**Key Components:**
- `TerminalEditor` ⭐ CRITICAL
- `CodeExample`
- `ResultsTable`
- `LessonContent`
- `LessonNavigation`

**Deliverables:**
- Complete learning flow
- Interactive lesson page
- Code editor with syntax highlighting

---

### **Phase 5: City Builder (Week 7-8)**
**Goal:** Game element - Interactive city building

#### Tasks:

##### Week 7: City Visualization
- [ ] City Canvas Setup
  - [ ] Basic canvas rendering
  - [ ] Sky layer (sun, clouds)
  - [ ] Background layer
  - [ ] Buildings layer
  - [ ] Foreground layer (trees, lamps)
- [ ] Static Building Components
  - [ ] Dharamshala
  - [ ] Temple
  - [ ] Ashram
  - [ ] Pilgrim
  - [ ] Market
  - [ ] Theatre
- [ ] CSS Animations
  - [ ] Walking characters
  - [ ] Smoke from chimneys
  - [ ] Window lights
  - [ ] Cloud movement

##### Week 8: City Interactions
- [ ] City Builder Page
  - [ ] Interactive canvas
  - [ ] Building selector
  - [ ] Placement system
- [ ] Building Actions
  - [ ] Click to select
  - [ ] Drag to move (optional)
  - [ ] Upgrade modal
  - [ ] Delete confirmation
- [ ] City Stats Display
  - [ ] Population
  - [ ] Level
  - [ ] Coins
  - [ ] XP

**Mock Data Needed:**
- `mockCities.js`
- `mockBuildingTypes.js`
- `mockCityBuildings.js`

**Key Components:**
- `CityVisualization` ⭐ CRITICAL
- `BuildingComponent`
- `BuildingCard`
- `BuildingSelector`
- `CharacterAnimation`

**Deliverables:**
- Interactive city visualization
- Building placement system
- City builder page

---

### **Phase 6: Quests System (Week 9)**
**Goal:** Gamification through quests

#### Tasks:
- [ ] Quests Page
  - [ ] Quest list (daily, weekly, main)
  - [ ] Quest filters/tabs
  - [ ] Quest status indicators
- [ ] Quest Detail View
  - [ ] Objectives list
  - [ ] Progress tracking
  - [ ] Rewards display
- [ ] Quest Notifications
  - [ ] Quest available notification
  - [ ] Quest complete celebration
- [ ] Active Quest Indicator
  - [ ] Header/sidebar indicator
  - [ ] Progress bar

**Mock Data Needed:**
- `mockQuests.js`
- `mockUserQuests.js`

**Key Components:**
- `QuestCard`
- `ObjectiveList`
- `RewardDisplay`
- `QuestProgressBar`

**Deliverables:**
- Quests page
- Quest tracking system
- Quest notifications

---

### **Phase 7: Social Features (Week 10)**
**Goal:** Community engagement

#### Tasks:
- [ ] Leaderboard Page
  - [ ] Multiple leaderboards (global, dialect, weekly)
  - [ ] User ranking
  - [ ] Highlight current user
- [ ] Explore Cities Page
  - [ ] City cards grid
  - [ ] Search and filters
  - [ ] Like/share buttons
- [ ] User Profile (Public View)
  - [ ] View other users
  - [ ] Follow button
  - [ ] City showcase
- [ ] Comments System
  - [ ] Comment component
  - [ ] Reply functionality
  - [ ] Like comments

**Mock Data Needed:**
- `mockLeaderboard.js`
- `mockPublicCities.js`
- `mockComments.js`

**Key Components:**
- `LeaderboardTable`
- `CityCard`
- `CommentSection`
- `FollowButton`

**Deliverables:**
- Leaderboard
- City exploration
- Social interactions

---

### **Phase 8: Documentation (Week 11)**
**Goal:** SQL reference documentation

#### Tasks:
- [ ] Docs Home Page
  - [ ] Categories sidebar
  - [ ] Search functionality
  - [ ] Featured topics
- [ ] Category Page
  - [ ] Topics list
  - [ ] Breadcrumbs
- [ ] Topic Page
  - [ ] Content rendering
  - [ ] Code examples
  - [ ] Related topics
  - [ ] Dialect tabs

**Mock Data Needed:**
- `mockDocumentation.js`
- `mockDocsCategories.js`

**Key Components:**
- `DocsNav`
- `DocsSearch`
- `DocsContent`
- `CodeExample`

**Deliverables:**
- Documentation system
- Search functionality
- SQL reference pages

---

### **Phase 9: Polish & Animations (Week 12)**
**Goal:** Enhance UX with animations and polish

#### Tasks:
- [ ] Page Transitions
  - [ ] Fade in/out
  - [ ] Slide animations
- [ ] Success Animations
  - [ ] Confetti on quest complete
  - [ ] XP gain animation
  - [ ] Coin collection animation
  - [ ] Achievement popup
- [ ] Loading States
  - [ ] Skeleton screens
  - [ ] Loading spinners
  - [ ] Progress indicators
- [ ] Micro-interactions
  - [ ] Button hover effects
  - [ ] Card hover effects
  - [ ] Tooltip animations
- [ ] Responsive Design
  - [ ] Mobile layouts
  - [ ] Tablet layouts
  - [ ] Touch interactions

**Libraries to Use:**
- Framer Motion
- React Spring (optional)

**Deliverables:**
- Polished animations
- Responsive design
- Smooth transitions

---

### **Phase 10: Testing & Optimization (Week 13)**
**Goal:** Bug fixes and performance optimization

#### Tasks:
- [ ] Testing
  - [ ] Component testing
  - [ ] User flow testing
  - [ ] Cross-browser testing
  - [ ] Mobile testing
- [ ] Optimization
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Image optimization
  - [ ] Bundle size optimization
- [ ] Accessibility
  - [ ] Keyboard navigation
  - [ ] Screen reader support
  - [ ] ARIA labels
  - [ ] Color contrast
- [ ] Documentation
  - [ ] Component documentation
  - [ ] Code comments
  - [ ] README updates

**Deliverables:**
- Bug-free application
- Optimized performance
- Accessible UI

---

## 📊 Priority Components

### Must-Have (Critical Path):
1. **TerminalEditor** - Core learning experience
2. **CityVisualization** - Unique selling point
3. **LessonPage** - Main user interaction
4. **BuildingComponents** - Game mechanics
5. **ProgressTracking** - User engagement

### Important (High Priority):
6. Header/Sidebar Navigation
7. Dashboard Home
8. Learning Paths Page
9. Quest System
10. Authentication Pages

### Nice-to-Have (Medium Priority):
11. Leaderboard
12. Social Features
13. Documentation
14. Comments System
15. Advanced Animations

---

## 🎯 Development Best Practices

### 1. Component Structure
```jsx
// ComponentName.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    <div className="component-name">
      {/* Content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

### 2. File Naming Conventions
```
ComponentName.jsx      - React component
componentName.model.js - Data model
componentName.controller.js - Business logic
componentName.test.jsx - Tests
index.js               - Barrel export
```

### 3. CSS/Styling Approach
**Option A: Tailwind (Recommended)**
```jsx
<button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg">
  Click Me
</button>
```

**Option B: CSS Modules**
```jsx
import styles from './Button.module.css';

<button className={styles.button}>
  Click Me
</button>
```

### 4. State Management Pattern
```javascript
// Using Context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Methods
  const login = (credentials) => {
    // ...
  };
  
  const logout = () => {
    // ...
  };
  
  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within UserProvider');
  }
  return context;
};
```

### 5. Mock Data Pattern
```javascript
// data/mockUsers.js
export const currentUser = {
  user_id: 1,
  username: "swapanth",
  email: "swapanth@sqltown.dev",
  full_name: "Swapanth",
  avatar_url: "/avatars/user1.png",
  level: 5,
  total_xp: 2340,
  total_coins: 1500,
  preferred_dialect: "mysql",
};

export const mockUsers = [
  currentUser,
  // ... more users
];
```

---

## 🧪 Testing Checklist

For Each Component:
- [ ] Renders without crashing
- [ ] Props validation works
- [ ] Default props work
- [ ] Click handlers work
- [ ] State updates correctly
- [ ] Responsive on mobile
- [ ] Accessible (keyboard, screen reader)

For Each Page:
- [ ] Route works
- [ ] Loading state shows
- [ ] Error states handled
- [ ] Empty states handled
- [ ] Data displays correctly
- [ ] Navigation works
- [ ] Mobile responsive

---

## 🚀 Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing (after setup)
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Fix auto-fixable issues

# Formatting
npm run format           # Format with Prettier
```

---

## 📚 Resources

### Documentation:
- **React:** https://react.dev
- **React Router:** https://reactrouter.com
- **Tailwind CSS:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion
- **Monaco Editor:** https://microsoft.github.io/monaco-editor

### Design Inspiration:
- Landing Page: Current landing.html
- Colors: See ARCHITECTURE.md color palette
- Typography: Playfair Display + Syne + JetBrains Mono

### Game References:
- City builders: SimCity, Townscaper
- Interactive learning: Codecademy, freeCodeCamp
- Game mechanics: Duolingo, Khan Academy

---

## 🎯 Success Metrics

### Technical:
- [ ] All pages render correctly
- [ ] No console errors
- [ ] Fast page loads (< 2s)
- [ ] Mobile responsive
- [ ] Cross-browser compatible

### User Experience:
- [ ] Intuitive navigation
- [ ] Clear feedback on actions
- [ ] Smooth animations
- [ ] Engaging city visualization
- [ ] Fun learning experience

### Code Quality:
- [ ] Components are reusable
- [ ] Props are documented
- [ ] Code is well-organized
- [ ] Consistent naming
- [ ] Commented where needed

---

## 📞 Need Help?

Common Issues & Solutions:

**Issue:** City animations laggy
**Solution:** Use CSS transforms instead of position, implement requestAnimationFrame

**Issue:** Terminal editor not highlighting
**Solution:** Check Prism.js language support, verify dialect mapping

**Issue:** State not updating
**Solution:** Check if using immutable state updates, verify Context provider wrapping

**Issue:** Responsive layout breaks
**Solution:** Use Tailwind responsive prefixes (sm:, md:, lg:), test on actual devices

---

## 🎊 Let's Build!

Start with **Phase 1** and work through systematically. Don't skip phases as they build on each other.

**First Step:**
```bash
cd frontend
npm run dev
# Open http://localhost:5173
```

Create your first component and see it live! 🚀

Good luck building SQLTown! 🏙️✨
