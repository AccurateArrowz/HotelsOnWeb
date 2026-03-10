import { baseApi } from '../../../app/store/baseApi';

// Inject booking-related endpoints
export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create new booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'], // Invalidate cache after mutation
    }),

    // Get user's bookings
    getUserBookings: builder.query({
      query: () => '/bookings/user',
      providesTags: ['Booking'],
    }),

    // Get booking by ID
    getBookingById: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    // Process payment
    processPayment: builder.mutation({
      query: ({ bookingId, paymentData }) => ({
        url: `/bookings/${bookingId}/payment`,
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: 'Booking', id: bookingId },
      ],
    }),

    // Cancel booking
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, bookingId) => [
        { type: 'Booking', id: bookingId },
      ],
    }),
  }),
});

// Export hooks for the injected endpoints
export const {
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useProcessPaymentMutation,
  useCancelBookingMutation,
} = bookingApi;
