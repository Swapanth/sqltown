import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { LearningPathsPage } from '../pages/learning/LearningPathsPage';
import { InteractiveLessonPage } from '../pages/learning/InteractiveLessonPage';
import { QuestsPage } from '../pages/quests/QuestsPage';
import { LeaderboardPage } from '../pages/community/LeaderboardPage';
import { getLessonById } from '../data/mockLearningPaths';
import { Documentation } from '../pages/documentation/documentation';

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/learning" element={<LearningPathsPage />} />
        <Route
          path="/lesson/:lessonId"
          element={
            <InteractiveLessonPage
              lesson={getLessonById(1)!}
              dialect="mysql"
              onComplete={() => console.log('Lesson completed')}
              onNext={() => console.log('Next lesson')}
              onPrevious={() => console.log('Previous lesson')}
            />
          }
        />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/documentation" element={<Documentation database="mysql" />} />
        <Route path="/documentation/:database" element={<Documentation />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};
