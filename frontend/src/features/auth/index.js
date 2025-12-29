// Auth context and hook
export { AuthProvider, useAuth } from './AuthContext';

// Auth components
export { default as AuthButton } from './AuthButton';
export { default as LoginModal } from './LoginModal';
export { default as ProfileModal } from './ProfileModal';
export { default as SignupModal } from './SignupModal';

// Role-based components and utilities
export {
  RequireAuth,
  ShowIfPermission,
  RequirePermission,
  RequireAnyPermission,
  RequireRole,
  RequireAnyRole,
  RoleBasedRender
} from './RoleBasedComponents';

export { ProtectedRoute } from './ProtectedRoute';
