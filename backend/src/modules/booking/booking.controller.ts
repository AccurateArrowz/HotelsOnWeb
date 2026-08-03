import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import { ApiResponseHandler, asyncHandler, AuthenticatedRequest } from '@/common';
import { HttpError } from '@/common/http-error';

/**
 * Booking controller for booking endpoints
 */
export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  /**
   * GET /bookings
   * Get bookings by user
   */
  getBookingsByUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const bookings = await this.bookingService.getBookingsByUser(req.userId);

    return ApiResponseHandler.success(res, bookings);
  });

  /**
   * GET /bookings/:id
   * Get booking by ID
   */
  getBookingById = asyncHandler(async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.id);

    if (!Number.isInteger(bookingId)) {
      throw HttpError.badRequest('Booking ID must be a numeric value');
    }

    const booking = await this.bookingService.getBookingById(bookingId);

    return ApiResponseHandler.success(res, booking);
  });

  /**
   * POST /bookings
   * Create new booking
   */
  createBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const { hotelId, checkInDate, checkOutDate, totalPrice, roomIds } = req.body;

    if (!hotelId || !checkInDate || !checkOutDate || !totalPrice) {
      throw HttpError.badRequest('Hotel ID, check-in date, check-out date, and total price are required');
    }

    const booking = await this.bookingService.createBooking({
      userId: req.userId,
      hotelId,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // Add rooms to booking if provided
    if (Array.isArray(roomIds) && roomIds.length > 0) {
      await this.bookingService.addRoomsToBooking(booking.id, roomIds);
    }

    return ApiResponseHandler.created(res, booking);
  });

  /**
   * PUT /bookings/:id
   * Update booking
   */
  updateBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const bookingId = parseInt(req.params.id);

    if (!Number.isInteger(bookingId)) {
      throw HttpError.badRequest('Booking ID must be a numeric value');
    }

    const booking = await this.bookingService.updateBooking(bookingId, req.body);

    return ApiResponseHandler.success(res, booking);
  });

  /**
   * POST /bookings/:id/cancel
   * Cancel booking
   */
  cancelBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const bookingId = parseInt(req.params.id);

    if (!Number.isInteger(bookingId)) {
      throw HttpError.badRequest('Booking ID must be a numeric value');
    }

    const booking = await this.bookingService.cancelBooking(bookingId);

    return ApiResponseHandler.success(res, booking, 'Booking cancelled successfully');
  });

  /**
   * POST /bookings/:id/confirm
   * Confirm booking
   */
  confirmBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const bookingId = parseInt(req.params.id);

    if (!Number.isInteger(bookingId)) {
      throw HttpError.badRequest('Booking ID must be a numeric value');
    }

    const booking = await this.bookingService.confirmBooking(bookingId);

    return ApiResponseHandler.success(res, booking, 'Booking confirmed successfully');
  });

  /**
   * POST /bookings/:id/complete
   * Complete booking
   */
  completeBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const bookingId = parseInt(req.params.id);

    if (!Number.isInteger(bookingId)) {
      throw HttpError.badRequest('Booking ID must be a numeric value');
    }

    const booking = await this.bookingService.completeBooking(bookingId);

    return ApiResponseHandler.success(res, booking, 'Booking completed successfully');
  });

  /**
   * GET /bookings/hotel/:hotelId
   * Get bookings by hotel
   */
  getBookingsByHotel = asyncHandler(async (req: Request, res: Response) => {
    const hotelId = parseInt(req.params.hotelId);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const bookings = await this.bookingService.getBookingsByHotel(hotelId);

    return ApiResponseHandler.success(res, bookings);
  });

  /**
   * GET /bookings/status/:status
   * Get bookings by status
   */
  getBookingsByStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.params;

    const bookings = await this.bookingService.getBookingsByStatus(status);

    return ApiResponseHandler.success(res, bookings);
  });

  /**
   * GET /bookings/active
   * Get active bookings
   */
  getActiveBookings = asyncHandler(async (req: Request, res: Response) => {
    const bookings = await this.bookingService.getActiveBookings();

    return ApiResponseHandler.success(res, bookings);
  });

  /**
   * GET /bookings/stats
   * Get booking statistics
   */
  getStatistics = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.bookingService.getStatistics();

    return ApiResponseHandler.success(res, stats);
  });

  /**
   * GET /bookings/revenue
   * Get revenue statistics
   */
  getRevenueStatistics = asyncHandler(async (req: Request, res: Response) => {
    const { hotelId } = req.query;

    const revenue = await this.bookingService.getRevenueStatistics(hotelId ? parseInt(hotelId as string) : undefined);

    return ApiResponseHandler.success(res, revenue);
  });

  /**
   * POST /bookings/:id/rooms
   * Add rooms to booking
   */
  addRoomsToBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const bookingId = parseInt(req.params.id);
    const { roomIds } = req.body;

    if (!Number.isInteger(bookingId)) {
      throw HttpError.badRequest('Booking ID must be a numeric value');
    }

    if (!Array.isArray(roomIds) || roomIds.length === 0) {
      throw HttpError.badRequest('Room IDs array is required');
    }

    const bookingRooms = await this.bookingService.addRoomsToBooking(bookingId, roomIds);

    return ApiResponseHandler.created(res, bookingRooms);
  });

  /**
   * DELETE /bookings/:id/rooms/:roomId
   * Remove room from booking
   */
  removeRoomFromBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const bookingId = parseInt(req.params.id);
    const roomId = parseInt(req.params.roomId);

    if (!Number.isInteger(bookingId) || !Number.isInteger(roomId)) {
      throw HttpError.badRequest('Booking ID and Room ID must be numeric values');
    }

    await this.bookingService.removeRoomFromBooking(bookingId, roomId);

    return ApiResponseHandler.success(res, null, 'Room removed from booking');
  });
}
