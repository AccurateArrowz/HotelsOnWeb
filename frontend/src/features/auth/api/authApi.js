import { baseApi } from '../../../app/store/baseApi';

// Inject authentication endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Get current user profile
    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Update user profile
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for the injected endpoints
export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} = authApi;
