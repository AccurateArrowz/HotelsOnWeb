import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

/**
 * Component that renders children only if the user is authenticated.
 * Otherwise, redirects to the login page.
 */
export const RequireAuth = ({ children, redirectTo = '/login' }) => {
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

/**
 * Component that renders children only if the user has the specified permission.
 * Otherwise, shows fallback or redirects.
 */
export const RequirePermission = ({
  children,
  permission,
  redirectTo = '/unauthorized',
  fallback = null,
}) => {
  const { hasPermission } = useAuth();
  const location = useLocation();

  if (!hasPermission(permission)) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Component that renders children only if the user has any of the specified permissions.
 * Otherwise, shows fallback or redirects.
 */
export const RequireAnyPermission = ({
  children,
  permissions = [],
  redirectTo = '/unauthorized',
  fallback = null,
}) => {
  const { hasAnyPermission } = useAuth();
  const location = useLocation();

  if (!hasAnyPermission(permissions)) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Component that renders children only if the user has the specified role.
 * Otherwise, shows fallback or redirects.
 */
export const RequireRole = ({
  children,
  role,
  redirectTo = '/unauthorized',
  fallback = null,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user?.role !== role) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Component that renders children only if the user has any of the specified roles.
 * Otherwise, shows fallback or redirects.
 */
export const RequireAnyRole = ({
  children,
  roles = [],
  redirectTo = '/unauthorized',
  fallback = null,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !roles.includes(user.role)) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Component that conditionally renders content based on the user's role.
 * Accepts a roleConfigs object with role keys and corresponding content.
 */
export const RoleBasedRender = ({
  roleConfigs = {},
  defaultContent = null,
}) => {
  const { user } = useAuth();
  const userRole = user?.role || 'guest';
  
  // Check for exact role match first
  if (roleConfigs[userRole]) {
    return roleConfigs[userRole];
  }
  
  // Fallback to default content if provided
  return defaultContent;
};
