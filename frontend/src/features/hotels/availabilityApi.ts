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

export interface RoomTypeAvailabilityCheck {
  available: boolean;
  roomTypeId: number;
  roomTypeName: string;
  totalRooms: number;
  bookedRooms: number;
  availableRooms: number;
  nights: number;
  basePrice: number;
  totalPrice: number;
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
      providesTags: (_result, _error, { hotelId }) => [
        { type: 'Hotel', id: hotelId },
        'Booking',
      ],
    }),

    // GET /hotels/:hotelId/availability/:roomTypeId?checkInDate&checkOutDate
    getRoomTypeAvailability: builder.query<
      RoomTypeAvailabilityCheck,
      AvailabilityQueryParams & { roomTypeId: number }
    >({
      query: ({ hotelId, roomTypeId, checkInDate, checkOutDate }) => ({
        url: `/hotels/${hotelId}/availability/${roomTypeId}`,
        params: { checkInDate, checkOutDate },
      }),
      providesTags: (_result, _error, { hotelId, roomTypeId }) => [
        { type: 'RoomType', id: roomTypeId },
        { type: 'Hotel', id: hotelId },
      ],
    }),
  }),
});

export const {
  useGetHotelAvailabilityQuery,
  useLazyGetHotelAvailabilityQuery,
  useGetRoomTypeAvailabilityQuery,
  useLazyGetRoomTypeAvailabilityQuery,
} = availabilityApi;
