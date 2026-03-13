import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchQuestionById, fetchQuestions } from "../../services/questionService";
import apiClient from "../../services/apiClient";
import { useAuth } from '../../context/AuthContext';
import { interviewService } from '../../services/interviewService';

interface SQLProblem {
  id: number;
  title: string;
  difficulty: string;
  topics: string[];
  companies: string[];
  acceptance: number;
  description: string;
  schema: {
    tables: any[];
  };
  examples: any[];
  testCases: any[];
  solution: string;
  hints: string[];
}

interface EditableTestTable {
  name: string;
  columns: Array<{
    name: string;
    type: string;
    constraints?: string[];
  }>;
  rows: string[][];
}

interface EditableTestCase {
  id: number;
  label: string;
  tables: EditableTestTable[];
}

interface Submission {
  id: number;
  status: 'Accepted' | 'Rejected';
  submittedAt: Date;
  language: string;
  runtime?: number;
  runtimePercentile?: number;
  code: string;
  testsPassed?: number;
  testsTotal?: number;
  visibleTestsPassed?: number;
  visibleTestsTotal?: number;
  hiddenTestsPassed?: number;
  hiddenTestsTotal?: number;
}

interface ExecutionSummary {
  mode: 'run' | 'submit';
  passedCount: number;
  totalCount: number;
  visiblePassedCount: number;
  visibleCount: number;
  hiddenPassedCount: number;
  hiddenCount: number;
}

interface ExecutionDetail {
  testCase: number;
  label: string;
  passed: boolean;
  expectedOutput: unknown;
  actualOutput: unknown;
  inputTables: EditableTestTable[];
}

interface SubmissionGlassyTheme {
  rowBg: string;
  rowHover: string;
  dotColor: string;
  statusColor: string;
  chipClass: string;
  glowClass: string;
  runtimeIconColor: string;
}

type DiscussionPostType = 'Question' | 'Tip' | 'General';

interface DiscussionReply {
  id: number;
  author: string;
  initials: string;
  text: string;
  createdAt: Date;
}

interface DiscussionPost {
  id: number;
  author: string;
  initials: string;
  type: DiscussionPostType;
  title: string;
  lines: string[];
  createdAt: Date;
  votes: number;
  userVote: -1 | 0 | 1;
  replies: DiscussionReply[];
}

interface RuntimeChartData {
  bins: number[];
  minRuntime: number;
  maxRuntime: number;
  highlightedIndex: number;
  highlightedRatio: number;
  beatsPercent: number;
  densityPercent: number;
  yAxisLabels: number[];
  xAxisLabels: number[];
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}

interface ExecutionCardTheme {
  cardClass: string;
  badgeClass: string;
  glowClass: string;
  expectedOutputCardClass: string;
  actualOutputCardClass: string;
}

interface ResultTableData {
  columns: string[];
  rows: string[][];
}

interface HighlightableResultTableProps {
  tableData: ResultTableData;
  maxHeightClass?: string;
  emptyMessage?: string;
}

const DISCUSSION_PAGE_SIZE = 4;
const SUBMISSION_PAGE_SIZE = 8;

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemLabel,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 sm:text-sm">
      <span>
        {itemLabel}: {totalItems}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded border border-gray-300 px-2.5 py-1 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded border border-gray-300 px-2.5 py-1 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const createDiscussionSeedForProblem = (problemId: number): DiscussionPost[] => {
  if (problemId === 1) {
    return [
      {
        id: 1,
        author: 'Ankit Kumar',
        initials: 'AK',
        type: 'Question',
        title: 'Why are we using LEFT JOIN here?',
        lines: [
          'Why cannot we use RIGHT JOIN or FULL OUTER JOIN in this case?',
          'Can somebody explain how to identify when to use LEFT JOIN vs RIGHT JOIN?',
          'Sorry for the beginner question.',
        ],
        createdAt: new Date('2020-11-16T10:00:00'),
        votes: 52,
        userVote: 0,
        replies: [
          {
            id: 1,
            author: 'Sonia M',
            initials: 'SM',
            text: 'LEFT JOIN keeps all rows from the left table. In this problem we need all employees, even if some have no matching bonus rows.',
            createdAt: new Date('2020-11-16T11:10:00'),
          },
        ],
      },
    ];
  }

  if (problemId === 2) {
    return [
      {
        id: 1,
        author: 'Edoc',
        initials: 'ED',
        type: 'Tip',
        title: 'Mandarin explanation available',
        lines: [
          'Hi everyone, I posted a Mandarin Chinese explanation for this problem.',
          'Hope it helps if you are learning SQL and English at the same time.',
        ],
        createdAt: new Date('2019-08-27T08:30:00'),
        votes: 23,
        userVote: 0,
        replies: [],
      },
    ];
  }

  return [];
};

const toInitials = (name: string) => {
  const parts = (name || 'User').split(' ').filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'US';
};

const mapSubmissionFromApi = (submission: any): Submission => ({
  id: submission.id,
  status: submission.status,
  submittedAt: new Date(submission.created_at),
  language: submission.language || 'MySQL',
  runtime: submission.runtime_ms ?? undefined,
  code: submission.code || '',
  testsPassed: submission.tests_passed ?? 0,
  testsTotal: submission.tests_total ?? 0,
  visibleTestsPassed: submission.visible_tests_passed ?? 0,
  visibleTestsTotal: submission.visible_tests_total ?? 0,
  hiddenTestsPassed: submission.hidden_tests_passed ?? 0,
  hiddenTestsTotal: submission.hidden_tests_total ?? 0,
});

const mapDiscussionFromApi = (post: any): DiscussionPost => ({
  id: post.id,
  author: post.author?.name || post.author?.email || 'User',
  initials: toInitials(post.author?.name || post.author?.email || 'User'),
  type: (post.post_type === 'Reply' ? 'General' : post.post_type) as DiscussionPostType,
  title: post.title || 'Discussion',
  lines: (post.content || '').split('\n').filter(Boolean),
  createdAt: new Date(post.created_at),
  votes: post.votes || 0,
  userVote: 0,
  replies: (post.replies || []).map((reply: any) => ({
    id: reply.id,
    author: reply.author?.name || reply.author?.email || 'User',
    initials: toInitials(reply.author?.name || reply.author?.email || 'User'),
    text: reply.content || '',
    createdAt: new Date(reply.created_at),
  })),
});

const formatSubmissionTimestamp = (submittedAt: Date) => {
  const now = new Date();
  const diffInMinutes = Math.max(0, Math.floor((now.getTime() - submittedAt.getTime()) / 60000));

  if (diffInMinutes < 1) {
    return 'just now';
  }

  if (diffInMinutes === 1) {
    return 'a minute ago';
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) {
    return 'an hour ago';
  }

  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return diffInDays === 1 ? 'a day ago' : `${diffInDays} days ago`;
};

