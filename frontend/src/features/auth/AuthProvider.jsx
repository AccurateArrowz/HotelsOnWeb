import { useState, useEffect, useRef } from 'react';
import { useLoginMutation, useRegisterMutation, useRefreshMutation } from './authApi';
import { AuthContext } from './AuthContext';
import { useAppDispatch } from '@app/store/hooks';
import { setAccessToken, clearAccessToken } from './authSlice';

// Token refresh buffer: refresh 2 minutes before expiry
const TOKEN_REFRESH_BUFFER_MS = 2 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const refreshIntervalRef = useRef(null);

  // Keep Redux store in sync with local token state
  useEffect(() => {
    dispatch(accessToken ? setAccessToken(accessToken) : clearAccessToken());
  }, [accessToken, dispatch]);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [refreshMutation] = useRefreshMutation();

  // Parse JWT expiry time
  const getTokenExpiry = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const decoded = JSON.parse(atob(parts[1]));
      return decoded.exp ? decoded.exp * 1000 : null;
    } catch {
      return null;
    }
  };

  // Refresh token and schedule the next refresh
  const scheduleTokenRefresh = (token) => {
    // Clear existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) return;

    // Calculate time until refresh should happen
    const timeUntilRefresh = expiryTime - Date.now() - TOKEN_REFRESH_BUFFER_MS;

    if (timeUntilRefresh > 0) {
      refreshIntervalRef.current = setTimeout(async () => {
        try {
          console.log('[Token Refresh] Proactively refreshing token...');
          const result = await refreshMutation().unwrap();
          if (result.accessToken) {
            setAccessTokenState(result.accessToken);
            // Schedule next refresh
            scheduleTokenRefresh(result.accessToken);
          }
        } catch (error) {
          console.error('[Token Refresh] Failed to refresh token:', error);
          // If refresh fails, clear auth state
          setUser(null);
          setAccessTokenState(null);
        }
      }, timeUntilRefresh);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginMutation({ email, password }).unwrap();
      setUser(response.user);
      if (response.accessToken) {
        setAccessTokenState(response.accessToken);
        scheduleTokenRefresh(response.accessToken);
      }
      return response;
    } catch (error) {
      console.error('Login failed: ', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerMutation(userData).unwrap();
      setUser(response.user);
      if (response.accessToken) {
        setAccessTokenState(response.accessToken);
        scheduleTokenRefresh(response.accessToken);
      }
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      setAccessTokenState(null);
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const value = {
    user,
    accessToken,
    isLoginLoading,
    isRegisterLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
