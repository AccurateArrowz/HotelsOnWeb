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
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
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
  // Get access token from Redux state
  const accessToken = (api.getState() as { auth: { accessToken: string | null } }).auth.accessToken;

  // Prepare fetch args with token in Authorization header
  let fetchArgs = args;
  if (typeof args === 'string') {
    fetchArgs = {
      url: args,
      headers: {},
    };
  } else if (typeof args === 'object') {
    fetchArgs = {
      ...args,
      headers: {
        ...args.headers,
      },
    };
  }

  // Add Authorization header if token exists
  if (accessToken && typeof fetchArgs === 'object') {
    (fetchArgs as FetchArgs).headers = {
      ...((fetchArgs as FetchArgs).headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
  }

  const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    credentials: 'include',
  });

  // Handle Render cold start notification on the very first request
  if (isFirstRequest) {
    isFirstRequest = false;
    toast.info('The backend is hosted on Render free tier. First response can take upto 50-60 seconds.', 8000);
  }

  let result = await rawBaseQuery(fetchArgs, api, extraOptions);

  // Handle 401 Unauthorized - attempt to refresh token
  if (result.error && result.error.status === 401) {
    console.log('[BaseQuery] Received 401 - attempting to refresh token');

    // Try to refresh the token
    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const refreshData = refreshResult.data as any;
      if (refreshData.success && refreshData.data?.accessToken) {
        // Dispatch new token into Redux state
        const newAccessToken = refreshData.data.accessToken;
        const { setAccessToken } = await import('@features/auth/authSlice');
        api.dispatch(setAccessToken(newAccessToken));

        // Retry original request with new token
        (fetchArgs as FetchArgs).headers = {
          ...((fetchArgs as FetchArgs).headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };

        result = await rawBaseQuery(fetchArgs, api, extraOptions);
      } else {
        // Refresh token not in expected format, logout user
        const { clearAccessToken } = await import('@features/auth/authSlice');
        api.dispatch(clearAccessToken());
        window.location.href = '/';
      }
    } else {
      // Refresh failed, logout user
      const { clearAccessToken } = await import('@features/auth/authSlice');
      api.dispatch(clearAccessToken());
      window.location.href = '/';
    }
  }

  // Handle standardized API response format
  if (result.data) {
    const responseData = result.data as ApiResponse<unknown>;
    if (responseData.success === true && 'data' in responseData) {
      // Preserve all top-level fields including success (e.g. pagination, message)
      return { ...result, data: responseData } as BaseQueryResult;
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
