import { Router } from 'express';
import { AvailabilityController } from './availability.controller';

const router = Router({ mergeParams: true });
const availabilityController = new AvailabilityController();

/**
 * GET /hotels/:hotelId/availability
 * Get room availability for a hotel across a date range
 */
router.get('/', availabilityController.getHotelAvailability);

export default router;
