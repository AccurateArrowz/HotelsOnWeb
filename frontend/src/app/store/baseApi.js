import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Custom base query that extracts data from standardized API responses
const baseQueryWithResponseHandler = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api',
    prepareHeaders: (headers, { getState }) => {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        if (userData.token) {
          headers.set('authorization', `Bearer ${userData.token}`);
        }
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  // Handle standardized API response format
  if (result.data) {
    // Extract data from standardized response: { success: true, data: ..., message: ... }
    if (result.data.success === true && 'data' in result.data) {
      return { ...result, data: result.data.data };
    }
  }

  // Handle error responses
  if (result.error) {
    const errorData = result.error.data;
    if (errorData && typeof errorData === 'object') {
      // Standardized error format: { success: false, message: ..., errors: ... }
      if (errorData.success === false) {
        return {
          ...result,
          error: {
            status: result.error.status,
            data: {
              message: errorData.message || 'An error occurred',
              errors: errorData.errors || null,
            },
          },
        };
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithResponseHandler,
  tagTypes: ['Hotel', 'Booking', 'User', 'HotelRequest'],
  endpoints: () => ({}),
});

export const { usePrefetch: useBaseApiPrefetch } = baseApi;
