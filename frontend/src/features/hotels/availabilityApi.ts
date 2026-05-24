import { baseApi } from '@app/store/baseApi';

export interface RoomTypeAvailability {
  roomTypeId: number;
  name: string;
  description: string | null;
  basePrice: number;
  adults: number;
  children: number;
  totalRooms: number;
  bookedRooms: number;
  availableRooms: number;
  nights: number;
  totalPrice: number;
  isAvailable: boolean;
}

export interface HotelAvailabilityResponse {
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
  roomTypes: RoomTypeAvailability[];
}

export interface AvailabilityQueryParams {
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
}

export const availabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /hotels/:hotelId/availability?checkInDate&checkOutDate
    getHotelAvailability: builder.query<HotelAvailabilityResponse, AvailabilityQueryParams>({
      query: ({ hotelId, checkInDate, checkOutDate }) => ({
        url: `/hotels/${hotelId}/availability`,
        params: { checkInDate, checkOutDate },
      }),
      transformResponse: (response: { data: HotelAvailabilityResponse }) => response.data,
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
