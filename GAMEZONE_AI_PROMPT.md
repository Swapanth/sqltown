# GameZone Development Prompt for AI Tools

## Project Overview
You are building **GameZone** - an interactive SQL learning game where users build and grow a virtual city by completing SQL challenges. The game combines education with city-building mechanics, making SQL learning engaging and visual.

## Current Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS
- **Routing**: React Router DOM
- **State Management**: Context API / Zustand
- **Animations**: Framer Motion
- **SQL Engine**: SQL.js (SQLite in browser)
- **Code Editor**: Monaco Editor / Prism.js

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── CityVisualization.tsx    # Main city canvas
│   │   │   └── CityVisualization.css
│   │   ├── learning/
│   │   │   └── TerminalEditor.tsx       # SQL code editor
│   │   └── common/                      # Reusable UI components
│   ├── pages/
│   │   ├── market/
│   │   │   ├── MarketPage.tsx           # Building marketplace
│   │   │   ├── Residential.tsx          # Building SVGs
│   │   │   ├── Religious.tsx
│   │   │   ├── Commercial.tsx
│   │   │   ├── Infrastructure.tsx
│   │   │   └── Special.tsx
│   │   └── game/                        # Game pages
│   ├── models/
│   │   └── types.ts                     # TypeScript interfaces
│   ├── context/                         # State management
│   └── services/                        # Business logic
└── public/
    └── data/                            # SQL schemas & data
