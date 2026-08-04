import { RoomRepository } from './room.repository';
import { HttpError } from '@/common/http-error';
import Room from '@/models/Room';

/**
 * Room service for room operations
 */
export class RoomService {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  /**
   * Get rooms by hotel
   */
  async getRoomsByHotel(hotelId: number) {
    const rooms = await this.roomRepository.findByHotelId(hotelId);

    if (!rooms || rooms.length === 0) {
      throw HttpError.notFound('No rooms found for this hotel');
    }

    return rooms;
  }

  /**
   * Get room by ID
   */
  async getRoomById(roomId: number) {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw HttpError.notFound('Room not found');
    }

    return room;
  }

  /**
   * Create new room
   */
  async createRoom(data: any) {
    const room = await this.roomRepository.create(data);

    return room;
  }

  /**
   * Update room
   */
  async updateRoom(roomId: number, data: any) {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw HttpError.notFound('Room not found');
    }

    await this.roomRepository.update(roomId, data);

    return this.roomRepository.findById(roomId);
  }

  /**
   * Delete room
   */
  async deleteRoom(roomId: number) {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw HttpError.notFound('Room not found');
    }

    await this.roomRepository.delete(roomId);
  }

  /**
   * Get available rooms
   */
  async getAvailableRooms(hotelId: number, roomTypeId?: number) {
    const rooms = await this.roomRepository.findAvailableRooms(hotelId, roomTypeId);

    return rooms;
  }

  /**
   * Get occupied rooms
   */
  async getOccupiedRooms(hotelId: number) {
    const rooms = await this.roomRepository.findOccupiedRooms(hotelId);

    return rooms;
  }

  /**
   * Get room statistics
   */
  async getRoomStatistics(hotelId: number) {
    const countByStatus = await this.roomRepository.getCountByStatus(hotelId);

    return {
      total: Object.values(countByStatus).reduce((a: any, b: any) => a + b, 0),
      byStatus: countByStatus,
    };
  }

  /**
   * Update room status
   */
  async updateRoomStatus(roomId: number, status: string) {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw HttpError.notFound('Room not found');
    }

    await this.roomRepository.updateStatus(roomId, status);

    return this.roomRepository.findById(roomId);
  }

  /**
   * Bulk update room status
   */
  async bulkUpdateRoomStatus(roomIds: number[], status: string) {
    const updated = await this.roomRepository.bulkUpdateStatus(roomIds, status);

    return { updated };
  }
}
