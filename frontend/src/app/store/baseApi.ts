import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
  type QueryReturnValue,
} from '@reduxjs/toolkit/query/react';

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

const baseQueryWithResponseHandler = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
): Promise<BaseQueryResult> => {
  const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api',
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
