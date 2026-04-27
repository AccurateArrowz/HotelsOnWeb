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
  q?: string;
  page?: number;
  limit?: number;
}

interface HotelsListResponse {
  hotels: Hotel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const hotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query<HotelsListResponse, GetHotelsParams | void>({
      query: ({ q, page = 1, limit = 20 } = {}) => ({
        url: '/hotels',
        params: { q, page, limit },
      }),
      providesTags: (result) => {
        if (!result) return [{ type: 'Hotel', id: 'LIST' }];
        return [{ type: 'Hotel', id: 'LIST' }];
      },
    }),
    getHotelById: builder.query<Hotel, number>({
      query: (id) => `/hotels/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Hotel', id }],
    }),
  }),
});

export const { useGetHotelsQuery, useLazyGetHotelsQuery, useGetHotelByIdQuery } = hotelsApi;
