import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Loading } from '@shared/components';

interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
  onRequireLogin?: () => void;
}

export const RequireAuth = ({ children, redirectTo = '/login', onRequireLogin }: RequireAuthProps) => {
  const { user, isRestoringSession } = useAuth();
  const location = useLocation();

  if (isRestoringSession) {
    return <Loading message="Authenticating..." size="medium" />;
  }
  
  if (!user) {
    if (typeof onRequireLogin === 'function') {
      onRequireLogin();
      return null;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface RequirePermissionProps {
  children: ReactNode;
  permission: string;
  redirectTo?: string;
  fallback?: ReactNode;
}

export const RequirePermission = ({
  children,
  permission,
  redirectTo = '/unauthorized',
  fallback,
}: RequirePermissionProps) => {
  const { hasPermission } = useAuth();
  const location = useLocation();

  // TODO: hasPermission is called here but not defined in AuthContext
  if (!hasPermission?.(permission)) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface RequireRoleProps {
  children: ReactNode;
  role: string;
  redirectTo?: string;
  fallback?: ReactNode;
}

export const RequireRole = ({
  children,
  role,
  redirectTo = '/unauthorized',
  fallback,
}: RequireRoleProps) => {
  const { user, isRestoringSession, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isRestoringSession) {
    return <Loading message="Verifying permissions..." size="medium" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== role) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
