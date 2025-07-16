import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Protected route that requires authentication
export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// Protected route that requires specific permission
export const PermissionRoute = ({ 
  children, 
  permission, 
  redirectTo = '/unauthorized',
  fallback = null 
}) => {
  const { hasPermission, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(permission)) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// Protected route that requires any of the specified permissions
export const AnyPermissionRoute = ({ 
  children, 
  permissions, 
  redirectTo = '/unauthorized',
  fallback = null 
}) => {
  const { hasAnyPermission, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAnyPermission(permissions)) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// Protected route that requires all of the specified permissions
export const AllPermissionsRoute = ({ 
  children, 
  permissions, 
  redirectTo = '/unauthorized',
  fallback = null 
}) => {
  const { hasAllPermissions, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAllPermissions(permissions)) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// Protected route that requires specific role
export const RoleRoute = ({ 
  children, 
  role, 
  redirectTo = '/unauthorized',
  fallback = null 
}) => {
  const { hasRole, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(role)) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// Protected route that requires any of the specified roles
export const AnyRoleRoute = ({ 
  children, 
  roles, 
  redirectTo = '/unauthorized',
  fallback = null 
}) => {
  const { hasAnyRole, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAnyRole(roles)) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// Route that only allows unauthenticated users (for login/signup pages)
export const GuestRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}; 