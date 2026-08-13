import { RoomRepository } from './room.repository';
import { HttpError } from '@/common/http-error';
import Room from '@/features/room/models/Room';
import type { Room as RoomType } from '@hotelsonweb/shared';

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
  async getRoomsByHotel(hotelId: number): Promise<RoomType[]> {
    const rooms = await this.roomRepository.findByHotelId(hotelId);

    if (!rooms || rooms.length === 0) {
      throw HttpError.notFound('No rooms found for this hotel');
    }

    return rooms.map((r) => this.formatRoomResponse(r));
  }

  /**
   * Get room by ID
   */
  async getRoomById(roomId: number): Promise<RoomType> {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw HttpError.notFound('Room not found');
    }

    return this.formatRoomResponse(room);
  }

  /**
   * Create new room
   */
  async createRoom(data: any): Promise<RoomType> {
    const room = await this.roomRepository.create(data);

    return this.formatRoomResponse(room);
  }

  /**
   * Update room
   */
  async updateRoom(roomId: number, data: any): Promise<RoomType> {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw HttpError.notFound('Room not found');
    }

    await this.roomRepository.update(roomId, data);

    const updated = await this.roomRepository.findById(roomId);
    return this.formatRoomResponse(updated!);
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
  async getAvailableRooms(hotelId: number, roomTypeId?: number): Promise<RoomType[]> {
    const rooms = await this.roomRepository.findAvailableRooms(hotelId, roomTypeId);

    return rooms.map((r) => this.formatRoomResponse(r));
  }

  /**
   * Get occupied rooms
   */
  async getOccupiedRooms(hotelId: number): Promise<RoomType[]> {
    const rooms = await this.roomRepository.findOccupiedRooms(hotelId);

    return rooms.map((r) => this.formatRoomResponse(r));
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
  async updateRoomStatus(roomId: number, status: string): Promise<RoomType> {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw HttpError.notFound('Room not found');
    }

    await this.roomRepository.updateStatus(roomId, status);

    const updated = await this.roomRepository.findById(roomId);
    return this.formatRoomResponse(updated!);
  }

  /**
   * Bulk update room status
   */
  async bulkUpdateRoomStatus(roomIds: number[], status: string) {
    const updated = await this.roomRepository.bulkUpdateStatus(roomIds, status);

    return { updated };
  }

  /**
   * Format room response - converts ORM instance to shared type
   */
  private formatRoomResponse(room: Room): RoomType {
    const roomJson = room.toJSON() as any;
    return {
      id: roomJson.id,
      hotelId: roomJson.hotelId,
      roomTypeId: roomJson.roomTypeId,
      roomNumber: roomJson.roomNumber,
      status: roomJson.status,
      createdAt: roomJson.createdAt,
      updatedAt: roomJson.updatedAt,
      hotel: roomJson.hotel,
      roomType: roomJson.roomType,
    };
  }
}
