import { Request, Response } from 'express';
import { AvailabilityService } from './availability.service';
import { ApiResponseHandler, asyncHandler } from '@/common';
import { HttpError } from '@/common/http-error';
import type { HotelAvailabilityData, SuccessResponse } from '@hotelsonweb/shared';

type AvailabilityParams = { hotelId: string };
type AvailabilityQuery = { checkInDate: string; checkOutDate: string };
type AvailabilityResponse = SuccessResponse<HotelAvailabilityData>;

/**
 * Availability controller for room availability endpoints
 */
export class AvailabilityController {
  private availabilityService: AvailabilityService;

  constructor() {
    this.availabilityService = new AvailabilityService();
  }

  /**
   * GET /hotels/:hotelId/availability?checkInDate=YYYY-MM-DD&checkOutDate=YYYY-MM-DD
   * Get room availability for a hotel across a date range
   */
  getHotelAvailability = asyncHandler(async (
    req: Request<AvailabilityParams, AvailabilityResponse, unknown, AvailabilityQuery>,
    res: Response<AvailabilityResponse>
  ) => {
    const hotelId = parseInt(req.params.hotelId, 10);
    const { checkInDate, checkOutDate } = req.query;

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    if (typeof checkInDate !== 'string' || typeof checkOutDate !== 'string') {
      throw HttpError.badRequest('checkInDate and checkOutDate are required');
    }

    const availability = await this.availabilityService.getHotelAvailability(hotelId, checkInDate, checkOutDate);
    // if(process.env.NODE_ENV === 'development') await setTimeout(1000);

    return ApiResponseHandler.success(res, availability);
  });
}
