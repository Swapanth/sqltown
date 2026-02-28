import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_LEVELS, type GameLevel } from '../data/levels';
import { GameLevelDatabase, type QueryResult } from '../services/gameDatabase';
import { initializeSqlJs } from '../services/sqlEngine';

interface LevelState {
  database: GameLevelDatabase | null;
  isInitialized: boolean;
  error: string | null;
}

const levels: GameLevel[] = GAME_LEVELS;

// Removed hardcoded levels array - now using imported GAME_LEVELS

export const GameDemo: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [cityElements, setCityElements] = useState<string[]>([]);
  const [levelState, setLevelState] = useState<LevelState>({
    database: null,
    isInitialized: false,
    error: null,
  });
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const level = levels[currentLevel - 1];

  // Initialize SQL.js and current level database on mount and level change
  useEffect(() => {
    const initializeLevel = async () => {
      try {
        // Initialize sql.js library
        await initializeSqlJs();

        // Create database for current level
        const db = new GameLevelDatabase(currentLevel);
        await db.initialize(level.schema);

        // Close previous database if exists
        if (levelState.database) {
          await levelState.database.close();
        }

        setLevelState({
          database: db,
          isInitialized: true,
          error: null,
        });

        // Clear previous inputs
        setUserInput('');
        setIsCorrect(null);
        setShowResult(false);
        setQueryResult(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Failed to initialize level:', errorMessage);
        setLevelState({
          database: null,
          isInitialized: false,
          error: errorMessage,
        });
      }
    };

    initializeLevel();
  }, [currentLevel, level.schema]);

  const checkAnswer = useCallback(async () => {
    if (!levelState.database || !levelState.isInitialized) {
      setIsCorrect(false);
      setShowResult(true);
      setQueryResult({
        success: false,
        error: 'Database not initialized. Please refresh the page.',
      });
      return;
    }

    setIsExecuting(true);

    try {
      // Execute the query
      const result = await levelState.database.executeQuery(userInput);
      setQueryResult(result);

      // Validate the query against expected command
      const validation = levelState.database.validateQueryExecution(
        userInput,
        level.sqlCommand
      );

      const isValid = validation.isValid && result.success;
      setIsCorrect(isValid);
      setShowResult(true);

      // If correct, add city elements and reward
      if (isValid && !completedLevels.includes(currentLevel)) {
        setCompletedLevels([...completedLevels, currentLevel]);

        // Add city elements based on level
        setTimeout(() => {
          setCityElements(prev => {
            switch (currentLevel) {
              case 1:
                return ['land'];
              case 2:
                return [...prev, 'foundation'];
              case 3:
                return [...prev, 'dharamshala'];
              case 4:
                return [...prev, 'population-layer'];
              case 5:
                return [...prev, 'pilgrims'];
              case 6:
                return [...prev, 'occupancy-indicator'];
              case 7:
                return prev.map(el =>
                  el === 'dharamshala' ? 'dharamshala-upgraded' : el
                );
              case 8:
                return [...prev, 'temple-foundation'];
              case 9:
                return [...prev, 'paths'];
              case 10:
                return [...prev, 'temple', 'active-movement'];
              default:
                return prev;
            }
          });
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error executing query:', errorMessage);
      setIsCorrect(false);
      setShowResult(true);
      setQueryResult({
        success: false,
        error: `Execution error: ${errorMessage}`,
      });
    } finally {
      setIsExecuting(false);
    }
  }, [levelState, userInput, level.sqlCommand, currentLevel, completedLevels]);

  const nextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
      setUserInput('');
      setIsCorrect(null);
      setShowResult(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'orange': return 'bg-orange-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SQLTown Interactive Demo
          </h1>
          <p className="text-gray-600">
            Build your sacred city through SQL commands
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {completedLevels.length}/{levels.length} levels
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedLevels.length / levels.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Game Interface */}
          <div className="space-y-6">
            {/* Level Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${getDifficultyColor(level.difficulty)}`} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Level {level.id} — {level.title}
                </h2>
                {level.isNew && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{level.description}</p>
              
              {/* Expected SQL Command */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Expected Command:</h3>
                <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                  {level.sqlCommand}
                </pre>
              </div>

              {/* SQL Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your SQL command:
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your SQL command here..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={checkAnswer}
                  disabled={isExecuting || !levelState.isInitialized}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isExecuting ? 'Executing...' : 'Execute SQL'}
                </button>
                {isCorrect && (
                  <button
                    onClick={nextLevel}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    disabled={currentLevel >= levels.length}
                  >
                    {currentLevel >= levels.length ? 'Complete!' : 'Next Level →'}
                  </button>
                )}
              </div>

              {/* Result */}
              <AnimatePresence>
                {showResult && queryResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-4 p-4 rounded-lg ${
                      isCorrect
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <span className="text-green-600">✅ Correct!</span>
                      ) : (
                        <span className="text-red-600">❌ Try again</span>
                      )}
                    </div>

                    {queryResult.success ? (
                      <>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Result:</strong> {queryResult.message}
                        </p>
                        {queryResult.selectResult && (
                          <div className="text-xs text-gray-600 mb-2">
                            <div className="font-mono">
                              {queryResult.selectResult.columns.join(' | ')}
                            </div>
                            {queryResult.selectResult.rows.map(
                              (row, idx) => (
                                <div key={idx} className="font-mono">
                                  {row.join(' | ')}
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {isCorrect && (
                          <p className="text-sm text-blue-700 font-medium">
                            🏙️ {level.cityChange}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-red-700">
                        <strong>Error:</strong> {queryResult.error}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel - City Visualization */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Your City: Vrindavan
            </h3>
            
            <div className="relative h-96 bg-gradient-to-b from-blue-200 to-green-200 rounded-lg overflow-hidden">
              {/* Sky */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-300 to-blue-200">
                <div className="absolute top-4 right-8 w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>

              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-green-400 to-green-300">
                
                {/* City Elements */}
                <AnimatePresence>
                  {cityElements.includes('land') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-0 left-0 right-0 h-full"
                    >
                      <div className="text-center pt-20 text-gray-600">
                        🌱 Sacred Land of Vrindavan
                      </div>
                    </motion.div>
                  )}

                  {cityElements.includes('foundation') && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute bottom-8 left-16 w-16 h-4 bg-gray-400 rounded"
                    />
                  )}

                  {(cityElements.includes('dharamshala') || cityElements.includes('dharamshala-upgraded')) && (
                    <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute bottom-8 left-12"
                    >
                      <div className={`w-24 ${cityElements.includes('dharamshala-upgraded') ? 'h-20' : 'h-16'} bg-orange-300 rounded-t-lg border-2 border-orange-400 transition-all duration-1000`}>
                        <div className="text-center pt-2 text-xs">🏠</div>
                        <div className="text-center text-xs font-bold">Dharamshala</div>
                        {cityElements.includes('occupancy-indicator') && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            👥 2
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {cityElements.includes('pilgrims') && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-4 left-20 text-lg"
                      >
                        👤
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-4 left-28 text-lg"
                      >
                        👤
                      </motion.div>
                    </>
                  )}

                  {cityElements.includes('temple-foundation') && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute bottom-8 right-16 w-20 h-4 bg-gray-400 rounded"
                    />
                  )}

                  {cityElements.includes('temple') && (
                    <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute bottom-8 right-12"
                    >
                      <div className="w-28 h-24 bg-purple-300 rounded-t-lg border-2 border-purple-400">
                        <div className="text-center pt-2 text-lg">🕌</div>
                        <div className="text-center text-xs font-bold">Temple</div>
                      </div>
                    </motion.div>
                  )}

                  {cityElements.includes('paths') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-12 left-36 right-40 h-1 bg-yellow-600 rounded"
                    />
                  )}

                  {cityElements.includes('active-movement') && (
                    <motion.div
                      animate={{ x: [0, 100, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute bottom-16 left-36 text-lg"
                    >
                      🚶‍♂️
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* City Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentLevel}</div>
                <div className="text-xs text-gray-600">Level</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {cityElements.includes('pilgrims') ? '2' : '0'}
                </div>
                <div className="text-xs text-gray-600">Population</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {cityElements.filter(el => ['dharamshala', 'dharamshala-upgraded', 'temple'].includes(el)).length}
                </div>
                <div className="text-xs text-gray-600">Buildings</div>
              </div>
            </div>

            {/* Final Achievement */}
            {currentLevel === 10 && completedLevels.includes(10) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg text-center"
              >
                <div className="text-2xl mb-2">🎉 Congratulations! 🎉</div>
                <div className="font-bold">Your first active city is complete!</div>
                <div className="text-sm mt-2">
                  Vrindavan now has living pilgrims moving between the Dharamshala and Temple
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDemo;
