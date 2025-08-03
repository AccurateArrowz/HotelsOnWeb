const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createHotelRequest, getUserHotelRequests, getHotelRequestById } = require('../controllers/HotelRequestController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Create a new hotel listing request with image upload
router.post('/request', upload.array('images', 10), createHotelRequest);

// Get all hotel requests for the authenticated user
router.get('/my-requests', getUserHotelRequests);

// Get a specific hotel request by ID
router.get('/request/:id', getHotelRequestById);

module.exports = router;
