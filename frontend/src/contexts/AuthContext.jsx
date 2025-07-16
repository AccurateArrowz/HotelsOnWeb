import React, { createContext, useContext, useState, useEffect } from 'react';

// Define roles and their permissions
export const ROLES = {
  GUEST: 'guest',
  USER: 'user',
  HOTEL_OWNER: 'hotelOwner',
  ADMIN: 'admin'
};

export const PERMISSIONS = {
  // Hotel-related permissions
  VIEW_HOTELS: 'view_hotels',
  BOOK_HOTELS: 'book_hotels',
  MANAGE_HOTELS: 'manage_hotels',
  DELETE_HOTELS: 'delete_hotels',
  
  // Booking-related permissions
  VIEW_BOOKINGS: 'view_bookings',
  CREATE_BOOKINGS: 'create_bookings',
  CANCEL_BOOKINGS: 'cancel_bookings',
  MANAGE_ALL_BOOKINGS: 'manage_all_bookings',
  
  // User-related permissions
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  DELETE_USERS: 'delete_users',
  
  // Review-related permissions
  CREATE_REVIEWS: 'create_reviews',
  MODERATE_REVIEWS: 'moderate_reviews',
  
  // Admin permissions
  ACCESS_ADMIN_PANEL: 'access_admin_panel',
  MANAGE_SYSTEM: 'manage_system'
};

// Role-permission mapping
const ROLE_PERMISSIONS = {
  [ROLES.GUEST]: [
    PERMISSIONS.VIEW_HOTELS
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_HOTELS,
    PERMISSIONS.BOOK_HOTELS,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKINGS,
    PERMISSIONS.CREATE_REVIEWS
  ],
  [ROLES.HOTEL_OWNER]: [
    PERMISSIONS.VIEW_HOTELS,
    PERMISSIONS.MANAGE_HOTELS,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.MANAGE_ALL_BOOKINGS,
    PERMISSIONS.MODERATE_REVIEWS
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_HOTELS,
    PERMISSIONS.MANAGE_HOTELS,
    PERMISSIONS.DELETE_HOTELS,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.MANAGE_ALL_BOOKINGS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.MODERATE_REVIEWS,
    PERMISSIONS.ACCESS_ADMIN_PANEL,
    PERMISSIONS.MANAGE_SYSTEM
  ]
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Login function
  const login = (email, password) => {
    // Mock authentication - in real app, this would call an API
    const mockUsers = [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: ROLES.USER, password: 'password123' },
      { id: 2, name: 'Bob', email: 'bob@example.com', role: ROLES.HOTEL_OWNER, password: 'password123' },
      { id: 3, name: 'Carol', email: 'carol@example.com', role: ROLES.ADMIN, password: 'password123' },
      { id: 4, name: 'Guest', email: 'guest@example.com', role: ROLES.GUEST, password: 'password123' }
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Register function
  const register = (userData) => {
    // Mock registration - in real app, this would call an API
    const newUser = {
      id: Date.now(),
      ...userData,
      role: ROLES.USER // Default role for new registrations
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 