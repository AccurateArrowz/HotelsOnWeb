import { useState, useEffect, useRef, ReactNode } from 'react';
import { useLoginMutation, useRegisterMutation, useRefreshMutation, useGetProfileMutation } from './api';
import { AuthContext, type AuthContextValue } from './AuthContext';
import { useAppDispatch } from '@app/store/hooks';
import { setAccessToken, clearAccessToken } from './authSlice';
import type { User } from '@hotelsonweb/shared';

const TOKEN_REFRESH_BUFFER_MS = 2 * 60 * 1000;

interface AuthProviderProps {
  children: ReactNode;
}

interface JWTPayload {
  exp?: number;
  [key: string]: any;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(accessToken ? setAccessToken(accessToken) : clearAccessToken());
  }, [accessToken, dispatch]);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [refreshMutation] = useRefreshMutation();
  const [getProfileMutation] = useGetProfileMutation();
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  const getTokenExpiry = (token: string): number | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const decoded: JWTPayload = JSON.parse(atob(parts[1]));
      return decoded.exp ? decoded.exp * 1000 : null;
    } catch {
      return null;
    }
  };

  const scheduleTokenRefresh = (token: string) => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) return;

    const timeUntilRefresh = expiryTime - Date.now() - TOKEN_REFRESH_BUFFER_MS;

    if (timeUntilRefresh > 0) {
      refreshIntervalRef.current = setTimeout(async () => {
        try {
          console.log('[Token Refresh] Proactively refreshing token...');
          const result = await refreshMutation().unwrap();
          if (result.accessToken) {
            setAccessTokenState(result.accessToken);
            scheduleTokenRefresh(result.accessToken);
          }
        } catch (error) {
          console.error('[Token Refresh] Failed to refresh token:', error);
          setUser(null);
          setAccessTokenState(null);
        }
      }, timeUntilRefresh);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refreshResult = await refreshMutation().unwrap();
        if (refreshResult.accessToken) {
          dispatch(setAccessToken(refreshResult.accessToken));
          setAccessTokenState(refreshResult.accessToken);
          scheduleTokenRefresh(refreshResult.accessToken);

          const profile = await getProfileMutation().unwrap();
          setUser(profile);
        }
      } catch (error) {
        // No valid refresh token cookie present; user stays logged out
      } finally {
        setIsRestoringSession(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
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

  const register = async (userData: any) => {
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

  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const value: AuthContextValue = {
    user,
    accessToken,
    isLoginLoading,
    isRegisterLoading,
    isRestoringSession,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
