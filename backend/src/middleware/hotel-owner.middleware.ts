import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/common/types';
import { ApiResponseHandler } from '@/common/api-response';
import HotelOwner from '@/features/hotel/models/HotelOwner';

/**
 * Middleware to verify that the authenticated user is an owner of the specified hotel
 * Expects hotelId to be in req.params
 */
export const requireHotelOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return ApiResponseHandler.unauthorized(res, 'User not authenticated');
    }

    const hotelId = parseInt(req.params.hotelId as string);
    if (!Number.isInteger(hotelId)) {
      return ApiResponseHandler.badRequest(res, 'Hotel ID must be a numeric value');
    }

    // Check if user is an owner of this hotel
    const hotelOwner = await HotelOwner.findOne({
      where: {
        userId: req.userId,
        hotelId,
      },
    });

    if (!hotelOwner) {
      return ApiResponseHandler.forbidden(res, 'You are not an owner of this hotel');
    }

    // Attach hotelId to request for use in controllers
    (req as any).hotelId = hotelId;
    next();
  } catch (error) {
    console.error('[requireHotelOwner] Error:', error);
    return ApiResponseHandler.internalError(res, 'Failed to verify hotel ownership');
  }
};
