import { api } from './api.js';

const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async () => {
    const response = await api.get('/bookings/user');
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Process payment
  processPayment: async (bookingId, paymentData) => {
    const response = await api.post(`/bookings/${bookingId}/payment`, paymentData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  }
};

export default bookingService;
