const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');

// Create a new booking (protected route)
router.post('/', authenticateToken, bookingController.createBooking);

// Get user's bookings (protected route)
router.get('/user', authenticateToken, bookingController.getUserBookings);

// Get booking by ID (protected route)
router.get('/:id', authenticateToken, bookingController.getBookingById);

// Process payment simulation (protected route)
router.post('/:id/payment', authenticateToken, bookingController.processPayment);

// Cancel booking (protected route)
router.patch('/:id/cancel', authenticateToken, bookingController.cancelBooking);

module.exports = router;
