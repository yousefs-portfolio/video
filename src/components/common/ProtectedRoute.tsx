import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface ProtectedRouteProps {
  requireRole?: 'student' | 'instructor' | 'admin';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requireRole, 
  redirectTo = '/login' 
}) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireRole && user?.role !== requireRole) {
    // User doesn't have the required role
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has the required role (if specified)
  return <Outlet />;
};

export default ProtectedRoute;