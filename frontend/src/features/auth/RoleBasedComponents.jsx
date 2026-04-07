import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Loading } from '@shared/components';

// /**
//  * Component that renders children only if the user is authenticated.
//  * Otherwise, redirects to the login page.
//  */
export const RequireAuth = ({ children, redirectTo = '/login', onRequireLogin }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if(loading) {
    return <Loading message="Authenticating..." size="medium" />;
  }
  
  if (!user) {
    if (typeof onRequireLogin === 'function') {
      onRequireLogin();
      return null;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};


// /**
//  * Component that renders children only if the user has the specified permission.
//  * Otherwise, shows fallback or redirects.
//  */
export const RequirePermission = ({
  children,
  permission,
  redirectTo = '/unauthorized',
  fallback ,  
}) => {
  const { hasPermission } = useAuth();
  const location = useLocation();

  if (!hasPermission(permission)) {
    if (fallback !== undefined) {  //if fallback is null then, it will return null
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};



// /**
//  * Component that renders children only if the user has the specified role.
//  * Otherwise, shows fallback or redirects.
//  */
export const RequireRole = ({
  children,
  role,
  redirectTo = '/unauthorized',
  fallback,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if(!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (loading) {
    return <Loading message="Verifying permissions..." size="medium" />;
  }


  if (user?.role !== role) {
    if (fallback !== undefined) {
      return fallback;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};




