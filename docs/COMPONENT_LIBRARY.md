# SQLTown - Component Library Specifications

## 🎨 Design System Tokens

### Colors
```javascript
export const colors = {
  // Primary
  primary: '#E67350',        // Terracotta Orange
  primaryHover: '#d15d3f',
  primaryLight: 'rgba(230, 115, 80, 0.1)',
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray700: '#374151',
  gray900: '#111827',
  
  // Semantic
  success: '#28C840',
  successLight: 'rgba(40, 200, 64, 0.1)',
  error: '#FF5F57',
  errorLight: 'rgba(255, 95, 87, 0.1)',
  warning: '#FEBC2E',
  warningLight: 'rgba(254, 188, 46, 0.1)',
  info: '#a9c1ed',
  infoLight: 'rgba(169, 193, 237, 0.1)',
  
  // Terminal
  terminalBg: '#000000',
  terminalBorder: '#3a3d42',
  terminalPrompt: '#E67350',
  terminalText: '#FFFFFF',
  terminalKeyword: '#E67350',
  terminalString: '#28C840',
  terminalComment: '#6b7280',
  
  // City/Game
  skyBlue: '#a9c1ed',
  sunYellow: '#FDB813',
  grassGreen: '#7CB342',
  buildingBrown: '#8D6E63'
};
```

### Typography
```javascript
export const typography = {
  fontFamily: {
    heading: "'Playfair Display', serif",
    body: "'Syne', sans-serif",
    code: "'JetBrains Mono', monospace"
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  }
};
```

### Spacing
```javascript
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
};
```

### Border Radius
```javascript
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  full: '9999px'
};
```

### Shadows
```javascript
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
  terminal: '0 20px 60px rgba(0, 0, 0, 0.25)'
};
```

---

## 📦 Common Components

### 1. Button Component

#### Props:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  children: ReactNode;
}
```

#### Variants:
```jsx
// Primary (Default)
<Button variant="primary">
  Primary Button
</Button>
// Style: bg-primary, text-white, hover effect

// Secondary
<Button variant="secondary">
  Secondary Button
</Button>
// Style: bg-gray-100, text-black, hover effect

// Outline
<Button variant="outline">
  Outline Button
</Button>
// Style: border-primary, text-primary, transparent bg

// Ghost
<Button variant="ghost">
  Ghost Button
</Button>
// Style: no border, text-gray-700, hover bg-gray-100

// Danger
<Button variant="danger">
  Delete
</Button>
// Style: bg-error, text-white
```

#### Sizes:
```jsx
<Button size="sm">Small</Button>    // padding: 0.5rem 1rem, font: sm
<Button size="md">Medium</Button>   // padding: 0.75rem 1.5rem, font: base
<Button size="lg">Large</Button>    // padding: 1rem 2rem, font: lg
```

#### With Icons:
```jsx
<Button leftIcon={<PlayIcon />}>
  Start Lesson
</Button>

<Button rightIcon={<ArrowRightIcon />}>
  Continue
</Button>
```

#### Loading State:
```jsx
<Button loading>
  <Spinner /> Processing...
</Button>
```

---

### 2. Card Component

#### Props:
```typescript
interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  shadow?: 'sm' | 'base' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
}
```

#### Example:
```jsx
<Card padding="lg" hover shadow="md">
  <CardHeader>
    <CardTitle>Lesson 1.2</CardTitle>
    <CardSubtitle>SELECT Statement</CardSubtitle>
  </CardHeader>
  
  <CardBody>
    Learn the basics of retrieving data...
  </CardBody>
  
  <CardFooter>
    <Button>Start Lesson</Button>
  </CardFooter>
</Card>
```

#### Variants:
```jsx
// Lesson Card
<LessonCard
  lesson={lessonData}
  progress={65}
  status="in_progress"
/>

// Quest Card
<QuestCard
  quest={questData}
  objectives={[...]}
  rewards={[...]}
/>

// Building Card
<BuildingCard
  building={buildingData}
  level={3}
  cost={500}
/>
```

---

### 3. Input Component

#### Props:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}
```

#### Example:
```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={setEmail}
  leftIcon={<MailIcon />}
  error={emailError}
/>
```

