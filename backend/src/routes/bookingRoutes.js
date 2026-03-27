const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');

//authenticate the user for all routes
router.use(authenticateToken);

// Create a new booking (protected route)
router.post('/', bookingController.createBooking);

// Get user's bookings (protected route)
router.get('/user', bookingController.getUserBookings);

// Get booking by ID (protected route)
router.get('/:id', bookingController.getBookingById);

// Process payment simulation (protected route)
router.post('/:id/payment', bookingController.processPayment);

// Cancel booking (protected route)
router.patch('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
