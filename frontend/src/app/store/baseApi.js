import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API slice with common configuration
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage or Redux state
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        if (userData.token) {
          headers.set('authorization', `Bearer ${userData.token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Hotel', 'Booking', 'User'], // For cache invalidation
  endpoints: () => ({}), // Empty base - endpoints will be injected
});

// Export the hook for the API slice
export const { usePrefetch: useBaseApiPrefetch } = baseApi;
