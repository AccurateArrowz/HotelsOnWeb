import { baseApi } from '../../../app/store/baseApi';

// Inject hotel-related endpoints
export const hotelApiEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get hotels by search query (city or hotel name) with pagination
    getHotels: builder.query({
      query: ({ q, page = 1, limit = 20 }) => ({
        url: '/hotels',
        params: { q, page, limit },
      }),
      providesTags: ['Hotel'], // Cache invalidation tag
    }),

    // Get single hotel by ID
    getHotelById: builder.query({
      query: (id) => `/hotels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hotel', id }],
    }),

    // Search hotels
    searchHotels: builder.query({
      query: ({ searchTerm, filters = {} }) => ({
        url: '/hotels/search',
        params: { q: searchTerm, ...filters },
      }),
      providesTags: ['Hotel'],
    }),
  }),
});

// Export hooks for the injected endpoints
export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useSearchHotelsQuery,
} = hotelApiEndpoints;
