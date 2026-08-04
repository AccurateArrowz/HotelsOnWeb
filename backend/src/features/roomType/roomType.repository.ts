import { BaseRepository } from '@/common/base.repository';
import RoomType from '@/models/RoomType';

/**
 * RoomType repository for room type operations
 */
export class RoomTypeRepository extends BaseRepository<RoomType> {
  constructor() {
    super(RoomType);
  }

  /**
   * Find room types by hotel
   */
  async findByHotelId(hotelId: number): Promise<RoomType[]> {
    return this.findAll({
      where: { hotelId },
      include: [{ association: 'rooms' }],
    });
  }

  /**
   * Find room type by ID
   */
  async findByIdWithRelations(roomTypeId: number): Promise<RoomType | null> {
    return this.findOne({
      where: { id: roomTypeId },
      include: [{ association: 'rooms' }, { association: 'hotel' }],
    });
  }
}
