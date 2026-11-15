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
    const bookingId = parseInt(req.params.id as string);

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

    const { hotelId, checkInDate, checkOutDate, specialRequests, roomSelections } = req.body;

    if (!Number.isInteger(hotelId) || !checkInDate || !checkOutDate || !Array.isArray(roomSelections) || roomSelections.length === 0) {
      throw HttpError.badRequest('Hotel ID, valid dates, and at least one room selection are required');
    }

    const selectionsValid = roomSelections.every((selection: any) =>
      Number.isInteger(selection.roomTypeId) && selection.roomTypeId > 0
      && Number.isInteger(selection.quantity) && selection.quantity > 0
    );
    if (!selectionsValid) throw HttpError.badRequest('Room selections must include a room type ID and positive quantity');

    const booking = await this.bookingService.createBooking({
      userId: req.userId,
      hotelId,
      checkInDate,
      checkOutDate,
      specialRequests,
      roomSelections,
    });

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

    const bookingId = parseInt(req.params.id as string);

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

    const bookingId = parseInt(req.params.id as string);

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

    const bookingId = parseInt(req.params.id as string);

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

    const bookingId = parseInt(req.params.id as string);

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
    const hotelId = parseInt(req.params.hotelId as string);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const bookings = await this.bookingService.getBookingsByHotel(hotelId);

    return ApiResponseHandler.success(res, bookings);
  });

}
