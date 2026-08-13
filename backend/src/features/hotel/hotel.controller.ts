import { Request, Response } from 'express';
import { HotelService } from './hotel.service';
import { ApiResponseHandler, asyncHandler, AuthenticatedRequest } from '@/common';
import { HttpError } from '@/common/http-error';

/**
 * Hotel controller for hotel endpoints
 */
export class HotelController {
  private hotelService: HotelService;

  constructor() {
    this.hotelService = new HotelService();
  }

  /**
   * GET /hotels
   * Get all hotels with search and pagination
   */
  getHotels = asyncHandler(async (req: Request, res: Response) => {
    const { search, limit = '20', offset = '0' } = req.query;

    const limitNum = Math.min(parseInt(limit as string) || 20, 100);
    const offsetNum = parseInt(offset as string) || 0;

    const result = await this.hotelService.getHotels(search as string, limitNum, offsetNum);

    return ApiResponseHandler.successWithPagination(res, result.data, 'Hotels retrieved successfully', result.pagination);
  });

  /**
   * GET /hotels/:id
   * Get hotel by ID
   */
  getHotelById = asyncHandler(async (req: Request, res: Response) => {
    const hotelId = parseInt(req.params.id as string);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const hotel = await this.hotelService.getHotelById(hotelId);

    return ApiResponseHandler.success(res, hotel);
  });

  /**
   * POST /hotels
   * Create new hotel
   */
  createHotel = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const { name, description, city, street, country, amenities } = req.body;

    // Validate required fields
    if (!name || !city || !street || !country) {
      throw HttpError.badRequest('Name, city, street, and country are required');
    }

    const hotel = await this.hotelService.createHotel(
      {
        name,
        description,
        city,
        street,
        country,
        amenities,
      },
      req.userId
    );

    return ApiResponseHandler.created(res, hotel);
  });

  /**
   * PUT /hotels/:id
   * Update hotel
   */
  updateHotel = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const hotelId = parseInt(req.params.id as string);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const hotel = await this.hotelService.updateHotel(hotelId, req.body);

    return ApiResponseHandler.success(res, hotel);
  });

  /**
   * DELETE /hotels/:id
   * Delete hotel
   */
  deleteHotel = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const hotelId = parseInt(req.params.id as string);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    await this.hotelService.deleteHotel(hotelId);

    return ApiResponseHandler.success(res, null, 'Hotel deleted successfully');
  });

  /**
   * GET /hotels/owner/:ownerId
   * Get hotels by owner
   */
  getHotelsByOwner = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = parseInt(req.params.ownerId as string);

    if (!Number.isInteger(ownerId)) {
      throw HttpError.badRequest('Owner ID must be a numeric value');
    }

    const hotels = await this.hotelService.getHotelsByOwner(ownerId);

    return ApiResponseHandler.success(res, hotels);
  });

  /**
   * GET /hotels/search
   * Search hotels
   */
  searchHotels = asyncHandler(async (req: Request, res: Response) => {
    const { q, limit = '20', offset = '0' } = req.query;

    if (!q) {
      throw HttpError.badRequest('Search query is required');
    }

    const limitNum = Math.min(parseInt(limit as string) || 20, 100);
    const offsetNum = parseInt(offset as string) || 0;

    const hotels = await this.hotelService.searchHotels(q as string, limitNum, offsetNum);

    return ApiResponseHandler.success(res, hotels);
  });

  /**
   * GET /hotels/stats
   * Get hotel statistics
   */
  getStatistics = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.hotelService.getStatistics();

    return ApiResponseHandler.success(res, stats);
  });

  /**
   * GET /hotels/owner/my-hotels
   * Get current user's owned hotels (authenticated owner only)
   */
  getMyHotels = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const hotels = await this.hotelService.getHotelsByOwner(req.userId);

    return ApiResponseHandler.success(res, hotels);
  });
}
