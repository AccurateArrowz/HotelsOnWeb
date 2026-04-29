// Auth context and hook
export { AuthProvider } from './AuthProvider';
export { useAuth } from './useAuth';

// Auth components
export { default as AuthButton } from './AuthButton';
export { default as LoginForm } from './LoginForm';
export { default as SignupForm } from './SignupForm';
export { default as ProfileModal } from './ProfileModal';
export { default as ProfilePage } from './pages/ProfilePage';

// // Role-based components and utilities
export { RequireAuth, RequireRole, RequirePermission} from './RoleBasedComponents'; 


// export { ProtectedRoute } from './ProtectedRoute';