#### States:
```jsx
// Normal
<Input label="Username" />

// With Error
<Input 
  label="Email" 
  error="Invalid email format"
/>

// Disabled
<Input 
  label="Username" 
  disabled 
  value="locked_user"
/>

// With Icons
<Input 
  leftIcon={<SearchIcon />}
  placeholder="Search..."
/>
```

---

### 4. Modal Component

#### Props:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlay?: boolean;
  children: ReactNode;
}
```

#### Example:
```jsx
<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="Achievement Unlocked!"
  size="md"
>
  <ModalBody>
    <AchievementDisplay achievement={achievement} />
  </ModalBody>
  
  <ModalFooter>
    <Button onClick={handleClose}>Awesome!</Button>
  </ModalFooter>
</Modal>
```

#### Variants:
```jsx
// Confirmation Modal
<ConfirmModal
  title="Delete Building?"
  message="This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>

// Achievement Modal
<AchievementModal
  achievement={achievementData}
  onClose={handleClose}
/>

// Level Up Modal
<LevelUpModal
  oldLevel={5}
  newLevel={6}
  unlocks={unlockedFeatures}
  onClose={handleClose}
/>
```

---

### 5. Toast/Notification Component

#### Props:
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // milliseconds, default 3000
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
```

#### Usage:
```jsx
// Via hook
const { showToast } = useToast();

showToast({
  type: 'success',
  message: 'Lesson completed! +50 XP',
  duration: 3000
});
```

#### Types:
```jsx
// Success
<Toast 
  type="success" 
  message="✅ Lesson completed!"
/>

// Error
<Toast 
  type="error" 
  message="❌ Failed to save progress"
/>

// Warning
<Toast 
  type="warning" 
  message="⚠️ Low on coins!"
/>

// Info
<Toast 
  type="info" 
  message="💡 New quest available"
/>
```

---

### 6. Progress Bar Component

#### Props:
```typescript
interface ProgressBarProps {
  value: number;        // 0-100
  max?: number;         // default 100
  color?: string;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}
```

#### Examples:
```jsx
// Linear Progress
<ProgressBar 
  value={65} 
  showLabel 
  label="65% Complete"
/>

// XP Bar
<XPBar 
  currentXP={2340}
  nextLevelXP={3000}
  level={5}
/>

// Circular Progress
<CircularProgress 
  value={75}
  size={120}
  strokeWidth={10}
/>
```

---

## 🎮 Game Components

### 7. CityVisualization Component

#### Props:
```typescript
interface CityVisualizationProps {
  city: CityData;
  interactive?: boolean;  // Can drag/click buildings
  mode?: 'view' | 'edit'; // View-only or edit mode
  onBuildingClick?: (building: Building) => void;
  onEmptyPlotClick?: (position: Position) => void;
  animated?: boolean;
}
```

#### Structure:
```jsx
<CityVisualization 
  city={userCity}
  mode="edit"
  animated
>
  {/* Sky Layer */}
  <Sky>
    <Sun />
    <Clouds />
  </Sky>
  
  {/* Background Layer */}
  <Background>
    <DistantBuildings />
  </Background>
  
  {/* Buildings Layer */}
  <BuildingsLayer>
    {city.buildings.map(building => (
      <BuildingComponent 
        key={building.id}
        building={building}
        onClick={handleBuildingClick}
      />
    ))}
  </BuildingsLayer>
  
  {/* Foreground Layer */}
  <Foreground>
    <StreetLamps />
    <Trees />
    <WalkingCharacters />
  </Foreground>
</CityVisualization>
```

#### Building Types:
```jsx
// Dharamshala (Table)
<Dharamshala 
  level={2}
  data={tableData}
  animated
/>

// Temple (View)
<Temple 
  level={3}
  data={viewData}
  animated
/>

// Ashram (Stored Procedure)
<Ashram 
  level={1}
  data={procedureData}
  chimneySmoke
/>

// Pilgrim (Row/Data)
<Pilgrim 
  path={walkingPath}
  speed={1}
  direction="right"
/>
```

---

### 8. BuildingCard Component

