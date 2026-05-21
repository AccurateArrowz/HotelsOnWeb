import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoginLoading: false,
  isRegisterLoading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});
