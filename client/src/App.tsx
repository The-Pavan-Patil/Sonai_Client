// App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Pages/Login';
import Portfolio from './Pages/Portfolio';
import ProjectDetails from './Pages/ProjectDetails';
import AdminDashboard from './Pages/AdminDashboard';
import ProjectManagement from './Pages/ProjectManagement';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Portfolio/>} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        
        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/admin/projects" 
          element={
            <ProtectedRoute>
              <ProjectManagement />
            </ProtectedRoute>
          } 
        />
        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
