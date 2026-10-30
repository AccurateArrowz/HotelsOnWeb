import { createContext, ReactNode } from 'react';
import type { User } from '@hotelsonweb/shared';

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isRestoringSession: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  // TODO: hasPermission is called in RoleBasedComponents but not defined here
  hasPermission?: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
