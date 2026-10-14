import { BaseRepository } from '@/common/base.repository';
import Booking from '@/features/booking/models/Booking';
import { Op } from 'sequelize';

/**
 * Booking repository for booking operations
 */
export class BookingRepository extends BaseRepository<Booking> {
  constructor() {
    super(Booking);
  }

  /**
   * Find bookings by user
   */
  async findByUserId(userId: number): Promise<Booking[]> {
    return this.findAll({
      where: { userId },
      include: [
        { association: 'user' },
        { association: 'hotel' },
        { association: 'rooms' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find bookings by hotel
   */
  async findByHotelId(hotelId: number): Promise<Booking[]> {
    return this.findAll({
      where: { hotelId },
      include: [
        { association: 'user' },
        { association: 'rooms' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find bookings for a hotel that overlap a given date range (excluding cancelled)
   * overlap = NOT (existing checkout <= requested checkin OR existing checkin >= requested checkout)
   */
  async findOverlappingBookings(hotelId: number, checkInDate: string | Date, checkOutDate: string | Date): Promise<Booking[]> {
    return this.findAll({
      where: {
        hotelId,
        status: { [Op.notIn]: ['cancelled'] },
        [Op.not]: {
          [Op.or]: [
            { checkOutDate: { [Op.lte]: checkInDate } },
            { checkInDate: { [Op.gte]: checkOutDate } },
          ],
        },
      },
      include: [{ association: 'bookingRooms' }],
    });
  }

  /**
   * Find bookings within date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return this.findAll({
      where: {
        checkInDate: { [Op.gte]: startDate },
        checkOutDate: { [Op.lte]: endDate },
      },
      include: [
        { association: 'user' },
        { association: 'hotel' },
      ],
    });
  }

}
