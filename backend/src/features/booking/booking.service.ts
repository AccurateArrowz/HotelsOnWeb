import { BookingRepository } from './booking.repository';
import { HttpError } from '@/common/http-error';
import Booking from '@/models/Booking';
import BookingRoom from '@/models/BookingRoom';

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
  async getBookingsByUser(userId: number) {
    const bookings = await this.bookingRepository.findByUserId(userId);

    return bookings;
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: number) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    return booking;
  }

  /**
   * Create new booking
   */
  async createBooking(data: any) {
    const booking = await this.bookingRepository.create({
      ...data,
      status: 'pending',
    });

    return booking;
  }

  /**
   * Update booking
   */
  async updateBooking(bookingId: number, data: any) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    await this.bookingRepository.update(bookingId, data);

    return this.bookingRepository.findById(bookingId);
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: number) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw HttpError.conflict('Booking is already cancelled');
    }

    await this.bookingRepository.update(bookingId, { status: 'cancelled' });

    return this.bookingRepository.findById(bookingId);
  }

  /**
   * Confirm booking
   */
  async confirmBooking(bookingId: number) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw HttpError.notFound('Booking not found');
    }

    if (booking.status !== 'pending') {
      throw HttpError.conflict('Only pending bookings can be confirmed');
    }

    await this.bookingRepository.update(bookingId, { status: 'confirmed' });

    return this.bookingRepository.findById(bookingId);
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
}
