import { Request, Response } from 'express';
import { RoomTypeService } from './roomType.service';
import { ApiResponseHandler, asyncHandler, AuthenticatedRequest } from '@/common';
import { HttpError } from '@/common/http-error';

/**
 * RoomType controller for room type endpoints
 */
export class RoomTypeController {
  private roomTypeService: RoomTypeService;

  constructor() {
    this.roomTypeService = new RoomTypeService();
  }

  /**
   * GET /hotels/:hotelId/room-types
   * Get room types by hotel
   */
  getRoomTypesByHotel = asyncHandler(async (req: Request, res: Response) => {
    const hotelId = parseInt(req.params.hotelId as string);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const roomTypes = await this.roomTypeService.getRoomTypesByHotel(hotelId);

    return ApiResponseHandler.success(res, roomTypes);
  });

  /**
   * GET /hotels/:hotelId/room-types/:id
   * Get room type by ID
   */
  getRoomTypeById = asyncHandler(async (req: Request, res: Response) => {
    const roomTypeId = parseInt(req.params.id as string);

    if (!Number.isInteger(roomTypeId)) {
      throw HttpError.badRequest('Room type ID must be a numeric value');
    }

    const roomType = await this.roomTypeService.getRoomTypeById(roomTypeId);

    return ApiResponseHandler.success(res, roomType);
  });

  /**
   * POST /hotels/:hotelId/room-types
   * Create new room type
   */
  createRoomType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const hotelId = parseInt(req.params.hotelId as string);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const roomType = await this.roomTypeService.createRoomType({
      hotelId,
      ...req.body,
    });

    return ApiResponseHandler.created(res, roomType);
  });

  /**
   * PUT /hotels/:hotelId/room-types/:id
   * Update room type
   */
  updateRoomType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const roomTypeId = parseInt(req.params.id as string);

    if (!Number.isInteger(roomTypeId)) {
      throw HttpError.badRequest('Room type ID must be a numeric value');
    }

    const roomType = await this.roomTypeService.updateRoomType(roomTypeId, req.body);

    return ApiResponseHandler.success(res, roomType);
  });

  /**
   * DELETE /hotels/:hotelId/room-types/:id
   * Delete room type
   */
  deleteRoomType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const roomTypeId = parseInt(req.params.id as string);

    if (!Number.isInteger(roomTypeId)) {
      throw HttpError.badRequest('Room type ID must be a numeric value');
    }

    await this.roomTypeService.deleteRoomType(roomTypeId);

    return ApiResponseHandler.success(res, null, 'Room type deleted successfully');
  });
}
