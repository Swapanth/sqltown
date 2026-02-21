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
import InterviewPage from '../pages/interview/InterviewPage';
import Navbar from '../components/layout/Navbar';
import PracticePage from '../pages/playground/practice';
import PracticeListPage from '../pages/playground/PracticeListPage';

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Navbar />
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
              <DashboardPage />
          }
        />
        <Route
          path="/learning"
          element={
            
              <LearningPathsPage />
            
          }
        />
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
        <Route
          path="/quests"
          element={
            
              <QuestsPage />
            
          }
        />
        <Route
          path="/leaderboard"
          element={
            
              <LeaderboardPage />
            
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
          path="/interview"
          element={
              <InterviewPage />
          }
        />
        <Route
          path="/practice/:dbId"
          element={<PracticePage />}
        />
        <Route
        path="/practice"
          element={<PracticeListPage />}
          />
      </Routes>
    </Router>
  );
};
