import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/landing/LandingPage';
import { RoleSelectPage } from '../pages/auth/RoleSelectPage';
import { StudentLoginPage } from '../pages/auth/StudentLoginPage';
import { ParentLoginPage } from '../pages/auth/ParentLoginPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { ParentDashboard } from '../pages/parent/ParentDashboard';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { useAuth } from '../contexts/AuthContext';

export const AppRoutes: React.FC = () => {
  const { user, role } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<RoleSelectPage />} />
      <Route path="/login/student" element={<StudentLoginPage />} />
      <Route path="/login/parent" element={<ParentLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />

      {/* Role-Specific Dashboards */}
      <Route path="/student/dashboard/*" element={<StudentDashboard />} />
      <Route path="/parent/dashboard/*" element={<ParentDashboard />} />
      <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

      {/* Catch-all redirect to Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
