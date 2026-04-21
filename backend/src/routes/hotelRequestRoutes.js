const express = require('express');
const router = express.Router();
const { createHotelRequest, getUserHotelRequests, getHotelRequestById, getPendingHotelRequests, getAllHotelRequests, updateHotelRequestStatus } = require('../controllers/HotelRequestController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Create a new hotel listing request (expects image URLs, not multipart files)
router.post('/request', createHotelRequest);

// Get all hotel requests for the authenticated user
router.get('/my-requests', getUserHotelRequests);

// Get a specific hotel request by ID
router.get('/request/:id', getHotelRequestById);

// Get all pending hotel requests (admin only)
router.get('/pending', requireAdmin, getPendingHotelRequests);

// Get all hotel requests with optional status filter (admin only)
router.get('/all', requireAdmin, getAllHotelRequests);

// Update hotel request status - approve/reject (admin only)
router.patch('/request/:id/status', requireAdmin, updateHotelRequestStatus);

module.exports = router;
