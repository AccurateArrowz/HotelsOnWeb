import { baseApi } from '@app/store/baseApi';
import type { HotelAvailabilityData } from '@hotelsonweb/shared';

export interface AvailabilityQueryParams {
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
}

export const availabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /hotels/:hotelId/availability?checkInDate&checkOutDate
    getHotelAvailability: builder.query<HotelAvailabilityData, AvailabilityQueryParams>({
      query: ({ hotelId, checkInDate, checkOutDate }) => ({
        url: `/hotels/${hotelId}/availability`,
        params: { checkInDate, checkOutDate },
      }),
      transformResponse: (response: { data: HotelAvailabilityData }) => response.data,
      providesTags: (_result, _error, { hotelId }) => [
        { type: 'Hotel', id: hotelId },
        'Booking',
      ],
    }),

  }),
});

export const {
  useGetHotelAvailabilityQuery,
  useLazyGetHotelAvailabilityQuery,
} = availabilityApi;
