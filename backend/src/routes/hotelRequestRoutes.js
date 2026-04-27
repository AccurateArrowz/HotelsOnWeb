const express = require('express');
const router = express.Router();
const { createHotelRequest, getUserHotelRequests, getHotelRequestById, getHotelRequests, updateHotelRequestStatus } = require('../controllers/HotelRequestController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Create a new hotel listing request (expects image URLs, not multipart files)
router.post('/request', createHotelRequest);

// Get all hotel requests for the authenticated user
router.get('/my-requests', getUserHotelRequests);

// Get a specific hotel request by ID
router.get('/request/:id', getHotelRequestById);

// Get hotel requests with optional status filter (admin only)
// Query params: ?status=pending|approved|rejected
router.get('/all', requireAdmin, getHotelRequests);

// Update hotel request status - approve/reject (admin only)
router.patch('/request/:id/status', requireAdmin, updateHotelRequestStatus);

module.exports = router;
