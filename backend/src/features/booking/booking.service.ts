import { BookingRepository } from './booking.repository';
import { HttpError } from '@/common/http-error';
import Booking from '@/features/booking/models/Booking';
import BookingRoom from '@/features/booking/models/BookingRoom';
import type { Booking as BookingType, BOOKING_STATUS } from '@hotelsonweb/shared';

/**
 * Booking service for booking operations
 */
export class BookingService {
  private bookingRepository: BookingRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  /**
   * Get bookings by user
   */
  async getBookingsByUser(userId: number): Promise<BookingType[]> {
    const bookings = await this.bookingRepository.findByUserId(userId);

    return bookings.map((b) => this.formatBookingResponse(b));
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: number): Promise<BookingType> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    return this.formatBookingResponse(booking);
  }

  /**
   * Create new booking
   */
  async createBooking(data: any): Promise<BookingType> {
    const booking = await this.bookingRepository.create({
      ...data,
      status: 'pending',
    });

    return this.formatBookingResponse(booking);
  }

  /**
   * Update booking
   */
  async updateBooking(bookingId: number, data: any): Promise<BookingType> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    await this.bookingRepository.update(bookingId, data);

    const updated = await this.bookingRepository.findById(bookingId);
    return this.formatBookingResponse(updated!);
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: number): Promise<BookingType> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw HttpError.conflict('Booking is already cancelled');
    }

    await this.bookingRepository.update(bookingId, { status: 'cancelled' });

    const cancelled = await this.bookingRepository.findById(bookingId);
    return this.formatBookingResponse(cancelled!);
  }

  /**
   * Confirm booking
   */
  async confirmBooking(bookingId: number): Promise<BookingType> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    if (booking.status !== 'pending') {
      throw HttpError.conflict('Only pending bookings can be confirmed');
    }

    await this.bookingRepository.update(bookingId, { status: 'confirmed' });

    const confirmed = await this.bookingRepository.findById(bookingId);
    return this.formatBookingResponse(confirmed!);
  }

  /**
   * Complete booking
   */
  async completeBooking(bookingId: number) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    await this.bookingRepository.update(bookingId, { status: 'completed' });

    return this.bookingRepository.findById(bookingId);
  }

  /**
   * Get bookings by hotel
   */
  async getBookingsByHotel(hotelId: number) {
    const bookings = await this.bookingRepository.findByHotelId(hotelId);

    return bookings;
  }

  /**
   * Get bookings by status
   */
  async getBookingsByStatus(status: string) {
    const bookings = await this.bookingRepository.findByStatus(status);

    return bookings;
  }

  /**
   * Get active bookings
   */
  async getActiveBookings() {
    const bookings = await this.bookingRepository.findActiveBookings();

    return bookings;
  }

  /**
   * Get bookings within date range
   */
  async getBookingsByDateRange(startDate: Date, endDate: Date) {
    const bookings = await this.bookingRepository.findByDateRange(startDate, endDate);

    return bookings;
  }

  /**
   * Get booking statistics
   */
  async getStatistics() {
    return this.bookingRepository.getStatistics();
  }

  /**
   * Get revenue statistics
   */
  async getRevenueStatistics(hotelId?: number) {
    return this.bookingRepository.getRevenueStatistics(hotelId);
  }

  /**
   * Add rooms to booking
   */
  async addRoomsToBooking(bookingId: number, roomIds: number[]) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    // Create booking room entries
    const bookingRooms = await Promise.all(
      roomIds.map((roomId) =>
        BookingRoom.create({
          bookingId,
          roomId,
        })
      )
    );

    return bookingRooms;
  }

  /**
   * Remove room from booking
   */
  async removeRoomFromBooking(bookingId: number, roomId: number) {
    const bookingRoom = await BookingRoom.findOne({
      where: { bookingId, roomId },
    });

    if (!bookingRoom) {
      throw HttpError.notFound('Booking room not found');
    }

    await bookingRoom.destroy();
  }

  /**
   * Format booking response - converts ORM instance to shared type
   */
  private formatBookingResponse(booking: Booking): BookingType {
    const bookingJson = booking.toJSON() as any;
    return {
      id: bookingJson.id,
      userId: bookingJson.userId,
      hotelId: bookingJson.hotelId,
      checkInDate: bookingJson.checkInDate,
      checkOutDate: bookingJson.checkOutDate,
      specialRequests: bookingJson.specialRequests,
      status: bookingJson.status,
      totalPrice: bookingJson.totalPrice,
      paymentStatus: bookingJson.paymentStatus,
      cancelledBy: bookingJson.cancelledBy,
      cancellationReason: bookingJson.cancellationReason,
      createdAt: bookingJson.createdAt,
      updatedAt: bookingJson.updatedAt,
      user: bookingJson.user,
      hotel: bookingJson.hotel,
      cancelledByUser: bookingJson.cancelledByUser,
      bookingRooms: bookingJson.bookingRooms,
    };
  }
}
