import { Router } from 'express';
import { MediaController } from './media.controller';
import { authenticateToken } from '@/middleware/auth.middleware';

const router = Router();
const mediaController = new MediaController();

/**
 * Public routes
 */

/**
 * GET /media/hotels/:hotelId/images
 * Get hotel images
 */
router.get('/hotels/:hotelId/images', mediaController.getHotelImages);

/**
 * GET /media/hotels/images/:imageId
 * Get hotel image by ID
 */
router.get('/hotels/images/:imageId', mediaController.getHotelImageById);

/**
 * GET /media/hotel-requests/:requestId/images
 * Get hotel request images
 */
router.get('/hotel-requests/:requestId/images', mediaController.getHotelRequestImages);

/**
 * GET /media/hotel-requests/images/:imageId
 * Get hotel request image by ID
 */
router.get('/hotel-requests/images/:imageId', mediaController.getHotelRequestImageById);

/**
 * Protected routes
 */

/**
 * POST /media/hotels/:hotelId/images
 * Upload hotel image
 */
router.post('/hotels/:hotelId/images', authenticateToken, mediaController.uploadHotelImage);

/**
 * PUT /media/hotels/images/:imageId
 * Update hotel image
 */
router.put('/hotels/images/:imageId', authenticateToken, mediaController.updateHotelImage);

/**
 * DELETE /media/hotels/images/:imageId
 * Delete hotel image
 */
router.delete('/hotels/images/:imageId', authenticateToken, mediaController.deleteHotelImage);

/**
 * POST /media/hotels/:hotelId/images/:imageId/primary
 * Set primary image
 */
router.post('/hotels/:hotelId/images/:imageId/primary', authenticateToken, mediaController.setPrimaryImage);

/**
 * POST /media/hotels/images/bulk-delete
 * Bulk delete hotel images
 */
router.post('/hotels/images/bulk-delete', authenticateToken, mediaController.bulkDeleteHotelImages);

/**
 * POST /media/hotel-requests/:requestId/images
 * Upload hotel request image
 */
router.post('/hotel-requests/:requestId/images', authenticateToken, mediaController.uploadHotelRequestImage);

/**
 * PUT /media/hotel-requests/images/:imageId
 * Update hotel request image
 */
router.put('/hotel-requests/images/:imageId', authenticateToken, mediaController.updateHotelRequestImage);

/**
 * DELETE /media/hotel-requests/images/:imageId
 * Delete hotel request image
 */
router.delete('/hotel-requests/images/:imageId', authenticateToken, mediaController.deleteHotelRequestImage);

/**
 * POST /media/hotel-requests/images/bulk-delete
 * Bulk delete hotel request images
 */
router.post('/hotel-requests/images/bulk-delete', authenticateToken, mediaController.bulkDeleteHotelRequestImages);

export default router;
