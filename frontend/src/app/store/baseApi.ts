import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
  type QueryReturnValue,
} from '@reduxjs/toolkit/query/react';
import { toast } from '@shared/utils/toast';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]> | null;
}

type BaseQueryResult = QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>;

// Flag to track the first API request for Render cold start notification
let isFirstRequest = true;

const baseQueryWithResponseHandler = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
): Promise<BaseQueryResult> => {
  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    prepareHeaders: (headers) => {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user) as { token?: string };
        if (userData.token) {
          headers.set('authorization', `Bearer ${userData.token}`);
        }
      }
      return headers;
    },
  });

  // Handle Render cold start notification on the very first request
  if (isFirstRequest) {
    isFirstRequest = false;
    toast.info('The backend is hosted on Render. Please wait 50-60 seconds for the first response while the server wakes up.', 8000);
  }

  const result = await baseQuery(args, api, extraOptions);

  // Handle standardized API response format
  if (result.data) {
    const responseData = result.data as ApiResponse<unknown>;
    if (responseData.success === true && 'data' in responseData) {
      return { ...result, data: responseData.data } as BaseQueryResult;
    }
  }

  // Handle error responses
  if (result.error) {
    const errorData = result.error.data as ApiErrorResponse | undefined;
    if (errorData && typeof errorData === 'object') {
      if (errorData.success === false) {
        return {
          data: undefined,
          error: {
            status: result.error.status,
            data: {
              message: errorData.message || 'An error occurred',
              errors: errorData.errors || null,
            },
          },
          meta: result.meta,
        } as BaseQueryResult;
      }
    }
  }

  return result as BaseQueryResult;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithResponseHandler,
  tagTypes: ['Hotel', 'Booking', 'User', 'HotelRequest', 'RoomType', 'Room'],
  endpoints: () => ({}),
});

export const { usePrefetch: useBaseApiPrefetch } = baseApi;
