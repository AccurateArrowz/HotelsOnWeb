import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// Component that renders children only if user has specific permission
export const RequirePermission = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return fallback;
  }
  
  return children;
};

// Component that renders children only if user has any of the specified permissions
export const RequireAnyPermission = ({ permissions, children, fallback = null }) => {
  const { hasAnyPermission } = useAuth();
  
  if (!hasAnyPermission(permissions)) {
    return fallback;
  }
  
  return children;
};

// Component that renders children only if user has all of the specified permissions
export const RequireAllPermissions = ({ permissions, children, fallback = null }) => {
  const { hasAllPermissions } = useAuth();
  
  if (!hasAllPermissions(permissions)) {
    return fallback;
  }
  
  return children;
};

// Component that renders children only if user has specific role
export const RequireRole = ({ role, children, fallback = null }) => {
  const { hasRole } = useAuth();
  
  if (!hasRole(role)) {
    return fallback;
  }
  
  return children;
};

// Component that renders children only if user has any of the specified roles
export const RequireAnyRole = ({ roles, children, fallback = null }) => {
  const { hasAnyRole } = useAuth();
  
  if (!hasAnyRole(roles)) {
    return fallback;
  }
  
  return children;
};

// Component that renders different content based on user role
export const RoleBasedRender = ({ roleConfigs, fallback = null }) => {
  const { user } = useAuth();
  
  if (!user) {
    return fallback;
  }
  
  const config = roleConfigs[user.role];
  if (!config) {
    return fallback;
  }
  
  return config;
};

// Component that shows content only for authenticated users
export const RequireAuth = ({ children, fallback = null }) => {
  const { user } = useAuth();
  
  if (!user) {
    return fallback;
  }
  
  return children;
};

// Component that shows content only for unauthenticated users
export const RequireGuest = ({ children, fallback = null }) => {
  const { user } = useAuth();
  
  if (user) {
    return fallback;
  }
  
  return children;
};

// Higher-order component for protecting components with permissions
export const withPermission = (WrappedComponent, permission) => {
  return (props) => (
    <RequirePermission permission={permission}>
      <WrappedComponent {...props} />
    </RequirePermission>
  );
};

// Higher-order component for protecting components with roles
export const withRole = (WrappedComponent, role) => {
  return (props) => (
    <RequireRole role={role}>
      <WrappedComponent {...props} />
    </RequireRole>
  );
}; 