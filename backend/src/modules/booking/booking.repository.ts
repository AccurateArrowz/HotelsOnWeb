import { BaseRepository } from '@/common/base.repository';
import Booking from '@/models/Booking';
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
   * Find bookings by status
   */
  async findByStatus(status: string): Promise<Booking[]> {
    return this.findAll({
      where: { status },
      include: [
        { association: 'user' },
        { association: 'hotel' },
      ],
    });
  }

  /**
   * Find active bookings (not cancelled or completed)
   */
  async findActiveBookings(): Promise<Booking[]> {
    return this.findAll({
      where: {
        status: {
          [Op.notIn]: ['cancelled', 'completed'],
        },
      },
      include: [
        { association: 'user' },
        { association: 'hotel' },
      ],
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

  /**
   * Get booking statistics
   */
  async getStatistics(): Promise<any> {
    const total = await this.count();
    const byStatus = await this.model.findAll({
      attributes: ['status', [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    return { total, byStatus };
  }

  /**
   * Get revenue statistics
   */
  async getRevenueStatistics(hotelId?: number): Promise<any> {
    const where = hotelId ? { hotelId } : {};

    const revenue = await this.model.findAll({
      attributes: [
        [this.model.sequelize!.fn('SUM', this.model.sequelize!.col('totalPrice')), 'total'],
        [this.model.sequelize!.fn('AVG', this.model.sequelize!.col('totalPrice')), 'average'],
      ],
      where,
      raw: true,
    });

    return revenue[0];
  }
}
