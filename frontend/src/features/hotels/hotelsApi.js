import { baseApi } from '@app/store/baseApi';

export const hotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: ({ q, page = 1, limit = 20 } = {}) => ({
        url: '/hotels',
        params: { q, page, limit },
      }),
      providesTags: (result) => {
        if (!result) return [{ type: 'Hotel', id: 'LIST' }];
        return [{ type: 'Hotel', id: 'LIST' }];
      },
    }),
    getHotelById: builder.query({
      query: (id) => `/hotels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hotel', id }],
    }),
  }),
});

export const { useGetHotelsQuery, useLazyGetHotelsQuery, useGetHotelByIdQuery } = hotelsApi;
