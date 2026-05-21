import { baseApi } from '@app/store/baseApi';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  roleId?: number;
}

interface AuthResponse {
  user: AuthUser;
  accessToken?: string;
  token?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useRefreshMutation } = authApi;
