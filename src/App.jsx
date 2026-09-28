import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecommendationPage from './pages/RecommendationPage';
import AssessmentPage from './pages/AssessmentPage';
import TimetablePage from './pages/TimetablePage';
import ReviewsPage from './pages/ReviewsPage';
import ProfilePage from './pages/ProfilePage';
import RegistrationStepPage from './pages/RegistrationStepPage';
import GpaSimulatorPage from './pages/GpaSimulatorPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage initialMode="signin" />} />
          <Route path="/register" element={<LoginPage initialMode="signup" />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="registration" element={<RegistrationStepPage />} />
            <Route path="gpa-simulator" element={<GpaSimulatorPage />} />
            <Route path="recommendations" element={<RecommendationPage />} />
            <Route path="recommendation" element={<RecommendationPage />} />
            <Route path="assessment" element={<AssessmentPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
