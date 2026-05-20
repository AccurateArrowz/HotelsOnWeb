const express = require('express');
const roomAvailabilityController = require('../controllers/roomAvailabilityController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /hotels/:hotelId/availability?checkInDate=YYYY-MM-DD&checkOutDate=YYYY-MM-DD
router.get(
  '/hotels/:hotelId/availability',
  authenticateToken,
  roomAvailabilityController.getHotelAvailability
);

// GET /hotels/:hotelId/availability/:roomTypeId?checkInDate=YYYY-MM-DD&checkOutDate=YYYY-MM-DD
router.get(
  '/hotels/:hotelId/availability/:roomTypeId',
  authenticateToken,
  roomAvailabilityController.getRoomTypeAvailability
);

module.exports = router;
