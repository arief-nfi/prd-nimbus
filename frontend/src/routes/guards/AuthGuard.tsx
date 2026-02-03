import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PATHS } from '../paths';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Replace with actual auth logic
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};