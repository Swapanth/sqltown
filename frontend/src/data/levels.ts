import type { GameLevelSchema } from '../services/gameDatabase';

export interface GameLevel {
  id: number;
  title: string;
  description: string;
  sqlCommand: string;
  expectedResult: string;
  cityChange: string;
  difficulty: 'green' | 'yellow' | 'orange' | 'blue';
  isNew?: boolean;
  schema: GameLevelSchema;
  xpReward?: number;
  coinReward?: number;
}

/**
 * SQLTown Game Levels
 * Each level has a specific SQL task that unlocks city elements
 */
export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    title: 'Create City',
    description: 'CREATE DATABASE → land',
    sqlCommand: 'CREATE DATABASE vrindavan;',
    expectedResult: "Database 'vrindavan' created successfully",
    cityChange: 'Empty land appears',
    difficulty: 'green',
    schema: {
      tables: [
        {
          name: 'city_metadata',
          createStatement: `
            CREATE TABLE city_metadata (
              id INTEGER PRIMARY KEY,
              name TEXT,
              created_at DATETIME
            );
          `,
        },
      ],
    },
    xpReward: 10,
    coinReward: 50,
  },
  {
    id: 2,
    title: 'Create Dharamshala',
    description: 'CREATE TABLE → building foundation',
    sqlCommand: `CREATE TABLE dharamshala (
  id INT PRIMARY KEY,
  name TEXT,
  capacity INT
);`,
    expectedResult: "Table 'dharamshala' created",
    cityChange: 'Foundation appears',
    difficulty: 'green',
    schema: {
      tables: [
        {
          name: 'dharamshala',
          createStatement: `
            CREATE TABLE dharamshala (
              id INTEGER PRIMARY KEY,
              name TEXT,
              capacity INTEGER
            );
          `,
        },
      ],
    },
    xpReward: 15,
    coinReward: 75,
  },
  {
    id: 3,
    title: 'Build Dharamshala',
    description: 'INSERT → building appears',
    sqlCommand: `INSERT INTO dharamshala (id, name, capacity)
VALUES (1, 'Sacred Rest House', 50);`,
    expectedResult: '1 row inserted',
    cityChange: 'Dharamshala building rises',
    difficulty: 'green',
    schema: {
      tables: [
        {
          name: 'dharamshala',
          createStatement: `
            CREATE TABLE dharamshala (
              id INTEGER PRIMARY KEY,
              name TEXT,
              capacity INTEGER
            );
          `,
        },
      ],
    },
    xpReward: 20,
    coinReward: 100,
  },
  {
    id: 4,
    title: 'Add Pilgrims Table',
    description: 'CREATE TABLE pilgrims → population layer unlocked',
    sqlCommand: `CREATE TABLE pilgrims (
  id INT PRIMARY KEY,
  name TEXT
);`,
    expectedResult: "Table 'pilgrims' created",
    cityChange: 'Population layer unlocked',
    difficulty: 'green',
    isNew: true,
    schema: {
      tables: [
        {
          name: 'dharamshala',
          createStatement: `
            CREATE TABLE dharamshala (
              id INTEGER PRIMARY KEY,
              name TEXT,
              capacity INTEGER
            );
          `,
        },
        {
          name: 'pilgrims',
          createStatement: `
            CREATE TABLE pilgrims (
              id INTEGER PRIMARY KEY,
              name TEXT
            );
          `,
        },
      ],
    },
    xpReward: 25,
    coinReward: 125,
  },
  {
    id: 5,
    title: 'Populate Dharamshala',
    description: 'INSERT pilgrims → people appear near dharamshala',
    sqlCommand: `INSERT INTO pilgrims (id, name)
VALUES 
  (1, 'Radha'),
  (2, 'Krishna');`,
    expectedResult: '2 rows inserted',
    cityChange: '👉 City becomes alive - people appear!',
    difficulty: 'yellow',
    isNew: true,
    schema: {
      tables: [
        {
          name: 'dharamshala',
          createStatement: `
            CREATE TABLE dharamshala (
              id INTEGER PRIMARY KEY,
              name TEXT,
              capacity INTEGER
            );
          `,
        },
        {
          name: 'pilgrims',
          createStatement: `
            CREATE TABLE pilgrims (
              id INTEGER PRIMARY KEY,
              name TEXT
            );
          `,
        },
      ],
    },
    xpReward: 30,
    coinReward: 150,
  },
  {
    id: 6,
    title: 'Count Pilgrims',
    description: 'SELECT COUNT(*) → occupancy indicator appears',
    sqlCommand: `SELECT COUNT(*) as total_pilgrims
FROM pilgrims;`,
    expectedResult: 'total_pilgrims: 2',
    cityChange: 'Occupancy indicator appears above dharamshala',
    difficulty: 'yellow',
    isNew: true,
    schema: {
      tables: [
        {
          name: 'dharamshala',
          createStatement: `
            CREATE TABLE dharamshala (
              id INTEGER PRIMARY KEY,
              name TEXT,
              capacity INTEGER
            );
          `,
        },
        {
          name: 'pilgrims',
          createStatement: `
            CREATE TABLE pilgrims (
              id INTEGER PRIMARY KEY,
              name TEXT
            );
          `,
        },
      ],
    },
    xpReward: 35,
    coinReward: 175,
  },
  {
    id: 7,
    title: 'Upgrade Dharamshala',
    description: 'UPDATE capacity → taller building',
    sqlCommand: `UPDATE dharamshala 
SET capacity = 100 
WHERE id = 1;`,
    expectedResult: '1 row updated',
    cityChange: 'Dharamshala grows taller',
    difficulty: 'yellow',
    schema: {
      tables: [
        {
          name: 'dharamshala',
          createStatement: `
            CREATE TABLE dharamshala (
              id INTEGER PRIMARY KEY,
              name TEXT,
              capacity INTEGER
            );
          `,
        },
      ],
    },
    xpReward: 40,
    coinReward: 200,
  },
  {
    id: 8,
    title: 'Create Temple',
    description: 'CREATE TABLE temple → foundation',
    sqlCommand: `CREATE TABLE temple (
  id INT PRIMARY KEY,
  name TEXT,
  deity TEXT
);`,
    expectedResult: "Table 'temple' created",
    cityChange: 'Temple foundation appears',
    difficulty: 'orange',
    schema: {
      tables: [
        {
          name: 'temple',
          createStatement: `
            CREATE TABLE temple (
              id INTEGER PRIMARY KEY,
              name TEXT,
              deity TEXT
            );
          `,
        },
      ],
    },
    xpReward: 45,
    coinReward: 225,
  },
  {
    id: 9,
    title: 'Connect Pilgrims to Temple',
    description: 'ALTER TABLE → path logic unlocked',
    sqlCommand: `ALTER TABLE pilgrims 
ADD COLUMN temple_id INT;`,
    expectedResult: "Column 'temple_id' added",
    cityChange: 'Path logic unlocked - connections visible',
    difficulty: 'orange',
    isNew: true,
    schema: {
      tables: [
        {
          name: 'pilgrims',
          createStatement: `
            CREATE TABLE pilgrims (
              id INTEGER PRIMARY KEY,
              name TEXT,
              temple_id INTEGER
            );
          `,
        },
        {
          name: 'temple',
          createStatement: `
            CREATE TABLE temple (
              id INTEGER PRIMARY KEY,
              name TEXT,
              deity TEXT
            );
          `,
        },
      ],
    },
    xpReward: 50,
    coinReward: 250,
  },
  {
    id: 10,
    title: 'Pilgrims Visit Temple',
    description: 'UPDATE pilgrims → pilgrims move dharamshala → temple',
    sqlCommand: `UPDATE pilgrims 
SET temple_id = 1 
WHERE id IN (1, 2);`,
    expectedResult: '2 rows updated',
    cityChange: '🎉 First active city - pilgrims move between buildings!',
    difficulty: 'blue',
    isNew: true,
    schema: {
      tables: [
        {
          name: 'pilgrims',
          createStatement: `
            CREATE TABLE pilgrims (
              id INTEGER PRIMARY KEY,
              name TEXT,
              temple_id INTEGER
            );
          `,
        },
        {
          name: 'temple',
          createStatement: `
            CREATE TABLE temple (
              id INTEGER PRIMARY KEY,
              name TEXT,
              deity TEXT
            );
          `,
        },
      ],
    },
    xpReward: 60,
    coinReward: 300,
  },
];
