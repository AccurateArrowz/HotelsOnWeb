// Auth context and hook
export { AuthProvider } from './AuthProvider';
export { useAuth } from './useAuth';

// // Auth components
export { default as AuthButton } from './AuthButton';
export { default as LoginModal } from './LoginModal';
export { default as LoginPage } from './LoginPage.jsx';
export { default as ProfileModal } from './ProfileModal';
export { default as SignupModal } from './SignupModal';

// // Role-based components and utilities
export { RequireAuth, RequireRole, RequirePermission} from './RoleBasedComponents'; 


// export { ProtectedRoute } from './ProtectedRoute';