const formatDiscussionTimestamp = (createdAt: Date) => {
  const ageInDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  if (ageInDays < 7) {
    return formatSubmissionTimestamp(createdAt);
  }

  return createdAt.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const acceptedSubmissionThemes: SubmissionGlassyTheme[] = [
  {
    rowBg: 'bg-emerald-50/35',
    rowHover: 'hover:bg-emerald-100/45',
    dotColor: 'text-emerald-500',
    statusColor: 'text-emerald-600',
    chipClass: 'border-emerald-100/80 bg-emerald-50/70 text-emerald-700',
    glowClass: 'bg-gradient-to-l from-emerald-200/55 to-transparent',
    runtimeIconColor: 'text-emerald-500/80',
  },
  {
    rowBg: 'bg-cyan-50/35',
    rowHover: 'hover:bg-cyan-100/45',
    dotColor: 'text-cyan-500',
    statusColor: 'text-cyan-600',
    chipClass: 'border-cyan-100/80 bg-cyan-50/70 text-cyan-700',
    glowClass: 'bg-gradient-to-l from-cyan-200/55 to-transparent',
    runtimeIconColor: 'text-cyan-500/80',
  },
  {
    rowBg: 'bg-violet-50/35',
    rowHover: 'hover:bg-violet-100/45',
    dotColor: 'text-violet-500',
    statusColor: 'text-violet-600',
    chipClass: 'border-violet-100/80 bg-violet-50/70 text-violet-700',
    glowClass: 'bg-gradient-to-l from-violet-200/55 to-transparent',
    runtimeIconColor: 'text-violet-500/80',
  },
];

const rejectedSubmissionThemes: SubmissionGlassyTheme[] = [
  {
    rowBg: 'bg-rose-50/35',
    rowHover: 'hover:bg-rose-100/45',
    dotColor: 'text-rose-500',
    statusColor: 'text-rose-600',
    chipClass: 'border-rose-100/80 bg-rose-50/70 text-rose-700',
    glowClass: 'bg-gradient-to-l from-rose-200/55 to-transparent',
    runtimeIconColor: 'text-rose-500/80',
  },
  {
    rowBg: 'bg-amber-50/35',
    rowHover: 'hover:bg-amber-100/45',
    dotColor: 'text-amber-500',
    statusColor: 'text-amber-600',
    chipClass: 'border-amber-100/80 bg-amber-50/70 text-amber-700',
    glowClass: 'bg-gradient-to-l from-amber-200/55 to-transparent',
    runtimeIconColor: 'text-amber-500/80',
  },
  {
    rowBg: 'bg-fuchsia-50/35',
    rowHover: 'hover:bg-fuchsia-100/45',
    dotColor: 'text-fuchsia-500',
    statusColor: 'text-fuchsia-600',
    chipClass: 'border-fuchsia-100/80 bg-fuchsia-50/70 text-fuchsia-700',
    glowClass: 'bg-gradient-to-l from-fuchsia-200/55 to-transparent',
    runtimeIconColor: 'text-fuchsia-500/80',
  },
];

const getSubmissionGlassyTheme = (index: number, isAccepted: boolean): SubmissionGlassyTheme => {
  const palette = isAccepted ? acceptedSubmissionThemes : rejectedSubmissionThemes;
  return palette[index % palette.length];
};

const passedExecutionCardThemes: ExecutionCardTheme[] = [
  {
    cardClass: 'border-emerald-200/70 bg-gradient-to-br from-white/95 via-emerald-50/70 to-emerald-100/50',
    badgeClass: 'border-emerald-200/70 bg-emerald-100/70 text-emerald-700',
    glowClass: 'bg-emerald-200/50',
    expectedOutputCardClass: 'border-sky-200/80 bg-sky-50/85',
    actualOutputCardClass: 'border-emerald-200/80 bg-emerald-50/85',
  },
  {
    cardClass: 'border-cyan-200/70 bg-gradient-to-br from-white/95 via-cyan-50/70 to-cyan-100/45',
    badgeClass: 'border-cyan-200/70 bg-cyan-100/70 text-cyan-700',
    glowClass: 'bg-cyan-200/50',
    expectedOutputCardClass: 'border-cyan-200/80 bg-cyan-50/85',
    actualOutputCardClass: 'border-teal-200/80 bg-teal-50/85',
  },
  {
    cardClass: 'border-violet-200/70 bg-gradient-to-br from-white/95 via-violet-50/70 to-violet-100/45',
    badgeClass: 'border-violet-200/70 bg-violet-100/70 text-violet-700',
    glowClass: 'bg-violet-200/50',
    expectedOutputCardClass: 'border-indigo-200/80 bg-indigo-50/85',
    actualOutputCardClass: 'border-violet-200/80 bg-violet-50/85',
  },
];

const failedExecutionCardThemes: ExecutionCardTheme[] = [
  {
    cardClass: 'border-rose-200/70 bg-gradient-to-br from-white/95 via-rose-50/70 to-rose-100/45',
    badgeClass: 'border-rose-200/70 bg-rose-100/70 text-rose-700',
    glowClass: 'bg-rose-200/50',
    expectedOutputCardClass: 'border-slate-200/80 bg-slate-50/85',
    actualOutputCardClass: 'border-rose-200/80 bg-rose-50/85',
  },
  {
    cardClass: 'border-amber-200/70 bg-gradient-to-br from-white/95 via-amber-50/70 to-amber-100/45',
    badgeClass: 'border-amber-200/70 bg-amber-100/70 text-amber-700',
    glowClass: 'bg-amber-200/50',
    expectedOutputCardClass: 'border-stone-200/80 bg-stone-50/85',
    actualOutputCardClass: 'border-amber-200/80 bg-amber-50/85',
  },
  {
    cardClass: 'border-fuchsia-200/70 bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-fuchsia-100/45',
    badgeClass: 'border-fuchsia-200/70 bg-fuchsia-100/70 text-fuchsia-700',
    glowClass: 'bg-fuchsia-200/50',
    expectedOutputCardClass: 'border-purple-200/80 bg-purple-50/85',
    actualOutputCardClass: 'border-fuchsia-200/80 bg-fuchsia-50/85',
  },
];

const getExecutionCardTheme = (index: number, passed: boolean): ExecutionCardTheme => {
  const palette = passed ? passedExecutionCardThemes : failedExecutionCardThemes;
  return palette[index % palette.length];
};

const formatTableCellValue = (value: unknown) => {
  if (value === null) {
    return 'NULL';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const toResultTableData = (payload: unknown): ResultTableData => {
  if (Array.isArray(payload)) {
    if (payload.length === 0) {
      return {
        columns: [],
        rows: [],
      };
    }

    const areAllRowsObjects = payload.every((row) => (
      row !== null && typeof row === 'object' && !Array.isArray(row)
    ));

    if (areAllRowsObjects) {
      const columns: string[] = [];
      payload.forEach((row) => {
        Object.keys(row as Record<string, unknown>).forEach((column) => {
          if (!columns.includes(column)) {
            columns.push(column);
          }
        });
      });

      if (columns.length === 0) {
        return {
          columns: ['value'],
          rows: payload.map((row) => [formatTableCellValue(row)]),
        };
      }

      return {
        columns,
        rows: payload.map((row) => {
          const typedRow = row as Record<string, unknown>;
          return columns.map((column) => formatTableCellValue(typedRow[column]));
        }),
      };
    }

    return {
      columns: ['value'],
      rows: payload.map((row) => [formatTableCellValue(row)]),
    };
  }

  if (payload !== null && typeof payload === 'object') {
    const typedPayload = payload as Record<string, unknown>;
    const columns = Object.keys(typedPayload);

    if (columns.length === 0) {
      return {
        columns: ['value'],
        rows: [[formatTableCellValue(payload)]],
      };
    }

    return {
      columns,
      rows: [columns.map((column) => formatTableCellValue(typedPayload[column]))],
    };
  }

  return {
    columns: ['value'],
    rows: [[formatTableCellValue(payload)]],
  };
};

const HighlightableResultTable: React.FC<HighlightableResultTableProps> = ({
  tableData,
  maxHeightClass = 'max-h-36',
  emptyMessage = 'No rows returned',
}) => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(null);

  if (tableData.rows.length === 0) {
    return <div className="text-xs text-slate-500">{emptyMessage}</div>;
  }

  return (
    <div
      className={`${maxHeightClass} overflow-auto rounded-md border border-white/70 bg-white/65`}
      onMouseLeave={() => {
        setHoveredRowIndex(null);
        setHoveredColumnIndex(null);
      }}
    >
      <table className="min-w-full text-xs font-mono text-slate-700">
        <thead className="bg-white/70 text-slate-600">
          <tr>
            {tableData.columns.map((column, columnIndex) => {
              const isColumnHighlighted = hoveredColumnIndex === columnIndex;

              return (
                <th
                  key={`${column}-${columnIndex}`}
                  onMouseEnter={() => setHoveredColumnIndex(columnIndex)}
                  className={`border-b border-slate-200 px-2 py-1.5 text-left font-semibold transition-colors ${
                    isColumnHighlighted ? 'bg-sky-200/70 text-slate-900' : ''
                  }`}
                >
                  {column}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => {
            const isRowHighlighted = hoveredRowIndex === rowIndex;

            return (
              <tr
                key={`row-${rowIndex}`}
                className={`transition-colors ${
                  isRowHighlighted ? 'bg-sky-50/90' : 'odd:bg-white/80 even:bg-white/55'
                }`}
              >
                {row.map((cell, cellIndex) => {
                  const isColumnHighlighted = hoveredColumnIndex === cellIndex;
                  const isIntersection = isRowHighlighted && isColumnHighlighted;

                  return (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      onMouseEnter={() => {
                        setHoveredRowIndex(rowIndex);
                        setHoveredColumnIndex(cellIndex);
                      }}
                      className={`border-b border-slate-200/70 px-2 py-1 align-top transition-colors ${
                        isIntersection
                          ? 'bg-indigo-100/80 text-slate-900'
                          : (isRowHighlighted || isColumnHighlighted)
                            ? 'bg-sky-100/65 text-slate-900'
                            : ''
                      }`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const createEmptyRow = (columnCount: number) => Array.from({ length: columnCount }, () => '');

const toEditableCellValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const createEditableTables = (tables: any[] = []): EditableTestTable[] => {
  return tables.map((table: any) => {
    const columns = table.columns || [];
    const sourceRows = table.sampleData?.length ? table.sampleData : [createEmptyRow(columns.length)];

    return {
      name: table.name,
      columns,
      rows: sourceRows.map((row: any[]) => {
        const normalizedRow = (row || []).map((cell) => toEditableCellValue(cell));

        while (normalizedRow.length < columns.length) {
          normalizedRow.push('');
        }

        return normalizedRow;
      }),
    };
  });
};

const createEditableTestCase = (tables: any[] = [], caseNumber: number): EditableTestCase => ({
  id: caseNumber,
  label: `Case ${caseNumber}`,
  tables: createEditableTables(tables),
});

const cloneEditableTestCases = (testCases: EditableTestCase[]): EditableTestCase[] => (
  testCases.map((testCase) => ({
    ...testCase,
    tables: testCase.tables.map((table) => ({
      ...table,
      columns: table.columns.map((column) => ({
        ...column,
        constraints: column.constraints ? [...column.constraints] : undefined,
      })),
      rows: table.rows.map((row) => [...row]),
    })),
  }))
);

const isNumericSqlType = (type: string) => /(int|numeric|decimal|float|double|real)/i.test(type);

const toSqlLiteral = (value: string, type: string) => {
  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return 'NULL';
  }

  if (isNumericSqlType(type) && !Number.isNaN(Number(trimmedValue))) {
    return trimmedValue;
  }

  return `'${trimmedValue.replace(/'/g, "''")}'`;
};

const buildSetupSqlFromEditableTestCase = (testCase: EditableTestCase) => {
  return testCase.tables
    .map((table) => {
      const columnDefinitions = table.columns
        .map((column) => {
          const constraints = column.constraints?.length ? ` ${column.constraints.join(' ')}` : '';
          return `${column.name} ${column.type}${constraints}`;
        })
        .join(', ');

      const insertStatements = table.rows
        .filter((row) => row.some((cell) => cell.trim() !== ''))
        .map((row) => {
          const values = table.columns
            .map((column, columnIndex) => toSqlLiteral(row[columnIndex] || '', column.type))
            .join(', ');

          return `INSERT INTO ${table.name} (${table.columns.map((column) => column.name).join(', ')}) VALUES (${values});`;
        })
        .join('\n');

      return [
        `DROP TABLE IF EXISTS ${table.name};`,
        `CREATE TABLE ${table.name} (${columnDefinitions});`,
        insertStatements,
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');
};

const buildRuntimeChartData = (runtime: number, acceptedRuntimes: number[]): RuntimeChartData => {
  const normalizedAcceptedRuntimes = acceptedRuntimes
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => Math.round(value));

  const syntheticRuntimes = Array.from({ length: 40 }, (_, index) => {
    const waveOffset = Math.sin((index + 1) * 1.17) * 38;
    const spreadOffset = ((index % 9) - 4) * 11;
    return Math.max(40, Math.round(runtime + waveOffset + spreadOffset));
  });

  const allRuntimes = (
    normalizedAcceptedRuntimes.length >= 16
      ? [...normalizedAcceptedRuntimes, runtime]
      : [...normalizedAcceptedRuntimes, runtime, ...syntheticRuntimes]
  );

  const minRuntime = Math.max(1, Math.floor(Math.min(...allRuntimes) * 0.82));
  const maxRuntime = Math.max(minRuntime + 20, Math.ceil(Math.max(...allRuntimes) * 1.18));
  const range = Math.max(1, maxRuntime - minRuntime);
  const binCount = 36;

  const toBinIndex = (value: number) => {
    const ratio = (value - minRuntime) / range;
    return Math.min(binCount - 1, Math.max(0, Math.floor(ratio * binCount)));
  };

  const bins = Array.from({ length: binCount }, () => 0);
  allRuntimes.forEach((value) => {
    bins[toBinIndex(value)] += 1;
  });

  const highlightedIndex = toBinIndex(runtime);
  const highestBinCount = Math.max(...bins, 1);
  const highlightedRatio = bins[highlightedIndex] / highestBinCount;
  const beatsCount = allRuntimes.filter((value) => value >= runtime).length;
  const beatsPercent = Number(((beatsCount / allRuntimes.length) * 100).toFixed(2));
  const densityPercent = Number(((bins[highlightedIndex] / allRuntimes.length) * 100).toFixed(2));
  const maxDensityPercent = (highestBinCount / allRuntimes.length) * 100;

  return {
    bins,
    minRuntime,
    maxRuntime,
    highlightedIndex,
    highlightedRatio,
    beatsPercent,
    densityPercent,
    yAxisLabels: [
      Number(maxDensityPercent.toFixed(1)),
      Number((maxDensityPercent * 0.75).toFixed(1)),
      Number((maxDensityPercent * 0.5).toFixed(1)),
      Number((maxDensityPercent * 0.25).toFixed(1)),
      0,
    ],
    xAxisLabels: [
      Math.round(minRuntime),
      Math.round(minRuntime + (range / 3)),
      Math.round(minRuntime + ((2 * range) / 3)),
      Math.round(maxRuntime),
    ],
  };
};

const ProblemSolvePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [problem, setProblem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'solutions' | 'accepted' | 'submissions'>('description');
  const [sqlCode, setSqlCode] = useState(`-- Write your SQL query here
SELECT 
    
FROM 
    
WHERE 
    
ORDER BY 
    ;`);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [testCaseTab, setTestCaseTab] = useState<'testcase' | 'result'>('testcase');
  const [editableTestCases, setEditableTestCases] = useState<EditableTestCase[]>([]);
  const [leftWidth, setLeftWidth] = useState(34); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [lastAcceptedSubmission, setLastAcceptedSubmission] = useState<Submission | null>(null);
  const [executionSummary, setExecutionSummary] = useState<ExecutionSummary | null>(null);
  const [executionDetails, setExecutionDetails] = useState<ExecutionDetail[]>([]);
  const [discussionDraft, setDiscussionDraft] = useState('');
  const [discussionType, setDiscussionType] = useState<DiscussionPostType>('Question');
  const [discussionSort, setDiscussionSort] = useState<'Best' | 'Newest'>('Best');
  const [showDiscussionRules, setShowDiscussionRules] = useState(true);
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [replyDraftByPost, setReplyDraftByPost] = useState<Record<number, string>>({});
  const [discussionPage, setDiscussionPage] = useState(1);
  const [submissionPage, setSubmissionPage] = useState(1);
  const [showAcceptedTab, setShowAcceptedTab] = useState(false);
  const [questionNavIds, setQuestionNavIds] = useState<number[]>([]);

  const getApiErrorMessage = (error: any, fallbackMessage: string) => {
    const responseData = error?.response?.data;

    if (typeof responseData?.error === 'string') {
      return responseData.error;
    }

    if (typeof responseData?.detail === 'string') {
      return responseData.detail;
    }

    if (Array.isArray(responseData?.detail)) {
      return responseData.detail.map((item: any) => item?.msg || 'Request failed').join(', ');
    }

    if (typeof error?.message === 'string' && error.message.trim()) {
      return error.message;
    }

    return fallbackMessage;
  };

  useEffect(() => {
    let isCancelled = false;

    const loadQuestionNavIds = async () => {
      try {
        const questions = await fetchQuestions();
        const ids = (Array.isArray(questions) ? questions : [])
          .map((question: any) => Number(question?.id))
          .filter((questionId: number) => Number.isFinite(questionId))
          .sort((a: number, b: number) => a - b);

        if (!isCancelled) {
          setQuestionNavIds(ids);
        }
      } catch (error) {
        console.error('Failed to load question navigation list:', error);
      }
    };

    loadQuestionNavIds();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Get the problem based on the ID from the interview questions
  useEffect(() => {
  if (!id) return;

  console.log("Route changed. New ID:", id);

  // 🔥 RESET EVERYTHING WHEN ID CHANGES
  setProblem(null);
  setTestResult(null);
  setTestCaseTab('testcase');
  setActiveTestCase(0);
  setEditableTestCases([]);
  setActiveTab('description');
  setSubmissions([]);
  setLastAcceptedSubmission(null);
  setExecutionSummary(null);
  setExecutionDetails([]);
  setDiscussionDraft('');
  setDiscussionType('Question');
  setDiscussionSort('Best');
  setShowDiscussionRules(true);
  setDiscussionPosts([]);
  setReplyDraftByPost({});
  setDiscussionPage(1);
  setSubmissionPage(1);
  setShowAcceptedTab(false);
  setSqlCode(`-- Write your SQL query here
SELECT 
    
FROM 
    
WHERE 
    
ORDER BY 
    ;`);

  fetchQuestionById(Number(id))
    .then((data) => {
      console.log("API DATA:", data);

      const formattedProblem: SQLProblem = {
        id: data.id,
        title: data.title,
        difficulty: data.difficulty,
        topics: data.topics || [],
        companies: data.companies || [],
        acceptance: 75,
        description: data.description,
        schema: {
          tables: data.schema?.tables || []
        },
        examples: data.examples || [],
        testCases: (data.test_cases || []).map((tc: any) => ({
          setupSql: tc.setup_sql,
          expectedOutput: tc.expected_output
        })),
        solution: data.solution || "",
        hints: data.hints || []
      };

      setProblem(formattedProblem);
      setEditableTestCases([createEditableTestCase(formattedProblem.schema.tables || [], 1)]);
      setActiveTestCase(0);
    })
    .catch((err) => {
      console.error("Error fetching problem:", err);
      setProblem(null);
    });

}, [id]);

  // Resize handlers - MUST be before early return
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const container = document.querySelector('.resize-container') as HTMLElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Limit between 30% and 70%
      if (newLeftWidth >= 30 && newLeftWidth <= 70) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  useEffect(() => {
    const problemId = problem?.id;
    if (!problemId) {
      return;
    }

    let isCancelled = false;

    const loadInterviewData = async () => {
      try {
        const discussionPromise = interviewService.getDiscussions(problemId);
        const submissionPromise = isAuthenticated
          ? interviewService.getUserSubmissions(problemId)
          : Promise.resolve([]);

        const [discussionResponse, submissionResponse] = await Promise.all([
          discussionPromise,
          submissionPromise,
        ]);

        if (isCancelled) {
          return;
        }

        const discussionItems = Array.isArray(discussionResponse)
          ? discussionResponse
          : discussionResponse?.items || [];
        const submissionItems = Array.isArray(submissionResponse)
          ? submissionResponse
          : submissionResponse?.items || [];

        const mappedDiscussions = discussionItems.map((post: any) => mapDiscussionFromApi(post));
        setDiscussionPosts(mappedDiscussions.length ? mappedDiscussions : createDiscussionSeedForProblem(problemId));

        const mappedSubmissions = submissionItems.map((submission: any) => mapSubmissionFromApi(submission));
        setSubmissions(mappedSubmissions);
        setLastAcceptedSubmission(mappedSubmissions.find((submission: Submission) => submission.status === 'Accepted') || null);
      } catch (error) {
        console.error('Failed to load interview activity:', error);
        if (!isCancelled) {
          setDiscussionPosts(createDiscussionSeedForProblem(problemId));
          setSubmissions([]);
          setLastAcceptedSubmission(null);
        }
      }
    };

    loadInterviewData();

    return () => {
      isCancelled = true;
    };
  }, [problem?.id, isAuthenticated]);

  const sortedDiscussionPosts = [...discussionPosts].sort((postA, postB) => {
    if (discussionSort === 'Newest') {
      return postB.createdAt.getTime() - postA.createdAt.getTime();
    }

    return (
      postB.votes - postA.votes
      || postB.createdAt.getTime() - postA.createdAt.getTime()
    );
  });

  const totalDiscussionPages = Math.max(1, Math.ceil(sortedDiscussionPosts.length / DISCUSSION_PAGE_SIZE));
  const currentDiscussionPage = Math.min(discussionPage, totalDiscussionPages);
  const paginatedDiscussionPosts = sortedDiscussionPosts.slice(
    (currentDiscussionPage - 1) * DISCUSSION_PAGE_SIZE,
    currentDiscussionPage * DISCUSSION_PAGE_SIZE,
  );

  const totalSubmissionPages = Math.max(1, Math.ceil(submissions.length / SUBMISSION_PAGE_SIZE));
  const currentSubmissionPage = Math.min(submissionPage, totalSubmissionPages);
  const paginatedSubmissions = submissions.slice(
    (currentSubmissionPage - 1) * SUBMISSION_PAGE_SIZE,
    currentSubmissionPage * SUBMISSION_PAGE_SIZE,
  );

  useEffect(() => {
    setDiscussionPage((previousPage) => Math.min(previousPage, totalDiscussionPages));
  }, [totalDiscussionPages]);

  useEffect(() => {
    setSubmissionPage((previousPage) => Math.min(previousPage, totalSubmissionPages));
  }, [totalSubmissionPages]);

  const safeProblem = {
  ...(problem || {}),
  schema: problem?.schema || { tables: [] },
  examples: problem?.examples || [],
  hints: problem?.hints || [],
  companies: problem?.companies || [],
  testCases: problem?.testCases || []   // ✅ ADD THIS
};

  const acceptedRuntimeValues = React.useMemo(
    () => submissions
      .filter((submission) => submission.status === 'Accepted' && typeof submission.runtime === 'number')
      .map((submission) => submission.runtime as number),
    [submissions],
  );

  const runtimeChartData = React.useMemo(() => {
    if (!lastAcceptedSubmission?.runtime) {
      return null;
    }

    return buildRuntimeChartData(lastAcceptedSubmission.runtime, acceptedRuntimeValues);
  }, [lastAcceptedSubmission?.runtime, acceptedRuntimeValues]);

  const runtimeMarkerLeft = runtimeChartData
    ? ((runtimeChartData.highlightedIndex + 0.5) / runtimeChartData.bins.length) * 100
    : 0;
  const runtimeMarkerTop = runtimeChartData
    ? Math.max(6, 100 - (runtimeChartData.highlightedRatio * 100))
    : 0;

  const numericQuestionId = Number(id);
  const currentQuestionNavIndex = questionNavIds.findIndex((questionId) => questionId === numericQuestionId);
  const previousQuestionId = currentQuestionNavIndex > 0 ? questionNavIds[currentQuestionNavIndex - 1] : null;
  const nextQuestionId = (
    currentQuestionNavIndex >= 0 && currentQuestionNavIndex < questionNavIds.length - 1
      ? questionNavIds[currentQuestionNavIndex + 1]
      : null
  );

  const handleNavigatePreviousQuestion = () => {
    if (previousQuestionId === null) {
      return;
    }

    navigate(`/interview/problem/${previousQuestionId}`);
  };

  const handleNavigateNextQuestion = () => {
    if (nextQuestionId === null) {
      return;
    }

    navigate(`/interview/problem/${nextQuestionId}`);
  };

  if (!problem) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading problem...</p>
      </div>
    </div>
  );

  const activeEditableTestCase = editableTestCases[activeTestCase];

  const requireAuthForAction = (message: string) => {
    if (isAuthenticated) {
      return true;
    }

    alert(message);
    navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    return false;
  };

  const handleAddTestCase = () => {
    const nextCaseNumber = editableTestCases.length + 1;

    setEditableTestCases((previousCases) => [
      ...previousCases,
      createEditableTestCase(safeProblem.schema.tables || [], nextCaseNumber),
    ]);
    setActiveTestCase(nextCaseNumber - 1);
    setTestCaseTab('testcase');
  };

  const handleTestCaseCellChange = (
    caseIndex: number,
    tableIndex: number,
    rowIndex: number,
    columnIndex: number,
    value: string
  ) => {
    setEditableTestCases((previousCases) => previousCases.map((testCase, currentCaseIndex) => {
      if (currentCaseIndex !== caseIndex) {
        return testCase;
      }

      return {
        ...testCase,
        tables: testCase.tables.map((table, currentTableIndex) => {
          if (currentTableIndex !== tableIndex) {
            return table;
          }

          return {
            ...table,
            rows: table.rows.map((row, currentRowIndex) => {
              if (currentRowIndex !== rowIndex) {
                return row;
              }

              return row.map((cell, currentColumnIndex) => (
                currentColumnIndex === columnIndex ? value : cell
              ));
            }),
          };
        }),
      };
    }));
  };

  const handleAddRowToTable = (caseIndex: number, tableIndex: number) => {
    setEditableTestCases((previousCases) => previousCases.map((testCase, currentCaseIndex) => {
      if (currentCaseIndex !== caseIndex) {
        return testCase;
      }

      return {
        ...testCase,
        tables: testCase.tables.map((table, currentTableIndex) => {
          if (currentTableIndex !== tableIndex) {
            return table;
          }

          return {
            ...table,
            rows: [...table.rows, createEmptyRow(table.columns.length)],
          };
        }),
      };
    }));
  };

  console.log('Problem ID:', id);

 const handleRunCode = async () => {
  if (!sqlCode.trim()) return;

  const runtimeEditableTestCases = cloneEditableTestCases(editableTestCases);

  setTestCaseTab('result');
  setIsRunning(true);
  setTestResult(null);
    setExecutionSummary(null);
    setExecutionDetails([]);

  try {
    const response = await apiClient.post("/api/sql/execute", {
      question_id: safeProblem.id,
      sql: sqlCode,
      reference_sql: safeProblem.solution,
      custom_test_cases: runtimeEditableTestCases.map((testCase) => ({
        label: testCase.label,
        setup_sql: buildSetupSqlFromEditableTestCase(testCase),
      })),
    });

    const data = response.data;
    const summary = data.summary || {};
    const visibleCount = summary.visible_count || (data.details || []).length || 0;
    const visiblePassedCount = summary.visible_passed_count || (data.details || []).filter((detail: any) => detail.passed).length;

    setExecutionSummary({
      mode: 'run',
      passedCount: summary.passed_count || visiblePassedCount,
      totalCount: summary.total_count || visibleCount,
      visiblePassedCount,
      visibleCount,
      hiddenPassedCount: summary.hidden_passed_count || 0,
      hiddenCount: summary.hidden_count || 0,
    });

    const mappedDetails: ExecutionDetail[] = (data.details || []).map((detail: any, index: number) => ({
      testCase: detail.test_case || index + 1,
      label: detail.label || `Case ${detail.test_case || index + 1}`,
      passed: !!detail.passed,
      expectedOutput: detail.expected_output,
      actualOutput: detail.actual_output,
      inputTables: runtimeEditableTestCases[index]?.tables || [],
    }));

    setExecutionDetails(mappedDetails);

    if (data.error) {
      setTestResult("❌ Error:\n" + data.error);
    } else {
      setTestResult(data.passed ? '✅ All test cases passed!' : '❌ Some test cases failed');
    }

  } catch (err) {
    setExecutionDetails([]);
    setTestResult(`❌ Error:\n${getApiErrorMessage(err, 'Execution failed.')}`);
  }

  setIsRunning(false);
};

 const handleSubmit = async () => {
  if (!requireAuthForAction('Please sign in or sign up to submit your solution.')) {
    return;
  }

  try {
    setTestCaseTab('result');
    setExecutionSummary(null);
    setExecutionDetails([]);
    const executeResponse = await apiClient.post('/api/sql/execute', {
      question_id: safeProblem.id,
      sql: sqlCode,
      include_hidden: true,
      submission_mode: true,
    });

    const executeData = executeResponse.data;
    const summary = executeData.summary || {};
    const totalCount = summary.total_count || (executeData.details || []).length || 1;
    const passedCount = summary.passed_count || (executeData.details || []).filter((d: any) => d.passed).length;
    const visibleCount = summary.visible_count || (executeData.details || []).length || 0;
    const hiddenCount = summary.hidden_count || 0;
    const visiblePassedCount = summary.visible_passed_count || (executeData.details || []).filter((d: any) => d.passed).length;
    const hiddenPassedCount = summary.hidden_passed_count || 0;

    setExecutionSummary({
      mode: 'submit',
      passedCount,
      totalCount,
      visiblePassedCount,
      visibleCount,
      hiddenPassedCount,
      hiddenCount,
    });

    const mappedDetails: ExecutionDetail[] = (executeData.details || []).map((detail: any, index: number) => ({
      testCase: detail.test_case || index + 1,
      label: detail.label || `Case ${detail.test_case || index + 1}`,
      passed: !!detail.passed,
      expectedOutput: detail.expected_output,
      actualOutput: detail.actual_output,
      inputTables: [],
    }));
    setExecutionDetails(mappedDetails);

    const status: Submission['status'] = executeData.error || !executeData.passed ? 'Rejected' : 'Accepted';
    const runtimeMs = status === 'Accepted' ? Math.floor(Math.random() * 300) + 100 : undefined;

    const fallbackSubmission: Submission = {
      id: Date.now(),
      status,
      submittedAt: new Date(),
      language: 'MySQL',
      code: sqlCode,
      runtime: runtimeMs,
      testsPassed: status === 'Rejected' && executeData.error ? 0 : passedCount,
      testsTotal: totalCount,
      visibleTestsPassed: visiblePassedCount,
      visibleTestsTotal: visibleCount,
      hiddenTestsPassed: hiddenPassedCount,
      hiddenTestsTotal: hiddenCount,
    };

    let persistedSubmission = fallbackSubmission;
    try {
      const savedSubmission = await interviewService.createSubmission({
        question_id: safeProblem.id,
        status,
        language: 'MySQL',
        code: sqlCode,
        runtime_ms: runtimeMs,
        tests_passed: fallbackSubmission.testsPassed || 0,
        tests_total: totalCount,
        visible_tests_passed: visiblePassedCount,
        visible_tests_total: visibleCount,
        hidden_tests_passed: hiddenPassedCount,
        hidden_tests_total: hiddenCount,
      });
      persistedSubmission = mapSubmissionFromApi(savedSubmission);
    } catch (persistError) {
      console.error('Failed to persist submission:', persistError);
    }

    setSubmissions((previousSubmissions) => [persistedSubmission, ...previousSubmissions]);
    setSubmissionPage(1);

    if (executeData.error) {
      setTestResult('❌ Error:\n' + executeData.error);
      alert('❌ ' + executeData.error);
      return;
    }

    if (!executeData.passed) {
      setTestResult(`❌ Submission failed\n\nVisible cases: ${visiblePassedCount}/${visibleCount}\nHidden cases: ${hiddenPassedCount}/${hiddenCount}`);
      alert(`❌ Submission failed. Passed ${passedCount} of ${totalCount} test cases, including hidden checks.`);
      return;
    }

    setLastAcceptedSubmission(persistedSubmission);
    setShowAcceptedTab(true);
    setActiveTab('accepted');
    setTestResult(`✅ Submission accepted\n\nVisible cases: ${visiblePassedCount}/${visibleCount}\nHidden cases: ${hiddenPassedCount}/${hiddenCount}`);
    alert('✅ Solution Accepted! All test cases passed.');
  } catch (error) {
    const message = getApiErrorMessage(error, 'Failed to submit solution');
    alert(message === 'Not authenticated' ? 'Please sign in before submitting your solution.' : `❌ ${message}`);
  }
};

    const handleCreateDiscussionPost = async () => {
      if (!requireAuthForAction('Please sign in or sign up to post in discussions.')) {
        return;
      }

      const trimmedDraft = discussionDraft.trim();
      if (!trimmedDraft) {
        return;
      }

      const normalizedLines = trimmedDraft
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const [titleLine, ...bodyLines] = normalizedLines;

      try {
        const createdPost = await interviewService.createDiscussionPost(safeProblem.id, {
          post_type: discussionType,
          title: titleLine || 'New discussion',
          content: bodyLines.length ? bodyLines.join('\n') : (titleLine || 'New discussion'),
        });

        setDiscussionPosts((previousPosts) => [mapDiscussionFromApi(createdPost), ...previousPosts]);
        setDiscussionDraft('');
        setDiscussionSort('Newest');
        setDiscussionPage(1);
      } catch (error) {
        alert(`❌ ${getApiErrorMessage(error, 'Failed to post discussion.')}`);
      }
    };

    const handleDiscussionVote = (postId: number, direction: -1 | 1) => {
      setDiscussionPosts((previousPosts) => previousPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const nextVote = post.userVote === direction ? 0 : direction;
        const delta = nextVote - post.userVote;

        return {
          ...post,
          userVote: nextVote,
          votes: post.votes + delta,
        };
      }));
    };

    const handleReplyDraftChange = (postId: number, value: string) => {
      setReplyDraftByPost((previousDrafts) => ({
        ...previousDrafts,
        [postId]: value,
      }));
    };

    const handleReplySubmit = async (postId: number) => {
      if (!requireAuthForAction('Please sign in or sign up to reply in discussions.')) {
        return;
      }

      const draft = (replyDraftByPost[postId] || '').trim();
      if (!draft) {
        return;
      }

      try {
        const createdReply = await interviewService.createDiscussionReply(safeProblem.id, postId, draft);
        const mappedReply: DiscussionReply = {
          id: createdReply.id,
          author: createdReply.author?.name || createdReply.author?.email || 'User',
          initials: toInitials(createdReply.author?.name || createdReply.author?.email || 'User'),
          text: createdReply.content || draft,
          createdAt: new Date(createdReply.created_at),
        };

        setDiscussionPosts((previousPosts) => previousPosts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          return {
            ...post,
            replies: [...post.replies, mappedReply],
          };
        }));

        setReplyDraftByPost((previousDrafts) => ({
          ...previousDrafts,
          [postId]: '',
        }));
      } catch (error) {
        alert(`❌ ${getApiErrorMessage(error, 'Failed to post reply.')}`);
      }
    };

    const appendToDiscussionDraft = (snippet: string) => {
      setDiscussionDraft((previousDraft) => {
        if (!previousDraft.trim()) {
          return snippet;
        }

        return `${previousDraft}\n${snippet}`;
      });
    };

    const handleCloseAcceptedTab = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setShowAcceptedTab(false);
      setLastAcceptedSubmission(null);

      if (activeTab === 'accepted') {
        setActiveTab('submissions');
      }
    };

    const handleOpenAcceptedSubmission = (submission: Submission) => {
      if (submission.status !== 'Accepted') {
        return;
      }

      setLastAcceptedSubmission(submission);
      setShowAcceptedTab(true);
      setActiveTab('accepted');
    };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-6">
            {/* Problem Title and Difficulty */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                {safeProblem.id}. {safeProblem.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  safeProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  safeProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {safeProblem.difficulty}
                </span>
                {safeProblem.topics.map((topic: string) => (
                  <span key={topic} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {topic}
                  </span>
                ))}
                {safeProblem.companies.length > 0 && (
                  <>
                    {safeProblem.companies.map((company: string) => (
                      <span key={company} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {company}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Problem Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed text-[15px]">
                {problem.description}
              </p>
            </div>

            {/* Database Schema - LeetCode Style */}
            {safeProblem.schema.tables.length > 0 && (
              <div className="space-y-4">
                {safeProblem.schema.tables.map((table: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                      <span className="text-sm text-gray-700 font-medium">Table: </span>
                      <code className="text-sm font-semibold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                        {table.name}
                      </code>
                    </div>
                    
                    <div className="bg-white rounded border border-gray-300 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-300">
                            <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-r border-gray-300">
                              Column Name
                            </th>
                            <th className="px-4 py-2.5 text-left font-semibold text-gray-700">
                              Type
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map((column: any, colIndex: number) => (
                            <tr key={colIndex} className="border-b border-gray-200 last:border-b-0">
                              <td className="px-4 py-2.5 border-r border-gray-200 font-mono text-xs">
                                {column.name}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-xs text-gray-600">
                                {column.type}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Sample Data Preview */}
                    {table.sampleData && table.sampleData.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-2">Sample rows:</div>
                        <div className="bg-white rounded border border-gray-300 overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200">
                                {table.columns.map((col: any, i: number) => (
                                  <th key={i} className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                                    {col.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table.sampleData.map((row: any[], rowIndex: number) => (
                                <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                                  {row.map((cell: any, cellIndex: number) => (
                                    <td key={cellIndex} className="px-3 py-2 font-mono border-r border-gray-200 last:border-r-0">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Constraints/Notes */}
                    {table.columns.some((col: any) => col.constraints && col.constraints.length > 0) && (
                      <div className="mt-3 text-xs text-gray-600">
                        {table.columns
                          .filter((col: any) => col.constraints && col.constraints.length > 0)
                          .map((col: any, i: number) => (
                            <div key={i}>
                              <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{col.name}</code>
                              {' '}is the primary key
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Expected Output Example */}
            {safeProblem.examples.length > 0 && (
              <div className="space-y-6">
                {safeProblem.examples.map((example: any, index: number) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h4 className="font-semibold text-gray-900 text-base">Example {index + 1}:</h4>
                    </div>
                    
                    {/* Input Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-gray-900 mb-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Input:</span>
                      </div>
                      <div className="font-mono text-xs text-gray-700 mb-3">
                        {safeProblem.schema.tables.map((table: any) => table.name).join(', ')} table:
                      </div>
                      
                      {/* Show input tables */}
                      {safeProblem.schema.tables.map((table: any, tableIdx: number) => (
                        <div key={tableIdx} className="mb-4">
                          <div className="bg-gray-50 rounded border border-gray-300 overflow-x-auto">
                            <table className="w-full text-xs font-mono border-collapse">
                              <thead>
                                <tr className="border-b border-gray-400">
                                  {table.columns.map((col: any, colIdx: number) => (
                                    <th key={colIdx} className="px-4 py-2 text-left font-semibold text-gray-900 border-r border-gray-300 last:border-r-0">
                                      {col.name}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {table.sampleData && table.sampleData.map((row: any[], rowIdx: number) => (
                                  <tr key={rowIdx} className="border-b border-gray-300 last:border-b-0">
                                    {row.map((cell: any, cellIdx: number) => (
                                      <td key={cellIdx} className="px-4 py-2 text-gray-800 border-r border-gray-300 last:border-r-0">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Output Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-gray-900 mb-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Output:</span>
                      </div>
                      {example.expectedOutput && example.expectedColumns ? (
                        <div className="bg-gray-50 rounded border border-gray-300 overflow-x-auto">
                          <table className="w-full text-xs font-mono border-collapse">
                            <thead>
                              <tr className="border-b border-gray-400">
                                {example.expectedColumns.map((col: string, colIdx: number) => (
                                  <th key={colIdx} className="px-4 py-2 text-left font-semibold text-gray-900 border-r border-gray-300 last:border-r-0">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {example.expectedOutput.map((row: any[], rowIdx: number) => (
                                <tr key={rowIdx} className="border-b border-gray-300 last:border-b-0">
                                  {row.map((cell: any, cellIdx: number) => (
                                    <td key={cellIdx} className="px-4 py-2 text-gray-800 border-r border-gray-300 last:border-r-0">
                                      {cell === null ? 'Null' : cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : example.output ? (
                        <div className="bg-gray-50 rounded border border-gray-300 p-3">
                          <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap">{example.output}</pre>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic">No output specified</div>
                      )}
                    </div>

                    {/* Explanation Section */}
                    {example.explanation && (
                      <div className="mb-4">
                        <div className="flex items-center gap-1.5 font-semibold text-sm text-gray-900 mb-2">
                          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span>Explanation:</span>
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {example.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hints */}
            {safeProblem.hints.length > 0 && (
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    <svg className="w-4 h-4 transition-transform group-open:rotate-90 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                    <span>Hint</span>
                  </div>
                </summary>
                <div className="mt-3 ml-6 space-y-2">
                  {safeProblem.hints.map((hint: string, index: number) => (
                    <div key={index} className="text-sm text-gray-700 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                      {hint}
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* Acceptance Stats */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-gray-600">Accepted </span>
                    <span className="font-semibold text-gray-900">{Math.floor(safeProblem.acceptance * 1000)}</span>
                    <span className="text-gray-500"> /{Math.floor(safeProblem.acceptance * 1260)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Acceptance Rate </span>
                    <span className="font-semibold text-gray-900">{safeProblem.acceptance}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Topics Section */}
            {safeProblem.topics.length > 0 && (
              <details className="group border-t border-gray-200 pt-4">
                <summary className="cursor-pointer list-none flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  <svg className="w-4 h-4 transition-transform group-open:rotate-90 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Topics</span>
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {safeProblem.topics.map((topic: string) => (
                    <span key={topic} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                      {topic}
                    </span>
                  ))}
                </div>
              </details>
            )}

            {/* Companies Section */}
            {safeProblem.companies.length > 0 && (
              <details className="group border-t border-gray-200 pt-4">
                <summary className="cursor-pointer list-none flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  <svg className="w-4 h-4 transition-transform group-open:rotate-90 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Companies</span>
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {safeProblem.companies.map((company: string) => (
                    <span key={company} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded text-xs font-medium hover:bg-orange-100 cursor-pointer transition-colors">
                      {company}
                    </span>
                  ))}
                </div>
              </details>
            )}

            {/* Similar Questions Section */}
            <details className="group border-t border-gray-200 pt-4">
              <summary className="cursor-pointer list-none flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                <svg className="w-4 h-4 transition-transform group-open:rotate-90 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Similar Questions</span>
              </summary>
              <div className="mt-3 space-y-3">
                {/* Similar Question Item */}
                <div className="flex items-center justify-between text-sm hover:bg-gray-50 py-2 px-3 rounded transition-colors">
                  <button
                    onClick={() => navigate(`/interview/problem/${safeProblem.id === 1 ? 2 : 1}`)}
                    className="text-blue-600 hover:text-blue-700 hover:underline text-left flex-1"
                  >
                    {safeProblem.id === 1 ? 'Average Salary' : 'Highest Paid Employee'}
                  </button>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Easy
                  </span>
                </div>
              </div>
            </details>

            {/* Discussion Section */}
            <details className="group border-t border-gray-200 pt-4" open>
              <summary className="cursor-pointer list-none flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                <svg className="w-4 h-4 transition-transform group-open:rotate-90 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Discussion ({discussionPosts.length})</span>
              </summary>
              <div className="mt-4 space-y-4">
                {/* Comment Input Area */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <textarea
                    placeholder="Type comment here..."
                    value={discussionDraft}
                    onChange={(event) => setDiscussionDraft(event.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                    rows={3}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={discussionType}
                        onChange={(event) => setDiscussionType(event.target.value as DiscussionPostType)}
                        className="px-2.5 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Question">Question</option>
                        <option value="Tip">Tip</option>
                        <option value="General">General</option>
                      </select>
                      <div className="flex items-center gap-2 text-gray-600">
                        <button
                          type="button"
                          onClick={() => appendToDiscussionDraft('```sql\nSELECT ...\n```')}
                          className="p-1.5 hover:bg-gray-200 rounded"
                          title="Insert SQL snippet"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => appendToDiscussionDraft('![screenshot](https://example.com/image.png)')}
                          className="p-1.5 hover:bg-gray-200 rounded"
                          title="Insert image markdown"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => appendToDiscussionDraft('[reference link](https://example.com)')}
                          className="p-1.5 hover:bg-gray-200 rounded"
                          title="Insert link markdown"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => appendToDiscussionDraft('@teammate ')}
                          className="p-1.5 hover:bg-gray-200 rounded"
                          title="Mention"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateDiscussionPost}
                      disabled={!discussionDraft.trim()}
                      className="px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Comment
                    </button>
                  </div>
                </div>

                {/* Discussion Rules */}
                {showDiscussionRules && (
                  <div className="bg-gray-50 rounded-lg p-4 relative">
                    <button
                      type="button"
                      onClick={() => setShowDiscussionRules(false)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex items-start gap-2 mb-3">
                      <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-semibold text-gray-900 text-sm">Discussion Rules</h4>
                    </div>
                    <ol className="space-y-2 text-sm text-gray-700 pl-6">
                      <li>1. Please do not post full solutions in this discussion.</li>
                      <li>2. Ask questions, share hints, and discuss approaches.</li>
                      <li>3. Use the solutions tab if you want detailed answer reviews.</li>
                    </ol>
                  </div>
                )}

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Sort by:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscussionSort(discussionSort === 'Best' ? 'Newest' : 'Best');
                      setDiscussionPage(1);
                    }}
                    className="flex items-center gap-1 text-gray-900 font-medium hover:text-gray-700"
                  >
                    {discussionSort}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Discussion Thread */}
                {sortedDiscussionPosts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-sm">No discussions available for this problem yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to start a discussion!</p>
                  </div>
                ) : paginatedDiscussionPosts.map((post) => {
                  const avatarGradient = post.type === 'Question'
                    ? 'from-blue-500 to-indigo-600'
                    : post.type === 'Tip'
                      ? 'from-emerald-500 to-teal-600'
                      : 'from-slate-500 to-gray-600';

                  return (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-semibold text-sm`}>
                            {post.initials}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">{post.author}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800">
                              {post.type}
                            </span>
                            <span className="text-sm text-gray-500">{formatDiscussionTimestamp(post.createdAt)}</span>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-900">{post.title}</p>
                            {post.lines.map((line, lineIndex) => (
                              <p key={lineIndex} className="text-sm text-gray-700">{line}</p>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <button
                              type="button"
                              onClick={() => handleDiscussionVote(post.id, 1)}
                              className={`flex items-center gap-1 ${post.userVote === 1 ? 'text-orange-600' : 'hover:text-orange-600'}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              <span>{post.votes}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDiscussionVote(post.id, -1)}
                              className={`${post.userVote === -1 ? 'text-orange-600' : 'hover:text-orange-600'}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{post.replies.length}</span>
                            </span>
                          </div>

                          {post.replies.length > 0 && (
                            <div className="mt-3 space-y-2 rounded-md bg-gray-50 border border-gray-200 p-3">
                              {post.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-2">
                                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                                    {reply.initials}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs text-gray-500">
                                      <span className="font-medium text-gray-700">{reply.author}</span>
                                      {' - '}
                                      {formatDiscussionTimestamp(reply.createdAt)}
                                    </div>
                                    <p className="text-sm text-gray-700 break-words">{reply.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 flex items-center gap-2">
                            <input
                              type="text"
                              value={replyDraftByPost[post.id] || ''}
                              onChange={(event) => handleReplyDraftChange(post.id, event.target.value)}
                              placeholder="Write a reply..."
                              className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleReplySubmit(post.id)}
                              disabled={!(replyDraftByPost[post.id] || '').trim()}
                              className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <PaginationControls
                  currentPage={currentDiscussionPage}
                  totalPages={totalDiscussionPages}
                  totalItems={sortedDiscussionPosts.length}
                  itemLabel="Threads"
                  onPageChange={setDiscussionPage}
                />
              </div>
            </details>
          </div>
        );
      
      case 'editorial':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Solution</h2>
              {problem.solution ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Approach:</h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      This solution demonstrates the correct SQL query to solve the problem.
                    </p>
                    
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                        <span className="text-xs font-medium text-gray-300">SQL</span>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-gray-100 font-mono leading-relaxed">
                          {problem.solution}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">Editorial content is not available yet</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'solutions':
        return (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm">Community solutions are not available yet</p>
          </div>
        );
      
      case 'accepted':
        if (!lastAcceptedSubmission) {
          return (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Submit your solution to see the accepted status</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-green-600">Accepted</div>
                <div className="text-xs text-gray-500">
                  {lastAcceptedSubmission.submittedAt.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Runtime Stats */}
            {runtimeChartData && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="mb-4">
                  <div className="text-sm font-semibold mb-2 text-gray-900">Runtime</div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-900">
                      {lastAcceptedSubmission.runtime} <span className="text-sm text-gray-600">ms</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Beats {runtimeChartData.beatsPercent}% of submissions
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <div className="relative h-52">
                    <div className="absolute left-8 right-2 top-2 bottom-8">
                      <div className="absolute inset-0 grid grid-rows-4">
                        {runtimeChartData.yAxisLabels.slice(0, 4).map((_, index) => (
                          <div key={index} className="border-t border-gray-200" />
                        ))}
                      </div>

                      <div className="absolute inset-0 flex items-end gap-[2px]">
                        {runtimeChartData.bins.map((count, index) => {
                          const ratio = count / Math.max(...runtimeChartData.bins, 1);
                          const isHighlighted = index === runtimeChartData.highlightedIndex;

                          return (
                            <div
                              key={index}
                              style={{ height: `${Math.max(4, ratio * 100)}%` }}
                              className={`flex-1 rounded-t ${isHighlighted ? 'bg-blue-600' : 'bg-blue-300/70'}`}
                            />
                          );
                        })}
                      </div>

                      <div
                        className="pointer-events-none absolute -translate-x-1/2"
                        style={{
                          left: `${runtimeMarkerLeft}%`,
                          top: `${runtimeMarkerTop}%`,
                        }}
                      >
                        <div className="h-6 w-6 rounded-full border-2 border-blue-600 bg-white shadow" />
                      </div>
                    </div>

                    <div className="absolute left-0 top-2 bottom-8 flex w-8 flex-col justify-between text-[11px] text-gray-500">
                      {runtimeChartData.yAxisLabels.map((label, index) => (
                        <span key={index}>{label}%</span>
                      ))}
                    </div>

                    <div className="absolute left-8 right-2 bottom-0 flex justify-between text-[11px] text-gray-500">
                      {runtimeChartData.xAxisLabels.map((label, index) => (
                        <span key={index}>{label}ms</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 inline-flex rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm">
                    {runtimeChartData.densityPercent}% of solutions used {lastAcceptedSubmission.runtime} ms of runtime
                  </div>
                </div>
              </div>
            )}

            {/* Test Cases Passed */}
            {lastAcceptedSubmission.testsPassed !== undefined && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="font-semibold text-green-900 mb-2">
                  All {lastAcceptedSubmission.testsTotal} Test Cases Passed
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            {/* Code Section */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-3">Code</div>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-300">MySQL</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(lastAcceptedSubmission.code)}
                    className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="p-4 text-sm text-gray-200 overflow-x-auto font-mono">
                  {lastAcceptedSubmission.code}
                </pre>
              </div>
            </div>
          </div>
        );
      
      case 'submissions':
        if (submissions.length === 0) {
          return (
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white via-slate-50 to-emerald-50/60 px-6 py-14 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-emerald-200/30 blur-3xl" />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/70 bg-white/70 shadow-sm backdrop-blur">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No submissions yet</h3>
                <p className="mt-2 text-sm text-slate-500">Your accepted and rejected attempts will appear here with runtime and hidden-check summaries.</p>
              </div>
            </div>
          );
        }

        return (
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white/85 via-slate-50/80 to-white/70 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="absolute -top-10 right-8 h-24 w-24 rounded-full bg-emerald-200/35 blur-3xl" />
            <div className="absolute bottom-0 left-6 h-20 w-20 rounded-full bg-sky-200/25 blur-3xl" />

            <div className="relative border-b border-slate-200/70 bg-white/40 px-4 py-3 backdrop-blur">
              <div className="grid grid-cols-[40px_minmax(0,1.6fr)_120px_120px] items-center gap-3 text-sm font-medium text-slate-500">
                <div></div>
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  <span>Language</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div>Runtime</div>
              </div>
            </div>

            <div className="relative divide-y divide-white/50">
              {paginatedSubmissions.map((submission, index) => {
                const isAccepted = submission.status === 'Accepted';
                const visiblePassed = submission.visibleTestsPassed ?? submission.testsPassed ?? 0;
                const visibleTotal = submission.visibleTestsTotal ?? submission.testsTotal ?? 0;
                const hiddenPassed = submission.hiddenTestsPassed ?? 0;
                const hiddenTotal = submission.hiddenTestsTotal ?? 0;
                const absoluteIndex = ((currentSubmissionPage - 1) * SUBMISSION_PAGE_SIZE) + index;
                const theme = getSubmissionGlassyTheme(absoluteIndex, isAccepted);

                return (
                  <div
                    key={submission.id}
                    className={`relative overflow-hidden grid grid-cols-[40px_minmax(0,1.6fr)_120px_120px] items-start gap-3 px-4 py-3 backdrop-blur-sm transition-colors ${theme.rowBg} ${theme.rowHover} ${isAccepted ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (isAccepted) {
                        handleOpenAcceptedSubmission(submission);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (!isAccepted) {
                        return;
                      }

                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleOpenAcceptedSubmission(submission);
                      }
                    }}
                    role={isAccepted ? 'button' : undefined}
                    tabIndex={isAccepted ? 0 : -1}
                    aria-label={isAccepted ? `Open accepted submission ${submission.id}` : undefined}
                  >
                    <div className={`pointer-events-none absolute inset-y-0 right-0 w-28 opacity-70 blur-2xl ${theme.glowClass}`} />
                    <div className="pt-1 text-lg font-medium text-slate-500">{submission.id}</div>

                    <div className="relative min-w-0">
                      <div className={`text-[30px] leading-none ${theme.dotColor}`}>
                        {isAccepted ? '·' : '·'}
                      </div>
                      <div className={`-mt-3 text-[15px] font-medium ${theme.statusColor}`}>
                        {submission.status}
                      </div>
                      {isAccepted && (
                        <div className="text-[11px] font-medium text-blue-600">
                          Click to open in Accepted tab
                        </div>
                      )}
                      <div className="text-sm text-slate-600">{formatSubmissionTimestamp(submission.submittedAt)}</div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        Visible {visiblePassed}/{visibleTotal}
                        {hiddenTotal > 0 ? ` • Hidden ${hiddenPassed}/${hiddenTotal}` : ''}
                      </div>
                    </div>

                    <div className="relative pt-2 text-slate-600">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium shadow-sm backdrop-blur ${theme.chipClass}`}>
                        {submission.language}
                      </span>
                    </div>

                    <div className="relative pt-2 text-slate-700">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <svg className={`w-4 h-4 ${theme.runtimeIconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{submission.runtime ? `${submission.runtime} ms` : 'N/A'}</span>
                      </div>
                      {submission.testsPassed !== undefined && (
                        <div className="mt-1 text-[11px] text-slate-500">
                          {submission.testsPassed}/{submission.testsTotal} tests
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative px-4 pb-4">
              <PaginationControls
                currentPage={currentSubmissionPage}
                totalPages={totalSubmissionPages}
                totalItems={submissions.length}
                itemLabel="Submissions"
                onPageChange={setSubmissionPage}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  if (!problem) {
  return <div className="p-10 text-center">Problem not found.</div>;
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-12">
          {/* Left: Back Button */}
          <button
            onClick={() => navigate('/interview')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Problem List</span>
          </button>

          {/* Center: Problem Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleNavigatePreviousQuestion}
              disabled={previousQuestionId === null}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              title={previousQuestionId === null ? 'No previous problem' : `Go to problem ${previousQuestionId}`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-gray-600">Problem {safeProblem.id}</span>
            <button
              onClick={handleNavigateNextQuestion}
              disabled={nextQuestionId === null}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              title={nextQuestionId === null ? 'No next problem' : `Go to problem ${nextQuestionId}`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded hover:bg-gray-100 transition-colors" title="Notes">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100 transition-colors" title="Settings">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex gap-0 p-2 resize-container" style={{ height: 'calc(100vh - 49px)' }}>
        {/* Left Card - Problem Description */}
        <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mr-1" style={{ width: isMaximized ? '100%' : `${leftWidth}%` }}>
          {/* Tab Navigation */}
          <div className="flex items-center justify-between gap-1 border-b border-gray-200 bg-white px-1.5">
            <div className="flex min-w-0 flex-1">
              {[
                { 
                  key: 'description', 
                  label: 'Description',
                  icon: (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )
                },
                { 
                  key: 'editorial', 
                  label: 'Editorial',
                  icon: (
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )
                },
                { 
                  key: 'solutions', 
                  label: 'Solutions',
                  icon: (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )
                },
                ...(showAcceptedTab && lastAcceptedSubmission ? [{
                  key: 'accepted',
                  label: 'Accepted',
                  closable: true,
                  icon: (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }] : []),
                { 
                  key: 'submissions', 
                  label: 'Submissions',
                  icon: (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((tab) => (
                <div key={tab.key} className="relative flex min-w-0 flex-1">
                  <button
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`relative flex min-w-0 flex-1 items-center justify-center gap-1 px-1.5 py-2.5 text-xs font-semibold whitespace-nowrap leading-none transition-all sm:gap-1.5 sm:px-2 sm:text-[13px] ${
                      activeTab === tab.key
                        ? 'text-gray-900 bg-gray-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    } ${tab.closable ? 'pr-6 sm:pr-7' : ''}`}
                  >
                    <span className="shrink-0">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>

                  {tab.closable && (
                    <button
                      type="button"
                      onClick={handleCloseAcceptedTab}
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                      title="Close accepted tab"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Enlarge/Minimize Icon */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-gray-100 transition-colors"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>

          {/* Problem Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm text-gray-700 font-medium">{safeProblem.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Share">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
              <span className="text-xs text-gray-500 px-2 py-1 bg-white border border-gray-300 rounded">MySQL</span>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {renderTabContent()}
          </div>
        </div>

        {/* Draggable Divider */}
        {!isMaximized && (
          <div
            className="flex items-center justify-center cursor-col-resize hover:bg-blue-50 transition-colors group relative"
            style={{ width: '16px', flexShrink: 0 }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 group-hover:bg-blue-500 transition-all shadow-sm" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600" />
              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600" />
              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600" />
            </div>
          </div>
        )}

        {/* Right Side - Code Editor + Test Cases */}
        {!isMaximized && (
          <div className="flex flex-col gap-2 ml-1" style={{ width: `${100 - leftWidth}%` }}>
          {/* Code Editor Card */}
          <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 h-12 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Code</span>
                <select
                  className="px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MySQL">MySQL</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="SQLite">SQLite</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSqlCode(`-- Write your SQL query here
SELECT 
    
FROM 
    
WHERE 
    
ORDER BY 
    ;`)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                  title="Reset"
                >
                  Reset
                </button>
                <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-hidden bg-gray-900">
              <textarea
                value={sqlCode}
                onChange={(e) => setSqlCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    handleRunCode();
                  }
                }}
                className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none bg-gray-900 text-gray-100"
                style={{ 
                  fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                  lineHeight: '1.6',
                  tabSize: 4
                }}
                spellCheck={false}
                placeholder="-- Write your SQL query here&#10;SELECT &#10;    &#10;FROM &#10;    &#10;WHERE &#10;    &#10;ORDER BY &#10;    ;"
              />
            </div>
          </div>

          {/* Test Cases Card */}
          <div className="h-[280px] flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Test Case Tabs */}
            <div className="flex items-center border-b border-gray-200">
              <button
                onClick={() => setTestCaseTab('testcase')}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  testCaseTab === 'testcase'
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {testCaseTab === 'testcase' && (
                  <span className="mr-2">✓</span>
                )}
                Testcase
                {testCaseTab === 'testcase' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
                )}
              </button>
              <button
                onClick={() => setTestCaseTab('result')}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  testCaseTab === 'result'
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Test Result
                {testCaseTab === 'result' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
                )}
              </button>
            </div>

            {/* Test Case Content */}
            <div className="flex-1 overflow-y-auto">
              {testCaseTab === 'testcase' ? (
                <div className="p-4">
                  {/* Case Number Tabs */}
                  <div className="flex gap-2 mb-4 pb-3 border-b border-gray-200">
                    {editableTestCases.map((testCase, index: number) => (
                      <button
                        key={testCase.id}
                        onClick={() => setActiveTestCase(index)}
                        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                          activeTestCase === index
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {testCase.label}
                      </button>
                    ))}
                    <button
                      onClick={handleAddTestCase}
                      className="px-3 py-1.5 text-sm font-medium rounded border border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                      title="Add test case"
                    >
                      +
                    </button>
                    {editableTestCases.length === 0 && (
                      <div className="text-sm text-gray-500">No test cases available</div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    Edit the testcase inputs below. Added test cases are also checked when you run your SQL.
                  </p>

                  {/* Test Case Data */}
                  {activeEditableTestCase && (
                    <div className="space-y-4">
                      {activeEditableTestCase.tables.map((table: EditableTestTable, tableIndex: number) => (
                        <div key={tableIndex}>
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            {table.name} =
                          </div>
                          <div className="bg-gray-50 rounded border border-gray-200 overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  {table.columns.map((col: any, colIndex: number) => (
                                    <th key={colIndex} className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                                      {col.name}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {table.rows.map((row: string[], rowIndex: number) => (
                                  <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                                    {row.map((cell: string, cellIndex: number) => (
                                      <td key={cellIndex} className="px-3 py-2 font-mono text-gray-600 border-r border-gray-200 last:border-r-0">
                                        <input
                                          value={cell}
                                          onChange={(event) => handleTestCaseCellChange(activeTestCase, tableIndex, rowIndex, cellIndex, event.target.value)}
                                          className="w-full min-w-[80px] bg-transparent font-mono text-xs text-gray-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <button
                            onClick={() => handleAddRowToTable(activeTestCase, tableIndex)}
                            className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            + Add row to {table.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  {isRunning ? (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-blue-600 font-semibold text-sm">Running Test Cases</div>
                        <p className="text-gray-600 text-xs mt-1">Checking your SQL against your edited test cases.</p>
                      </div>
                    </div>
                  ) : testResult ? (
                    <div className="space-y-2">
                      {executionSummary && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                              Visible Cases
                            </div>
                            <div className="mt-1 text-lg font-semibold text-gray-900">
                              {executionSummary.visiblePassedCount}/{executionSummary.visibleCount}
                            </div>
                            <div className="text-xs text-gray-500">
                              {executionSummary.mode === 'submit' ? 'Shown on the problem page' : 'Checked in run'}
                            </div>
                          </div>
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                              Hidden Cases
                            </div>
                            <div className="mt-1 text-lg font-semibold text-gray-900">
                              {executionSummary.hiddenPassedCount}/{executionSummary.hiddenCount}
                            </div>
                            <div className="text-xs text-gray-500">
                              {executionSummary.hiddenCount > 0 ? 'Submit-only validation' : 'No hidden checks in this run'}
                            </div>
                          </div>
                        </div>
                      )}
                      {(() => {
                        const isSqlError = testResult.includes('SQL Syntax Error')
                          || testResult.includes('SQL Error')
                          || testResult.includes('SQL Runtime Error')
                          || testResult.includes('SQL Programming Error');
                        const isExecutionError = testResult.startsWith('❌ Error');
                        const isAcceptedResult = testResult.includes('✅');
                        const normalizedError = testResult.replace('❌ Error:\n', '').replace('❌ ', '');

                        return (
                          <div className="space-y-3">
                            {(isSqlError || isExecutionError) ? (
                              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                                <div className="text-rose-700 font-semibold text-sm">
                                  {isSqlError ? 'SQL Syntax Error' : 'Execution Error'}
                                </div>
                                <div className="text-gray-700 text-xs mt-2 font-mono bg-white/90 p-2 rounded border border-rose-100 whitespace-pre-wrap break-words">
                                  {normalizedError}
                                </div>
                              </div>
                            ) : (
                              <div className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                                isAcceptedResult
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border-rose-200 bg-rose-50 text-rose-700'
                              }`}>
                                {testResult}
                              </div>
                            )}

                            {executionDetails.length > 0 ? (
                              <div className="space-y-2">
                                {executionDetails.map((detail, index) => {
                                  const theme = getExecutionCardTheme(index, detail.passed);

                                  return (
                                    <div
                                      key={`${detail.label}-${index}`}
                                      className={`relative overflow-hidden rounded-2xl border p-3 shadow-[0_10px_25px_rgba(15,23,42,0.08)] backdrop-blur ${theme.cardClass}`}
                                    >
                                      <div className={`pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full blur-3xl ${theme.glowClass}`} />

                                      <div className="relative flex items-center justify-between gap-2">
                                        <div className="text-sm font-semibold text-slate-800">{detail.label}</div>
                                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${theme.badgeClass}`}>
                                          {detail.passed ? 'Passed' : 'Failed'}
                                        </span>
                                      </div>

                                      {detail.inputTables.length > 0 && (
                                        <div className="relative mt-3 rounded-xl border border-slate-200/80 bg-white/75 p-2">
                                          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                            Edited Input
                                          </div>
                                          <div className="space-y-2">
                                            {detail.inputTables.map((table, tableIndex) => {
                                              const effectiveRows = table.rows.filter((row) => row.some((cell) => cell.trim() !== ''));

                                              return (
                                                <div key={`${detail.label}-input-${table.name}-${tableIndex}`} className="rounded-lg border border-slate-200/80 bg-white/75 p-2">
                                                  <div className="mb-1 text-xs font-semibold text-slate-700">{table.name}</div>
                                                  <HighlightableResultTable
                                                    tableData={{
                                                      columns: table.columns.map((column) => column.name),
                                                      rows: effectiveRows.map((row) => row.map((cell) => (cell === '' ? 'NULL' : cell))),
                                                    }}
                                                    maxHeightClass="max-h-28"
                                                    emptyMessage="No rows inserted"
                                                  />
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      <div className="relative mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                                        <div className={`rounded-xl border p-2 ${theme.expectedOutputCardClass}`}>
                                          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                            Expected Output
                                          </div>
                                          {(() => {
                                            const tableData = toResultTableData(detail.expectedOutput);

                                            return <HighlightableResultTable tableData={tableData} />;
                                          })()}
                                        </div>
                                        <div className={`rounded-xl border p-2 ${theme.actualOutputCardClass}`}>
                                          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                            Executed Output
                                          </div>
                                          {(() => {
                                            const tableData = toResultTableData(detail.actualOutput);

                                            return <HighlightableResultTable tableData={tableData} />;
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (!isSqlError && !isExecutionError) ? (
                              <pre className="text-gray-700 text-xs whitespace-pre-wrap font-mono">{testResult}</pre>
                            ) : null}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-8">
                      You must run your code first
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTestCaseTab('result')}
                  className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
                >
                  Console
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSolvePage;

