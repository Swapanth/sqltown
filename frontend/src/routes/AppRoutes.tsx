import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { LearningPathsPage } from '../pages/learning/LearningPathsPage';
import { InteractiveLessonPage } from '../pages/learning/InteractiveLessonPage';
import { QuestsPage } from '../pages/quests/QuestsPage';
import { LeaderboardPage } from '../pages/community/LeaderboardPage';
import { getLessonById } from '../data/mockLearningPaths';
import { Documentation } from '../pages/documentation/documentation';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { OAuthCallbackPage } from '../pages/auth/OAuthCallbackPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import {GroundPage} from '../pages/playground/playground';
import PracticePage from '../pages/playground/practice';

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/callback" element={<OAuthCallbackPage />} />

        {/* Protected routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning"
          element={
            <ProtectedRoute>
              <LearningPathsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <InteractiveLessonPage
                lesson={getLessonById(1)!}
                dialect="mysql"
                onComplete={() => console.log('Lesson completed')}
                onNext={() => console.log('Next lesson')}
                onPrevious={() => console.log('Previous lesson')}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quests"
          element={
            <ProtectedRoute>
              <QuestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documentation"
          element={
            <Documentation database="mysql" />
          }
        />
        <Route
          path="/documentation/:database"
          element={
            <Documentation />
          }
        />
        <Route
          path="/playground"
          element={<GroundPage />}
        />
        <Route
          path="/practice"
          element={<PracticePage />}
        />
      </Routes>
    </Router>
  );
};
