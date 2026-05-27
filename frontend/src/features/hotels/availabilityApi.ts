import { baseApi } from '@app/store/baseApi';

export interface RoomTypeAvailability {
  roomTypeId: number;
  roomTypeName: string;
  description: string | null;
  basePrice: number;
  maxAdults: number;
  maxChildren: number;
  availableRooms: Array<{
    id: number;
    roomId: string;
    roomNumber: string;
    floor: number | null;
    adults: number;
    children: number;
  }>;
  totalAvailable: number;
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