#### Props:
```typescript
interface BuildingCardProps {
  building: BuildingType;
  level: number;
  cost: number;
  unlockLevel?: number;
  locked?: boolean;
  owned?: boolean;
  onBuild?: () => void;
  onUpgrade?: () => void;
}
```

#### Example:
```jsx
<BuildingCard
  building={{
    id: 1,
    name: 'Market',
    icon: '🏪',
    description: 'Trade goods with other cities',
    category: 'commercial'
  }}
  level={3}
  cost={500}
  unlockLevel={3}
  onBuild={handleBuildMarket}
/>
```

#### States:
```jsx
// Available
<BuildingCard 
  building={marketBuilding}
  cost={500}
  onBuild={handleBuild}
/>

// Locked
<BuildingCard 
  building={theatreBuilding}
  cost={1000}
  unlockLevel={5}
  locked
/>

// Owned - Can Upgrade
<BuildingCard 
  building={dharamshala}
  level={2}
  cost={300}
  owned
  onUpgrade={handleUpgrade}
/>
```

---

### 9. TerminalEditor Component

#### Props:
```typescript
interface TerminalEditorProps {
  value: string;
  onChange: (value: string) => void;
  dialect: 'mysql' | 'postgresql' | 'sqlite' | 'oracle' | 'mssql';
  readOnly?: boolean;
  height?: string;
  onRun?: () => void;
  placeholder?: string;
  showLineNumbers?: boolean;
  syntaxHighlight?: boolean;
}
```

#### Example:
```jsx
<TerminalEditor
  value={sqlCode}
  onChange={setSqlCode}
  dialect="mysql"
  height="300px"
  onRun={handleRunQuery}
  placeholder="-- Write your SQL query here"
  showLineNumbers
  syntaxHighlight
/>
```

#### Features:
- Syntax highlighting based on dialect
- Auto-completion
- Error highlighting
- Line numbers
- Theme: Terminal-style dark background
- Keyboard shortcuts (Ctrl+Enter to run)

#### With Results:
```jsx
<TerminalWindow>
  <TerminalHeader>
    <TerminalButtons />
    <TerminalTitle>mysql@sqltown — zsh</TerminalTitle>
  </TerminalHeader>
  
  <TerminalContent>
    <TerminalEditor {...editorProps} />
    
    {results && (
      <TerminalResults>
        <ResultsTable data={results} />
      </TerminalResults>
    )}
    
    {error && (
      <TerminalError>
        ❌ {error.message}
      </TerminalError>
    )}
  </TerminalContent>
  
  <TerminalFooter>
    <Button onClick={handleRun}>Run Query</Button>
    <Button variant="ghost" onClick={handleReset}>Reset</Button>
  </TerminalFooter>
</TerminalWindow>
```

---

### 10. XPBar Component

#### Props:
```typescript
interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  showDetails?: boolean;
  animated?: boolean;
}
```

#### Example:
```jsx
<XPBar 
  currentXP={2340}
  nextLevelXP={3000}
  level={5}
  showDetails
  animated
/>
```

#### Rendered as:
```
┌────────────────────────────────────────┐
│ Level 5                       2340/3000│
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 78%        │
└────────────────────────────────────────┘
```

#### With Animation:
```jsx
// When XP increases
<XPBar 
  currentXP={2340}
  // Animates from old to new value
  animated
/>

// Shows floating +XP text
<FloatingXP value={50} />
```

---

### 11. QuestCard Component

#### Props:
```typescript
interface QuestCardProps {
  quest: Quest;
  progress?: QuestProgress;
  onStart?: () => void;
  onContinue?: () => void;
  compact?: boolean;
}
```

#### Example:
```jsx
<QuestCard
  quest={{
    id: 1,
    title: 'The Foundation',
    description: 'Build your first dharamshala table',
    type: 'main',
    difficulty: 'easy',
    objectives: [
      { id: 1, text: 'Complete Lesson 1.1', done: true },
      { id: 2, text: 'Create a table', done: true },
      { id: 3, text: 'Insert data', done: false }
    ],
    rewards: {
      xp: 500,
      coins: 200,
      achievement: 'City Founder'
    }
  }}
  progress={{
    status: 'in_progress',
    completedObjectives: 2,
    totalObjectives: 3
  }}
  onContinue={handleContinue}
/>
```

