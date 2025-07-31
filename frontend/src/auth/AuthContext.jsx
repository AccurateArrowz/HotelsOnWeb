import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    // For now, we'll simulate a quick auth check
    // In a real app, you would check with your backend
    const checkAuth = async () => {
      try {
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check for stored user in localStorage as a fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const userData = await response.json();
      // setUser(userData);
      // return userData;
      
      // Mock login for now -- add permissions and role for demo
      const mockUser = {
        id: '1',
        email,
        name: 'Test User',
        role: 'admin', // Change as needed for demo
        permissions: [
          'book_hotels',
          'view_bookings',
          'manage_users',
          'delete_hotels',
        ],
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const newUser = await response.json();
      // return newUser;
      
      // Mock registration for now
      const mockUser = { id: '1', ...userData };
      return mockUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Permission and role helpers for RBAC
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions = []) => {
    if (!user || !user.permissions) return false;
    return permissions.some((perm) => user.permissions.includes(perm));
  };

  const hasRole = (role) => {
    if (!user || !user.role) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles = []) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
