const express = require('express');
const roomAvailabilityController = require('../controllers/roomAvailabilityController');

const router = express.Router();

// GET /hotels/:hotelId/availability?checkInDate=YYYY-MM-DD&checkOutDate=YYYY-MM-DD
router.get(
  '/hotels/:hotelId/availability',
  roomAvailabilityController.getHotelAvailability
);

module.exports = router;
