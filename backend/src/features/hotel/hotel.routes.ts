import { Router } from 'express';
import { HotelController } from './hotel.controller';
import { authenticateToken, requireRole } from '@/middleware/auth.middleware';

const router = Router();
const hotelController = new HotelController();

/**
 * Public routes
 */

/**
 * GET /hotels
 * Get all hotels with search and pagination
 */
router.get('/', hotelController.getHotels);

/**
 * GET /hotels/stats
 * Get hotel statistics
 */
router.get('/stats', hotelController.getStatistics);

/**
 * GET /hotels/search
 * Search hotels
 */
router.get('/search', hotelController.searchHotels);

/**
 * GET /hotels/:id
 * Get hotel by ID
 */
router.get('/:id', hotelController.getHotelById);

/**
 * GET /hotels/owner/:ownerId
 * Get hotels by owner
 */
router.get('/owner/:ownerId', hotelController.getHotelsByOwner);

/**
 * Protected routes
 */

/**
 * POST /hotels
 * Create new hotel (requires authentication)
 */
router.post('/', authenticateToken, hotelController.createHotel);

/**
 * PUT /hotels/:id
 * Update hotel (requires authentication)
 */
router.put('/:id', authenticateToken, hotelController.updateHotel);

/**
 * DELETE /hotels/:id
 * Delete hotel (requires authentication)
 */
router.delete('/:id', authenticateToken, hotelController.deleteHotel);

export default router;
