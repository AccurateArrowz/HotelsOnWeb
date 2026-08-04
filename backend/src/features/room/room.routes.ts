import { Router } from 'express';
import { RoomController } from './room.controller';
import { authenticateToken } from '@/middleware/auth.middleware';

const router = Router({ mergeParams: true });
const roomController = new RoomController();

/**
 * Public routes
 */

/**
 * GET /hotels/:hotelId/rooms
 * Get rooms by hotel
 */
router.get('/', roomController.getRoomsByHotel);

/**
 * GET /hotels/:hotelId/rooms/stats
 * Get room statistics
 */
router.get('/stats', roomController.getRoomStatistics);

/**
 * GET /hotels/:hotelId/rooms/available
 * Get available rooms
 */
router.get('/available', roomController.getAvailableRooms);

/**
 * GET /hotels/:hotelId/rooms/occupied
 * Get occupied rooms
 */
router.get('/occupied', roomController.getOccupiedRooms);

/**
 * GET /hotels/:hotelId/rooms/:id
 * Get room by ID
 */
router.get('/:id', roomController.getRoomById);

/**
 * Protected routes
 */

/**
 * POST /hotels/:hotelId/rooms
 * Create new room
 */
router.post('/', authenticateToken, roomController.createRoom);

/**
 * PUT /hotels/:hotelId/rooms/:id
 * Update room
 */
router.put('/:id', authenticateToken, roomController.updateRoom);

/**
 * DELETE /hotels/:hotelId/rooms/:id
 * Delete room
 */
router.delete('/:id', authenticateToken, roomController.deleteRoom);

/**
 * PATCH /hotels/:hotelId/rooms/:id/status
 * Update room status
 */
router.patch('/:id/status', authenticateToken, roomController.updateRoomStatus);

/**
 * PATCH /hotels/:hotelId/rooms/bulk-status
 * Bulk update room status
 */
router.patch('/bulk-status', authenticateToken, roomController.bulkUpdateRoomStatus);

export default router;
