const express = require('express');
const availabilityController = require('../controllers/availabilityController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /hotels/:hotelId/availability?checkInDate=YYYY-MM-DD&checkOutDate=YYYY-MM-DD
router.get(
  '/hotels/:hotelId/availability',
  authenticateToken,
  availabilityController.getHotelAvailability
);

// GET /hotels/:hotelId/availability/:roomTypeId?checkInDate=YYYY-MM-DD&checkOutDate=YYYY-MM-DD
router.get(
  '/hotels/:hotelId/availability/:roomTypeId',
  authenticateToken,
  availabilityController.getRoomTypeAvailability
);

module.exports = router;