#### Rendered as:
```
┌─────────────────────────────────────────┐
│ 📜 The Foundation                       │
│ Main Quest • Easy                       │
├─────────────────────────────────────────┤
│ Build your first dharamshala table      │
│                                         │
│ Progress: ▓▓░ 2/3 objectives            │
│                                         │
│ ✅ Complete Lesson 1.1                  │
│ ✅ Create a table                       │
│ ⏳ Insert data                          │
│                                         │
│ Rewards:                                │
│ 🎯 500 XP  💰 200 Coins  🏆 Achievement│
│                                         │
│ [Continue Quest →]                     │
└─────────────────────────────────────────┘
```

---

### 12. LeaderboardTable Component

#### Props:
```typescript
interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: number;
  highlightUser?: boolean;
  onUserClick?: (userId: number) => void;
}
```

#### Example:
```jsx
<LeaderboardTable
  entries={leaderboardData}
  currentUserId={1}
  highlightUser
  onUserClick={handleUserClick}
/>
```

#### Rendered as:
```
┌─────────────────────────────────────────────────────┐
│ Rank  User          Level    XP        Dialect      │
├─────────────────────────────────────────────────────┤
│  🥇  Bhardwaj        42    125,340    MySQL        │
│  🥈  Priya_SQL       38     98,230    PostgreSQL   │
│  🥉  CodeGuru        35     87,120    MySQL        │
│  4   RamDev          32     75,890    SQLite       │
│  ...                                                │
│ 142  You (Swapanth)   5      2,340    MySQL  ←    │ Highlighted
└─────────────────────────────────────────────────────┘
```

---

### 13. DialectSelector Component

#### Props:
```typescript
interface DialectSelectorProps {
  selected: string;
  onSelect: (dialect: string) => void;
  dialects: Dialect[];
  showLogos?: boolean;
}
```

#### Example:
```jsx
<DialectSelector
  selected="mysql"
  onSelect={handleDialectChange}
  dialects={availableDialects}
  showLogos
/>
```

#### Rendered as:
```
┌─────────────────────────────────────────┐
│ Choose SQL Dialect:                     │
├─────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │ [Logo] │ │ [Logo] │ │ [Logo] │       │
│ │ MySQL  │ │Postgres│ │SQLite  │       │
│ │   ✓    │ │        │ │        │       │
│ └────────┘ └────────┘ └────────┘       │
└─────────────────────────────────────────┘
```

---

## 📋 Learning Components

### 14. LessonCard Component

```jsx
<LessonCard
  lesson={{
    id: 2,
    number: '1.2',
    title: 'SELECT Statement',
    type: 'tutorial',
    duration: 15,
    xpReward: 50
  }}
  progress={{
    status: 'in_progress',
    percentage: 65
  }}
  onClick={handleLessonClick}
/>
```

#### Rendered:
```
┌─────────────────────────┐
│ 1.2 SELECT Statement    │
│ Tutorial • 15 min       │
├─────────────────────────┤
│ ▓▓▓▓▓▓▓░░░ 65%         │
│                         │
│ In Progress ⏳          │
│ +50 XP                  │
└─────────────────────────┘
```

---

### 15. ChapterCard Component

```jsx
<ChapterCard
  chapter={{
    number: 1,
    title: 'Database Basics',
    lessons: 8,
    completedLessons: 5
  }}
  onClick={handleChapterClick}
/>
```

---

### 16. CodeExample Component

```jsx
<CodeExample
  code={sqlCode}
  dialect="mysql"
  title="Example: Basic SELECT"
  explanation="This query retrieves all columns..."
  highlightLines={[2, 3]}
  showCopy
/>
```

---

### 17. CommentSection Component

```jsx
<CommentSection
  targetType="city"
  targetId={cityId}
  comments={comments}
  onAddComment={handleAddComment}
  onLikeComment={handleLikeComment}
/>
```

---

## 🎨 Animation Components

### 18. LoadingSpinner

```jsx
<LoadingSpinner size="md" color="primary" />
```

Variants:
- Circular spinner
- Building construction animation
- Pulse dots
- Skeleton screens

---

### 19. ConfettiAnimation

```jsx
<ConfettiAnimation 
  trigger={questCompleted}
  duration={3000}
/>
```

