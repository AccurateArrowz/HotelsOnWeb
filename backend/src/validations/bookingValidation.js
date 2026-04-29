const { z } = require('zod');

const createBookingSchema = z.object({
  body: z.object({
    hotelId: z.number().int().positive('Hotel ID must be a positive integer'),
    roomTypeId: z.number().int().positive('Room Type ID must be a positive integer'),
    checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-in date must be in YYYY-MM-DD format'),
    checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-out date must be in YYYY-MM-DD format'),
    specialRequests: z.string().max(500, 'Special requests must not exceed 500 characters').optional(),
  }).refine((data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    return checkOut > checkIn;
  }, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  }),
});

const paymentSchema = z.object({
  body: z.object({
    paymentMethod: z.string().min(1, 'Payment method is required').max(50, 'Payment method must not exceed 50 characters'),
  }),
});

module.exports = {
  createBookingSchema,
  paymentSchema,
};
