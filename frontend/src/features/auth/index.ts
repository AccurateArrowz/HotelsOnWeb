// Auth context and hook
export { AuthProvider } from './context/AuthProvider';
export { useAuth } from './context/useAuth';
export { AuthContext, type AuthContextValue } from './context/AuthContext';

// Auth components
export { default as AuthButton } from './components/AuthButton';
export { default as LoginForm } from './components/LoginForm';
export { default as SignupForm } from './components/SignupForm';
export { default as ProfileModal } from './components/ProfileModal';
export { default as ProfilePage } from './pages/ProfilePage';

// Role-based components and utilities
export { RequireAuth, RequireRole} from './components/RoleBasedComponents';
