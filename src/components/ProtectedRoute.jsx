import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // User not logged in, bounce to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // User logged in but lacks clearance for this specific route
    // Could build a generic 'Unauthorized' page, but bouncing them home is better
    return <Navigate to="/" replace />;
  }

  // User is cleared!
  return children;
};

export default ProtectedRoute;
