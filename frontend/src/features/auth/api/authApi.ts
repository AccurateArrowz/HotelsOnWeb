import { baseApi } from '@app/store/baseApi';
import {
  type SignupFormValues,
} from '../schemas/signupForm.schema';
interface LoginRequest {
  email: string;
  password: string;
}

type SignupRequest = Omit<SignupFormValues, "confirmPassword">

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

interface ProfileResponse extends AuthUser {}

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
    register: builder.mutation<AuthResponse, SignupRequest>({
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
    getProfile: builder.mutation<ProfileResponse, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
      transformResponse: (response: { data: ProfileResponse }) => response.data,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useRefreshMutation, useGetProfileMutation } = authApi;
