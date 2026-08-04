import { Request, Response } from 'express';
import { RoomService } from './room.service';
import { ApiResponseHandler, asyncHandler, AuthenticatedRequest } from '@/common';
import { HttpError } from '@/common/http-error';

/**
 * Room controller for room endpoints
 */
export class RoomController {
  private roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  /**
   * GET /hotels/:hotelId/rooms
   * Get rooms by hotel
   */
  getRoomsByHotel = asyncHandler(async (req: Request, res: Response) => {
    const hotelId = parseInt(req.params.hotelId);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const rooms = await this.roomService.getRoomsByHotel(hotelId);

    return ApiResponseHandler.success(res, rooms);
  });

  /**
   * GET /hotels/:hotelId/rooms/:id
   * Get room by ID
   */
  getRoomById = asyncHandler(async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.id);

    if (!Number.isInteger(roomId)) {
      throw HttpError.badRequest('Room ID must be a numeric value');
    }

    const room = await this.roomService.getRoomById(roomId);

    return ApiResponseHandler.success(res, room);
  });

  /**
   * POST /hotels/:hotelId/rooms
   * Create new room
   */
  createRoom = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const hotelId = parseInt(req.params.hotelId);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const { roomNumber, roomTypeId, status = 'available' } = req.body;

    if (!roomNumber || !roomTypeId) {
      throw HttpError.badRequest('Room number and room type ID are required');
    }

    const room = await this.roomService.createRoom({
      hotelId,
      roomNumber,
      roomTypeId,
      status,
    });

    return ApiResponseHandler.created(res, room);
  });

  /**
   * PUT /hotels/:hotelId/rooms/:id
   * Update room
   */
  updateRoom = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const roomId = parseInt(req.params.id);

    if (!Number.isInteger(roomId)) {
      throw HttpError.badRequest('Room ID must be a numeric value');
    }

    const room = await this.roomService.updateRoom(roomId, req.body);

    return ApiResponseHandler.success(res, room);
  });

  /**
   * DELETE /hotels/:hotelId/rooms/:id
   * Delete room
   */
  deleteRoom = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const roomId = parseInt(req.params.id);

    if (!Number.isInteger(roomId)) {
      throw HttpError.badRequest('Room ID must be a numeric value');
    }

    await this.roomService.deleteRoom(roomId);

    return ApiResponseHandler.success(res, null, 'Room deleted successfully');
  });

  /**
   * GET /hotels/:hotelId/rooms/available
   * Get available rooms
   */
  getAvailableRooms = asyncHandler(async (req: Request, res: Response) => {
    const hotelId = parseInt(req.params.hotelId);
    const { roomTypeId } = req.query;

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const rooms = await this.roomService.getAvailableRooms(hotelId, roomTypeId ? parseInt(roomTypeId as string) : undefined);

    return ApiResponseHandler.success(res, rooms);
  });

  /**
   * GET /hotels/:hotelId/rooms/occupied
   * Get occupied rooms
   */
  getOccupiedRooms = asyncHandler(async (req: Request, res: Response) => {
    const hotelId = parseInt(req.params.hotelId);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const rooms = await this.roomService.getOccupiedRooms(hotelId);

    return ApiResponseHandler.success(res, rooms);
  });

  /**
   * GET /hotels/:hotelId/rooms/stats
   * Get room statistics
   */
  getRoomStatistics = asyncHandler(async (req: Request, res: Response) => {
    const hotelId = parseInt(req.params.hotelId);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const stats = await this.roomService.getRoomStatistics(hotelId);

    return ApiResponseHandler.success(res, stats);
  });

  /**
   * PATCH /hotels/:hotelId/rooms/:id/status
   * Update room status
   */
  updateRoomStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const roomId = parseInt(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(roomId)) {
      throw HttpError.badRequest('Room ID must be a numeric value');
    }

    if (!status) {
      throw HttpError.badRequest('Status is required');
    }

    const room = await this.roomService.updateRoomStatus(roomId, status);

    return ApiResponseHandler.success(res, room);
  });

  /**
   * PATCH /hotels/:hotelId/rooms/bulk-status
   * Bulk update room status
   */
  bulkUpdateRoomStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const { roomIds, status } = req.body;

    if (!Array.isArray(roomIds) || !status) {
      throw HttpError.badRequest('Room IDs array and status are required');
    }

    const result = await this.roomService.bulkUpdateRoomStatus(roomIds, status);

    return ApiResponseHandler.success(res, result);
  });
}
