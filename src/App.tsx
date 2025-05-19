import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import InterviewsPage from './pages/InterviewsPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateDetailsPage from './pages/CandidateDetailsPage';
import UsersPage from './pages/UsersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import CandidateInterviewPage from './pages/CandidateInterviewPage';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();

  console.log('ProtectedRoute - isLoading:', isLoading, 'currentUser:', currentUser);
  
  if (isLoading) {
    console.log('ProtectedRoute - Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    console.log('ProtectedRoute - User role not allowed:', currentUser.role, 'Allowed roles:', allowedRoles);
    // Redirect to an appropriate page based on user role
    if (currentUser.role === UserRole.CANDIDATE) {
       console.log('ProtectedRoute - Redirecting CANDIDATE to /interview');
      return <Navigate to="/interview" replace />;
    }
    console.log('ProtectedRoute - Redirecting other roles to /');
    return <Navigate to="/" replace />;
  }
  
  console.log('ProtectedRoute - Access granted');
  return <>{children}</>;
};

const CandidateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

   console.log('CandidateRoute - isLoading:', isLoading, 'currentUser:', currentUser);
  
  if (isLoading) {
    console.log('CandidateRoute - Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    console.log('CandidateRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== UserRole.CANDIDATE) {
    console.log('CandidateRoute - User is not CANDIDATE, redirecting to /');
    return <Navigate to="/" replace />;
  }

   console.log('CandidateRoute - Access granted');
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Candidate Routes */}
          <Route path="/interview/:id" element={
            <CandidateInterviewPage />
          } />
          
          {/* Admin Routes */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HIRING_MANAGER]}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="departments" element={
              <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <DepartmentsPage />
              </ProtectedRoute>
            } />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="candidates/:id" element={<CandidateDetailsPage />} />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={
              <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <SettingsPage />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;