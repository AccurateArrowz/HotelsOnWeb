import { BaseRepository } from '@/common/base.repository';
import Hotel from '@/models/Hotel';
import { Op } from 'sequelize';

/**
 * Hotel repository for hotel operations
 */
export class HotelRepository extends BaseRepository<Hotel> {
  constructor() {
    super(Hotel);
  }

  /**
   * Find active hotels with pagination and search
   */
  async findActiveHotels(
    search?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ hotels: Hotel[]; total: number }> {
    const where: any = { isActive: true };

    if (search && search.trim()) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.model.findAndCountAll({
      where,
      include: [
        { association: 'images', attributes: ['id', 'imageUrl', 'isPrimary', 'orderIndex'] },
        { association: 'roomTypes', where: { isActive: true }, required: false },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return { hotels: rows, total: count };
  }

  /**
   * Find hotel by ID with all associations
   */
  async findByIdWithAssociations(hotelId: number): Promise<Hotel | null> {
    return this.findOne({
      where: { id: hotelId, isActive: true },
      include: [
        { association: 'images' },
        { association: 'roomTypes', where: { isActive: true }, required: false },
        { association: 'owner' },
        { association: 'staff' },
      ],
    });
  }

  /**
   * Find hotels by owner
   */
  async findByOwnerId(ownerId: number): Promise<Hotel[]> {
    return this.findAll({
      where: { ownerId },
      include: [
        { association: 'images' },
        { association: 'roomTypes' },
      ],
    });
  }

  /**
   * Find hotels by city
   */
  async findByCity(city: string, limit: number = 20, offset: number = 0): Promise<Hotel[]> {
    return this.findAll({
      where: { city: { [Op.iLike]: `%${city}%` }, isActive: true },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Search hotels by name or city
   */
  async search(query: string, limit: number = 20, offset: number = 0): Promise<Hotel[]> {
    return this.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { city: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Get hotel statistics
   */
  async getStatistics(): Promise<any> {
    const total = await this.count({ where: { isActive: true } });
    const byCity = await this.model.findAll({
      attributes: ['city', [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count']],
      where: { isActive: true },
      group: ['city'],
      raw: true,
    });

    return { total, byCity };
  }
}
