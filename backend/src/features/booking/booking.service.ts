import { BookingRepository } from './booking.repository';
import { HttpError } from '@/common/http-error';
import Booking from '@/features/booking/models/Booking';
import BookingRoom from '@/features/booking/models/BookingRoom';
import RoomType from '@/features/roomType/models/RoomType';
import { getSequelize } from '@/config/database';
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
  async createBooking(data: {
    userId: number;
    hotelId: number;
    checkInDate: string;
    checkOutDate: string;
    specialRequests?: string;
    roomSelections: Array<{ roomTypeId: number; quantity: number }>;
  }): Promise<BookingType> {
    return getSequelize().transaction(async (transaction) => {
      const nights = this.getNights(data.checkInDate, data.checkOutDate);
      const roomTypeIds = data.roomSelections.map(({ roomTypeId }) => roomTypeId);
      const roomTypes = await RoomType.findAll({
        where: { id: [...new Set(roomTypeIds)], hotelId: data.hotelId },
        transaction,
      });
      const roomTypeById = new Map(roomTypes.map((roomType) => [roomType.id, roomType]));

      if (roomTypeById.size !== new Set(roomTypeIds).size) {
        throw HttpError.badRequest('One or more selected room types do not belong to this hotel');
      }

      const totalPrice = data.roomSelections.reduce((sum, selection) => {
        return sum + Number(roomTypeById.get(selection.roomTypeId)!.basePrice) * selection.quantity * nights;
      }, 0);

      const booking = await Booking.create({
        userId: data.userId,
        hotelId: data.hotelId,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        specialRequests: data.specialRequests ?? null,
        totalPrice: Number(totalPrice.toFixed(2)),
        status: 'pending',
      }, { transaction });

      await BookingRoom.bulkCreate(data.roomSelections.map((selection) => ({
        bookingId: booking.id,
        roomTypeId: selection.roomTypeId,
        quantity: selection.quantity,
        pricePerNight: String(roomTypeById.get(selection.roomTypeId)!.basePrice),
      })), { transaction });

      const created = await Booking.findByPk(booking.id, {
        include: [{ association: 'bookingRooms', include: [{ association: 'assignments' }] }],
        transaction,
      });
      return this.formatBookingResponse(created!);
    });
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
   * Get bookings within date range
   */
  async getBookingsByDateRange(startDate: Date, endDate: Date) {
    const bookings = await this.bookingRepository.findByDateRange(startDate, endDate);

    return bookings;
  }

  /**
   * Add rooms to booking
   */
  private getNights(checkInDate: string, checkOutDate: string): number {
    const toDay = (value: string): number | null => {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
      if (!match) return null;
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year < 1 || day < 1 || day > (monthDays[month - 1] ?? 0)) return null;
      const priorYear = year - 1;
      return priorYear * 365 + Math.floor(priorYear / 4) - Math.floor(priorYear / 100) + Math.floor(priorYear / 400)
        + monthDays.slice(0, month - 1).reduce((sum, value) => sum + value, 0) + day;
    };
    const checkIn = toDay(checkInDate);
    const checkOut = toDay(checkOutDate);
    const nights = checkIn === null || checkOut === null ? 0 : checkOut - checkIn;
    if (nights <= 0) {
      throw HttpError.badRequest('Check-out date must be after check-in date');
    }
    return nights;
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
