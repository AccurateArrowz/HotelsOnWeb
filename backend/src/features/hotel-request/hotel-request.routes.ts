import { Router } from 'express';
import { HotelRequestController } from './hotel-request.controller';
import { authenticateToken } from '@/middleware/auth.middleware';

const router = Router();
const hotelRequestController = new HotelRequestController();

/**
 * Public routes
 */

/**
 * GET /hotel-requests/stats
 * Get request statistics
 */
router.get('/stats', hotelRequestController.getStatistics);

/**
 * GET /hotel-requests/search
 * Search requests
 */
router.get('/search', hotelRequestController.searchRequests);

/**
 * GET /hotel-requests/pending
 * Get pending requests
 */
router.get('/pending', hotelRequestController.getPendingRequests);

/**
 * GET /hotel-requests/approved
 * Get approved requests
 */
router.get('/approved', hotelRequestController.getApprovedRequests);

/**
 * GET /hotel-requests/rejected
 * Get rejected requests
 */
router.get('/rejected', hotelRequestController.getRejectedRequests);

/**
 * GET /hotel-requests/status/:status
 * Get requests by status
 */
router.get('/status/:status', hotelRequestController.getRequestsByStatus);

/**
 * GET /hotel-requests/:id
 * Get request by ID
 */
router.get('/:id', hotelRequestController.getRequestById);

/**
 * Protected routes
 */

/**
 * GET /hotel-requests
 * Get requests by user
 */
router.get('/', authenticateToken, hotelRequestController.getRequestsByUser);

/**
 * POST /hotel-requests
 * Create new hotel request
 */
router.post('/', authenticateToken, hotelRequestController.createRequest);

/**
 * PUT /hotel-requests/:id
 * Update request
 */
router.put('/:id', authenticateToken, hotelRequestController.updateRequest);

/**
 * DELETE /hotel-requests/:id
 * Delete request
 */
router.delete('/:id', authenticateToken, hotelRequestController.deleteRequest);

/**
 * Admin routes
 */

/**
 * POST /hotel-requests/:id/approve
 * Approve request
 */
router.post('/:id/approve', hotelRequestController.approveRequest);

/**
 * POST /hotel-requests/:id/reject
 * Reject request
 */
router.post('/:id/reject', hotelRequestController.rejectRequest);

export default router;