```

## Core Features Already Implemented

### 1. City Visualization System ✅
- **Location**: `frontend/src/components/game/CityVisualization.tsx`
- **Features**:
  - Animated sky with sun and floating clouds
  - Background skyscrapers and trees
  - Streetlamps with glowing lights
  - Building placement system
  - City billboard with city name
  - Responsive design
- **Building Types**: Haveli, Merchant Villa, Noble Townhouse, Stilt House, Temple, Market, Theatre, Gate, Well, Library, Fountain, Gardens (10 variants)

### 2. Building Market ✅
- **Location**: `frontend/src/pages/market/MarketPage.tsx`
- **Features**:
  - Category filtering (Residential, Religious, Commercial, Infrastructure, Special)
  - Building cards with SVG previews
  - Purchase system with coin requirements
  - Level-based unlocking
  - Modal detail view
  - Responsive grid layout

### 3. Building SVG Components ✅
- **Locations**: `frontend/src/pages/market/*.tsx`
- **Categories**:
  - **Residential**: Haveli, Mud Hut, Merchant Villa, Noble Townhouse, Courtyard House, Stilt House
  - **Religious**: Temple
  - **Commercial**: Market (Bazaar), Theatre
  - **Infrastructure**: City Gate, Well
  - **Special**: Library, Fountain, Gardens (10 variants: Rose, Vegetable, Zen, Lotus, Orchard, Herb, Wildflower, Topiary, Bonsai, Hanging)

### 4. Type System ✅
- **Location**: `frontend/src/models/types.ts`
- **Interfaces**: User, City, Building, Quest, Achievement, Progress, Leaderboard, etc.

## What Needs to Be Built (MVP Phases)

### Phase 1: SQL Engine & Database Integration 🔴 PRIORITY
**Goal**: Replace mock validation with real SQL.js execution

#### Tasks:
1. **Install SQL.js**
   ```bash
   npm install sql.js
   ```

2. **Create SQL Engine Service** (`services/sqlEngine.ts`)
   - Initialize SQL.js with WASM
   - Load sample database schemas
   - Execute SQL queries
   - Parse and format results
   - Handle errors gracefully
   - Compare query results with expected output

3. **Create Database Manager** (`services/databaseManager.ts`)
   - Load different database schemas per level
   - Reset database state
   - Track query history
   - Measure execution time

4. **Integration Points**:
   - Connect to TerminalEditor component
   - Display results in table format
   - Show helpful error messages
   - Track successful queries

#### Example Code Structure:
```typescript
// services/sqlEngine.ts
import initSqlJs from 'sql.js';

export class SQLEngine {
  private db: any;
  
  async initialize(schema: string) {
    const SQL = await initSqlJs({
      locateFile: file => `/sql-wasm.wasm`
    });
    this.db = new SQL.Database();
    this.db.run(schema);
  }
  
  executeQuery(sql: string): QueryResult {
    try {
      const results = this.db.exec(sql);
      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

---

### Phase 2: Game State & Progression System 🔴 PRIORITY
**Goal**: Build core progression mechanics with save/load

#### Tasks:
1. **Create Game State Context** (`context/GameContext.tsx`)
   - User progress (XP, level, coins)
   - City state (buildings, population)
   - Completed levels
   - Achievements unlocked

2. **Implement LocalStorage Service** (`services/storageService.ts`)
   - Save game state
   - Load game state
   - Auto-save after actions
   - Data compression if needed

3. **Build Progression Logic** (`services/progressionService.ts`)
   - Calculate XP from query complexity
   - Award coins based on performance
   - Level up system
   - Unlock new buildings

4. **Create Progress Tracking**
   - Track completed levels
   - Store query history
   - Achievement progress
   - Statistics (total queries, success rate)

#### Example State Structure:
```typescript
interface GameState {
  user: {
    userId: number;
    username: string;
    level: number;
    totalXP: number;
    totalCoins: number;
  };
  city: {
    cityId: number;
    cityName: string;
    buildings: CityBuilding[];
    population: number;
  };
  progress: {
    completedLevels: number[];
    currentLevel: number;
    achievements: number[];
  };
}
```

---

### Phase 3: Level Design & Content Creation 🟡 HIGH PRIORITY
**Goal**: Create 20+ progressive SQL levels

#### Tasks:
1. **Design Level Structure** (`data/levels.json`)
   ```json
   {
     "levelId": 1,
     "title": "Welcome to SQL Town",
     "description": "Create your first database",
     "difficulty": "beginner",
     "objectives": [
       "Create a database named 'my_city'",
       "Create a table 'citizens' with columns: id, name, age"
     ],
     "initialSchema": "",
     "expectedResult": {
       "type": "schema",
       "tables": ["citizens"],
       "columns": ["id", "name", "age"]
     },
     "hints": [
       "Use CREATE DATABASE statement",
       "Use CREATE TABLE with column definitions"
     ],
     "xpReward": 100,
     "coinsReward": 50,
     "buildingUnlock": "mud_hut"
   }
   ```

2. **Create Level Categories**:
   - **Beginner (Levels 1-5)**: CREATE DATABASE, CREATE TABLE, INSERT
   - **Intermediate (Levels 6-10)**: SELECT, WHERE, UPDATE, DELETE
   - **Advanced (Levels 11-15)**: JOINs, GROUP BY, HAVING
   - **Expert (Levels 16-20)**: Subqueries, CTEs, Window Functions

3. **Build Level Validator** (`services/levelValidator.ts`)
   - Check if query matches expected structure
   - Validate schema changes
   - Compare result sets
   - Award partial credit

4. **Create Level Loader** (`services/levelLoader.ts`)
   - Load level data from JSON
   - Initialize database for level
   - Track level progress

---

### Phase 4: Interactive Lesson Page 🟡 HIGH PRIORITY
**Goal**: Create the main learning interface

#### Tasks:
1. **Build Lesson Page Layout** (`pages/game/LessonPage.tsx`)
   - Split view: Instructions (left) + City (right)
   - Terminal editor at bottom
   - Results display area
   - Navigation controls

2. **Enhance Terminal Editor** (`components/learning/TerminalEditor.tsx`)
   - SQL syntax highlighting
   - Auto-completion
   - Run button
   - Clear button
   - Query history (up/down arrows)

3. **Create Results Display** (`components/learning/ResultsTable.tsx`)
   - Table view for SELECT results
   - Success/error messages
   - Execution time
   - Rows affected

4. **Add Lesson Navigation**
   - Previous/Next level buttons
   - Progress indicator
   - Hint system
   - Skip level option

#### Layout Example:
```
┌─────────────────────────────────────────────────┐
│  Level 1: Create Your First Table              │
├──────────────────┬──────────────────────────────┤
│                  │                              │
│  Instructions    │    City Visualization        │
│  & Objectives    │    (grows as you progress)   │
│                  │                              │
├──────────────────┴──────────────────────────────┤
│  SQL Terminal                                   │
│  > CREATE TABLE...                              │
│  [Run Query] [Clear] [Hint]                     │
├─────────────────────────────────────────────────┤
│  Results                                        │
│  ✓ Table created successfully! +100 XP         │
└─────────────────────────────────────────────────┘
```

---

### Phase 5: Building Placement & City Growth 🟢 MEDIUM PRIORITY
**Goal**: Make city grow dynamically as user progresses

#### Tasks:
1. **Implement Building Placement Logic**
   - Auto-arrange buildings in city
   - Or manual drag-and-drop placement
   - Collision detection
   - Grid snapping

2. **Create Building Animation**
   - Rise from ground animation
   - Fade in effect
   - Celebration particles

3. **Build City Manager** (`services/cityManager.ts`)
   - Add building to city
   - Remove building
   - Upgrade building
   - Calculate population

4. **Connect to Level Completion**
   - Award building on level complete
   - Trigger placement animation
   - Update city stats

---

### Phase 6: Animations & Visual Feedback 🟢 MEDIUM PRIORITY
**Goal**: Make the game feel responsive and fun

#### Tasks:
1. **Query Success Animation**
   - Green flash effect
   - Checkmark icon
   - Coin collection animation
   - XP bar fill animation

2. **Query Failure Animation**
   - Red shake effect
   - Error icon bounce
   - Helpful error tooltip

3. **Level Complete Celebration**
   - Confetti effect
   - Modal with rewards
   - Building unlock reveal
   - Sound effects (optional)

4. **Use Framer Motion**
   ```typescript
   import { motion } from 'framer-motion';
   
   <motion.div
     initial={{ opacity: 0, y: 50 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.5 }}
   >
     {building}
   </motion.div>
   ```

---

### Phase 7: Tutorial & Onboarding 🟢 MEDIUM PRIORITY
**Goal**: Guide new users through the game

#### Tasks:
1. **Create Welcome Modal**
   - Explain game concept
   - Show controls
   - Set expectations

2. **Build Tutorial System** (`components/game/Tutorial.tsx`)
   - Step-by-step tooltips
   - Highlight interactive elements
   - Progress through tutorial steps

3. **Add Contextual Hints**
   - Show hints for current level
   - SQL syntax reminders
   - Common error solutions

4. **Create Help Panel**
   - SQL reference guide
   - Keyboard shortcuts
   - FAQ section

---

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Use Tailwind CSS for styling when possible
- Keep components small and focused
- Write descriptive variable names

### File Naming
- Components: `PascalCase.tsx`
- Services: `camelCase.ts`
- Types: `types.ts` or `interfaces.ts`
- Styles: `ComponentName.css`

### State Management Pattern
```typescript
// Use Context for global state
export const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
```

### Error Handling
```typescript
try {
  const result = await sqlEngine.executeQuery(query);
  if (result.success) {
    // Handle success
  } else {
    // Show user-friendly error
  }
} catch (error) {
  console.error('SQL Error:', error);
  showToast('Something went wrong. Please try again.');
}
```

---

## Testing Checklist

### For Each Feature:
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] No console errors
- [ ] Smooth animations (60 FPS)
- [ ] Accessible (keyboard navigation)
- [ ] Error states handled
- [ ] Loading states shown

### For SQL Engine:
- [ ] Handles valid queries correctly
- [ ] Shows helpful error messages
- [ ] Executes within 100ms
- [ ] Supports all SQL command types
- [ ] Resets database properly

### For Game State:
- [ ] Saves progress reliably
- [ ] Loads saved state correctly
- [ ] No data loss on refresh
- [ ] XP/coins calculate accurately

---

## Quick Start Commands

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

---

## Key Design Principles

1. **Learning First**: The game should teach SQL effectively, not just entertain
2. **Progressive Difficulty**: Start easy, gradually increase complexity
3. **Immediate Feedback**: Show results instantly, explain errors clearly
4. **Visual Rewards**: Make progress visible through city growth
5. **No Frustration**: Provide hints, allow retries, never punish failure
6. **Accessibility**: Keyboard shortcuts, screen reader support, clear UI

---

## Success Metrics

### Technical:
- Query execution < 100ms
- 60 FPS animations
- < 2s page load time
- Zero data loss

### User Experience:
- 90%+ first level completion rate
- < 5 minutes to first success
- Clear progression path
- Engaging city visualization

---

## Resources & References

### Documentation:
- **SQL.js**: https://sql.js.org/
- **React**: https://react.dev
- **Framer Motion**: https://www.framer.com/motion
- **Tailwind CSS**: https://tailwindcss.com

### Game Inspiration:
- **Duolingo**: Gamified learning, XP system
- **SimCity**: City building mechanics
- **Codecademy**: Interactive coding lessons
- **Khan Academy**: Progressive learning paths

---

## Current Priority Order

1. **Phase 1**: SQL Engine Integration (CRITICAL - enables all gameplay)
2. **Phase 2**: Game State & Progression (CRITICAL - enables saving progress)
3. **Phase 4**: Interactive Lesson Page (HIGH - main user interface)
4. **Phase 3**: Level Content Creation (HIGH - provides learning material)
5. **Phase 5**: Building Placement (MEDIUM - enhances visual feedback)
6. **Phase 6**: Animations (MEDIUM - improves user experience)
7. **Phase 7**: Tutorial (MEDIUM - helps onboarding)

---

## Example User Flow

1. User opens GameZone
2. Sees welcome modal explaining the concept
3. Starts Level 1: "Create Your First Table"
4. Reads instructions on left side
5. Types SQL query in terminal editor
6. Clicks "Run Query"
7. SQL.js executes query
8. Results shown below terminal
9. If correct: ✓ Success animation, +100 XP, +50 coins, building appears in city
10. If incorrect: ✗ Error message with hint, can retry
11. Clicks "Next Level" to continue
12. City grows with each completed level
13. Can visit Market to see all buildings
14. Progress auto-saved to localStorage

---

## Common Pitfalls to Avoid

1. **Don't** make SQL validation too strict (allow different valid approaches)
2. **Don't** punish users for mistakes (unlimited retries)
3. **Don't** block progress (allow skipping levels)
4. **Don't** overwhelm with too much info at once
5. **Don't** forget mobile users (responsive design)
6. **Don't** ignore performance (optimize animations)
7. **Don't** skip error handling (graceful failures)

---

## Next Steps

Start with **Phase 1: SQL Engine Integration**. This is the foundation that enables all other features. Once the SQL engine works, you can build the game state system, then create the interactive lesson page, and finally add polish with animations and tutorials.

Good luck building GameZone! 🏙️✨
