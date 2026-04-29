import { baseApi } from '@app/store/baseApi';

export interface BookingRoom {
  id: number;
  roomTypeId: number;
  roomId?: number;
  pricePerNight: number;
  numberOfNights: number;
  totalPrice: number;
  roomType?: {
    id: number;
    name: string;
    basePrice: number;
  };
  room?: {
    id: number;
    roomNumber: string;
  };
}

export interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  bookingNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  specialRequests?: string;
  cancelledAt?: string;
  cancelledBy?: number;
  createdAt: string;
  updatedAt: string;
  hotel?: {
    id: number;
    name: string;
    street: string;
    city: string;
    country: string;
  };
  bookingRooms?: BookingRoom[];
}

export interface CreateBookingRequest {
  hotelId: number;
  roomTypeId: number;
  checkInDate: string;
  checkOutDate: string;
  specialRequests?: string;
}

export interface CreateBookingResponse {
  id: number;
  bookingNumber: string;
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  hotel: {
    name: string;
    address: string;
    city: string;
  };
  bookingRooms: Array<{
    roomTypeId: number;
    quantity: number;
    pricePerNight: number;
    roomType: {
      name: string;
      basePrice: number;
    };
  }>;
}

export interface PaymentRequest {
  paymentMethod: string;
}

export interface PaymentResponse {
  id: number;
  bookingNumber: string;
  paymentStatus: 'paid' | 'failed';
  status: string;
}

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserBookings: builder.query<Booking[], void>({
      query: () => '/bookings/user',
      providesTags: (result) => {
        if (!result) return [{ type: 'Booking', id: 'LIST' }];
        return [
          { type: 'Booking', id: 'LIST' },
          ...result.map((booking) => ({ type: 'Booking' as const, id: booking.id })),
        ];
      },
    }),

    getBookingById: builder.query<Booking, number>({
      query: (id) => `/bookings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),

    createBooking: builder.mutation<CreateBookingResponse, CreateBookingRequest>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),

    processPayment: builder.mutation<PaymentResponse, { id: number; paymentMethod: string }>({
      query: ({ id, paymentMethod }) => ({
        url: `/bookings/${id}/payment`,
        method: 'POST',
        body: { paymentMethod },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Booking', id }],
    }),

    cancelBooking: builder.mutation<PaymentResponse, number>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),
  }),
});

export const {
  useGetUserBookingsQuery,
  useLazyGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useProcessPaymentMutation,
  useCancelBookingMutation,
} = bookingsApi;
