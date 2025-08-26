import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { RootState, AppDispatch } from './store';
import { checkAuth } from './store/slices/authSlice';
import { setTheme } from './store/slices/uiSlice';
import MainLayout from './components/layout/MainLayout';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/common/ProtectedRoute';
import ToastManager from './components/common/ToastManager';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CourseBrowsePage = lazy(() => import('./pages/CourseBrowsePage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const VideoPlayerPage = lazy(() => import('./pages/VideoPlayerPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const StudyGroupsPage = lazy(() => import('./pages/StudyGroupsPage'));
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboard'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const { theme } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    // Check authentication status on app load
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkAuth());
    }

    // Apply theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (_e: MediaQueryListEvent) => {
      if (theme === 'system') {
        dispatch(setTheme('system')); // This will trigger the theme update
      }
    };
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [dispatch, theme]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ToastManager />
      
      <Suspense
        fallback={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          
          {/* Protected routes with layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CourseBrowsePage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            
            {/* Protected authenticated routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/study-groups" element={<StudyGroupsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/video/:videoId" element={<VideoPlayerPage />} />
              
              {/* Instructor only routes */}
              <Route path="/instructor/*" element={<InstructorDashboard />} />
            </Route>
          </Route>
          
          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Box>
  );
}

export default App;