---

### 20. FloatingText

```jsx
<FloatingText 
  text="+50 XP"
  color="success"
  duration={2000}
  origin={buttonPosition}
/>
```

---

## 🔧 Utility Components

### 21. Tooltip

```jsx
<Tooltip content="Complete this lesson to unlock">
  <Button disabled>Locked Lesson</Button>
</Tooltip>
```

---

### 22. Dropdown

```jsx
<Dropdown
  trigger={<Button>Options</Button>}
  items={[
    { label: 'Edit', icon: <EditIcon />, onClick: handleEdit },
    { label: 'Delete', icon: <DeleteIcon />, onClick: handleDelete }
  ]}
/>
```

---

### 23. Tabs

```jsx
<Tabs defaultActive="mysql">
  <TabList>
    <Tab value="mysql">MySQL</Tab>
    <Tab value="postgresql">PostgreSQL</Tab>
    <Tab value="sqlite">SQLite</Tab>
  </TabList>
  
  <TabPanel value="mysql">
    <CodeExample code={mysqlCode} />
  </TabPanel>
  
  <TabPanel value="postgresql">
    <CodeExample code={postgresCode} />
  </TabPanel>
  
  <TabPanel value="sqlite">
    <CodeExample code={sqliteCode} />
  </TabPanel>
</Tabs>
```

---

### 24. Badge

```jsx
<Badge variant="success">Completed</Badge>
<Badge variant="warning">In Progress</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">New</Badge>
```

---

### 25. Avatar

```jsx
<Avatar 
  src="/avatars/user1.png"
  alt="Swapanth"
  size="md"
  fallback="S"
/>
```

---

## 📱 Layout Components

### 26. Header

```jsx
<Header>
  <HeaderLeft>
    <Logo />
    <Navigation />
  </HeaderLeft>
  
  <HeaderRight>
    <CoinsDisplay coins={1500} />
    <XPBar currentXP={2340} nextLevelXP={3000} level={5} />
    <NotificationBell count={3} />
    <UserMenu />
  </HeaderRight>
</Header>
```

---

### 27. Sidebar

```jsx
<Sidebar collapsed={isCollapsed}>
  <SidebarHeader>
    <Logo />
  </SidebarHeader>
  
  <SidebarNav>
    <NavItem icon={<HomeIcon />} to="/dashboard">
      Dashboard
    </NavItem>
    <NavItem icon={<BookIcon />} to="/learn">
      Learn
    </NavItem>
    {/* ... */}
  </SidebarNav>
  
  <SidebarFooter>
    <NavItem icon={<SettingsIcon />} to="/settings">
      Settings
    </NavItem>
  </SidebarFooter>
</Sidebar>
```

---

### 28. Container

```jsx
<Container maxWidth="lg">
  <ContentHere />
</Container>
```

---

## 🎯 Component Composition Examples

### Full Lesson Page:
```jsx
<LessonPage>
  <LessonHeader>
    <BackButton />
    <LessonTitle>1.2: SELECT Statement</LessonTitle>
    <LessonProgress percentage={0} />
  </LessonHeader>
  
  <LessonGrid>
    <LessonContent>
      <MarkdownContent content={lessonText} />
      
      <CodeExample 
        code={exampleCode}
        dialect={selectedDialect}
      />
      
      <InteractiveChallenge>
        <ChallengePrompt>
          Write a query to select all users
        </ChallengePrompt>
        
        <TerminalEditor 
          value={userCode}
          onChange={setUserCode}
          onRun={handleRunCode}
        />
        
        <ChallengeResults>
          {results && <ResultsTable data={results} />}
          {error && <ErrorMessage error={error} />}
        </ChallengeResults>
      </InteractiveChallenge>
      
      <LessonNavigation>
        <Button variant="outline" onClick={goPrevious}>
          ← Previous
        </Button>
        <Button onClick={completeLesson}>
          Complete Lesson
        </Button>
      </LessonNavigation>
    </LessonContent>
    
    <CityVisualization 
      city={userCity}
      mode="view"
      animated
    />
  </LessonGrid>
</LessonPage>
```

This component library provides everything needed to build the SQLTown frontend! 🎨✨
