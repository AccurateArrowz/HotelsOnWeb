import { Router } from 'express';
import { BookingController } from './booking.controller';
import { authenticateToken } from '@/middleware/auth.middleware';

const router = Router();
const bookingController = new BookingController();

/**
 * Public routes
 */

/**
 * GET /bookings/stats
 * Get booking statistics
 */
router.get('/stats', bookingController.getStatistics);

/**
 * GET /bookings/revenue
 * Get revenue statistics
 */
router.get('/revenue', bookingController.getRevenueStatistics);

/**
 * GET /bookings/active
 * Get active bookings
 */
router.get('/active', bookingController.getActiveBookings);

/**
 * GET /bookings/status/:status
 * Get bookings by status
 */
router.get('/status/:status', bookingController.getBookingsByStatus);

/**
 * GET /bookings/hotel/:hotelId
 * Get bookings by hotel
 */
router.get('/hotel/:hotelId', bookingController.getBookingsByHotel);

/**
 * GET /bookings/:id
 * Get booking by ID
 */
router.get('/:id', bookingController.getBookingById);

/**
 * Protected routes
 */

/**
 * GET /bookings
 * Get bookings by user
 */
router.get('/', authenticateToken, bookingController.getBookingsByUser);

/**
 * POST /bookings
 * Create new booking
 */
router.post('/', authenticateToken, bookingController.createBooking);

/**
 * PUT /bookings/:id
 * Update booking
 */
router.put('/:id', authenticateToken, bookingController.updateBooking);

/**
 * POST /bookings/:id/cancel
 * Cancel booking
 */
router.post('/:id/cancel', authenticateToken, bookingController.cancelBooking);

/**
 * POST /bookings/:id/confirm
 * Confirm booking
 */
router.post('/:id/confirm', authenticateToken, bookingController.confirmBooking);

/**
 * POST /bookings/:id/complete
 * Complete booking
 */
router.post('/:id/complete', authenticateToken, bookingController.completeBooking);

/**
 * POST /bookings/:id/rooms
 * Add rooms to booking
 */
router.post('/:id/rooms', authenticateToken, bookingController.addRoomsToBooking);

/**
 * DELETE /bookings/:id/rooms/:roomId
 * Remove room from booking
 */
router.delete('/:id/rooms/:roomId', authenticateToken, bookingController.removeRoomFromBooking);

export default router;
