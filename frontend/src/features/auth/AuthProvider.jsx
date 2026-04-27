import { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from './authApi';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const login = async (email, password) => {
    try {
      const userData = await loginMutation({ email, password }).unwrap();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login failed: ', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await registerMutation(userData).unwrap();
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoginLoading,
    isRegisterLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};