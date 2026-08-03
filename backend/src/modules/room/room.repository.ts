import { BaseRepository } from '@/common/base.repository';
import Room from '@/models/Room';
import { Op } from 'sequelize';

/**
 * Room repository for room operations
 */
export class RoomRepository extends BaseRepository<Room> {
  constructor() {
    super(Room);
  }

  /**
   * Find rooms by hotel
   */
  async findByHotelId(hotelId: number): Promise<Room[]> {
    return this.findAll({
      where: { hotelId },
      include: [{ association: 'roomType' }],
    });
  }

  /**
   * Find rooms by room type
   */
  async findByRoomTypeId(roomTypeId: number): Promise<Room[]> {
    return this.findAll({
      where: { roomTypeId },
    });
  }

  /**
   * Find available rooms for a hotel
   */
  async findAvailableRooms(hotelId: number, roomTypeId?: number): Promise<Room[]> {
    const where: any = { hotelId, status: 'available' };

    if (roomTypeId) {
      where.roomTypeId = roomTypeId;
    }

    return this.findAll({
      where,
      include: [{ association: 'roomType' }],
    });
  }

  /**
   * Find occupied rooms
   */
  async findOccupiedRooms(hotelId: number): Promise<Room[]> {
    return this.findAll({
      where: { hotelId, status: 'occupied' },
      include: [{ association: 'roomType' }],
    });
  }

  /**
   * Get room count by status
   */
  async getCountByStatus(hotelId: number): Promise<any> {
    const statuses = await this.model.findAll({
      attributes: ['status', [this.model.sequelize!.fn('COUNT', this.model.sequelize!.col('id')), 'count']],
      where: { hotelId },
      group: ['status'],
      raw: true,
    });

    return statuses.reduce((acc: any, item: any) => {
      acc[item.status] = item.count;
      return acc;
    }, {});
  }

  /**
   * Update room status
   */
  async updateStatus(roomId: number, status: string): Promise<void> {
    await this.update(roomId, { status });
  }

  /**
   * Bulk update room status
   */
  async bulkUpdateStatus(roomIds: number[], status: string): Promise<number> {
    return this.model.update({ status }, { where: { id: { [Op.in]: roomIds } } }).then((result) => result[0]);
  }
}
