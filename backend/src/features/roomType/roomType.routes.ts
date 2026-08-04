import { Router } from 'express';
import { RoomTypeController } from './roomType.controller';
import { authenticateToken } from '@/middleware/auth.middleware';

const router = Router({ mergeParams: true });
const roomTypeController = new RoomTypeController();

/**
 * Public routes
 */

/**
 * GET /hotels/:hotelId/room-types
 * Get room types by hotel
 */
router.get('/', roomTypeController.getRoomTypesByHotel);

/**
 * GET /hotels/:hotelId/room-types/:id
 * Get room type by ID
 */
router.get('/:id', roomTypeController.getRoomTypeById);

/**
 * Protected routes
 */

/**
 * POST /hotels/:hotelId/room-types
 * Create new room type
 */
router.post('/', authenticateToken, roomTypeController.createRoomType);

/**
 * PUT /hotels/:hotelId/room-types/:id
 * Update room type
 */
router.put('/:id', authenticateToken, roomTypeController.updateRoomType);

/**
 * DELETE /hotels/:hotelId/room-types/:id
 * Delete room type
 */
router.delete('/:id', authenticateToken, roomTypeController.deleteRoomType);

export default router;
