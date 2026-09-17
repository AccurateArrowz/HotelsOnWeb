import { BaseRepository } from '@/common/base.repository';
import Hotel from '@/features/hotel/models/Hotel';
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
  async searchHotels(
    search?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ hotels: Hotel[]; total: number }> {
    const where: any = { isActive: true };

    if (search && search.trim()) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.model.findAndCountAll({
      where,
      include: [
        { association: 'images', where: { isPrimary: true }, required: false, attributes: ['id', 'imageUrl', 'isPrimary'] },
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
        { association: 'owners' },
        { association: 'hotelStaffs' },
      ],
    });
  }

  /**
   * Find hotels by owner
   */
  async findByOwnerId(ownerId: number): Promise<Hotel[]> {
    return this.findAll({
      include: [
        { association: 'images' },
        { association: 'roomTypes' },
        { association: 'hotelOwners', where: { userId: ownerId }, required: true, attributes: [] },
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
