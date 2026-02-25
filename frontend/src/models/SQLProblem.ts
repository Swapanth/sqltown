export interface SQLColumn {
  name: string;
  type: string;
  constraints?: string[];
}

export interface SQLTable {
  name: string;
  columns: SQLColumn[];
  sampleData?: string[][];
}

export interface SQLExample {
  description: string;
  expectedColumns: string[];
  expectedOutput: string[][];
  explanation?: string;
}

export interface SQLTestCase {
  id: number;
  description: string;
  expectedColumns: string[];
  expectedOutput: string[][];
}

export interface SQLProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies?: string[];
  acceptance: number;
  description: string;
  schema: {
    tables: SQLTable[];
  };
  examples: SQLExample[];
  testCases: SQLTestCase[];
  solution?: string;
  hints?: string[];
}