import { baseApi } from '@app/store/baseApi';

interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  starRating: number;
  amenities: string[];
  images: string[];
  ownerId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetHotelsParams {
  search?: string;
  limit?: number;
  offset?: number;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface HotelsListResponse {
  data: Hotel[];
  pagination: Pagination;
}

export const hotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query<HotelsListResponse, GetHotelsParams | void>({
      query: ({ search, limit = 20, offset = 0 } = {}) => ({
        url: '/hotels',
        params: { search, limit, offset },
      }),
      transformResponse: (response: { data: Hotel[]; pagination: Pagination }) => ({
        data: response.data,
        pagination: response.pagination,
      }),
      providesTags: () => [{ type: 'Hotel', id: 'LIST' }],
    }),
    getHotelById: builder.query<Hotel, number>({
      query: (id) => `/hotels/${id}`,
      transformResponse: (response: { data: Hotel }) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Hotel', id }],
    }),
  }),
});

export const { useGetHotelsQuery, useLazyGetHotelsQuery, useGetHotelByIdQuery } = hotelsApi;
