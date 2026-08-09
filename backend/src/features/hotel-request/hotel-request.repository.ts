import { BaseRepository } from '@/common/base.repository';
import HotelRequest from '@/features/hotel-request/models/HotelRequest';
import { Op } from 'sequelize';

/**
 * Hotel request repository for hotel request operations
 */
export class HotelRequestRepository extends BaseRepository<HotelRequest> {
  constructor() {
    super(HotelRequest);
  }

  /**
   * Find requests by user
   */
  async findByUserId(userId: number): Promise<HotelRequest[]> {
    return this.findAll({
      where: { userId },
      include: [
        { association: 'user' },
        { association: 'images' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find requests by status
   */
  async findByStatus(status: string): Promise<HotelRequest[]> {
    return this.findAll({
      where: { status },
      include: [
        { association: 'user' },
        { association: 'images' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find pending requests
   */
  async findPendingRequests(): Promise<HotelRequest[]> {
    return this.findAll({
      where: { status: 'pending' },
      include: [
        { association: 'user' },
        { association: 'images' },
      ],
      order: [['createdAt', 'ASC']],
    });
  }

  /**
   * Find approved requests
   */
  async findApprovedRequests(): Promise<HotelRequest[]> {
    return this.findAll({
      where: { status: 'approved' },
      include: [
        { association: 'user' },
        { association: 'images' },
      ],
    });
  }

  /**
   * Find rejected requests
   */
  async findRejectedRequests(): Promise<HotelRequest[]> {
    return this.findAll({
      where: { status: 'rejected' },
      include: [
        { association: 'user' },
        { association: 'images' },
      ],
    });
  }

  /**
   * Get request statistics
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
   * Search requests
   */
  async search(query: string): Promise<HotelRequest[]> {
    return this.findAll({
      where: {
        [Op.or]: [
          { hotelName: { [Op.iLike]: `%${query}%` } },
          { city: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: [
        { association: 'user' },
        { association: 'images' },
      ],
    });
  }
}
