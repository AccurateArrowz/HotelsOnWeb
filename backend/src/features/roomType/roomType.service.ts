import { RoomTypeRepository } from './roomType.repository';
import { HttpError } from '@/common/http-error';
import RoomType from '@/features/roomType/models/RoomType';
import type { RoomType as RoomTypeType } from '@hotelsonweb/shared';

/**
 * RoomType service for room type operations
 */
export class RoomTypeService {
  private roomTypeRepository: RoomTypeRepository;

  constructor() {
    this.roomTypeRepository = new RoomTypeRepository();
  }

  /**
   * Get room types by hotel
   */
  async getRoomTypesByHotel(hotelId: number): Promise<RoomTypeType[]> {
    const roomTypes = await this.roomTypeRepository.findByHotelId(hotelId);

    if (!roomTypes || roomTypes.length === 0) {
      throw HttpError.notFound('No room types found for this hotel');
    }

    return roomTypes.map((rt) => this.formatRoomTypeResponse(rt));
  }

  /**
   * Get room type by ID
   */
  async getRoomTypeById(roomTypeId: number): Promise<RoomTypeType> {
    const roomType = await this.roomTypeRepository.findByIdWithRelations(roomTypeId);

    if (!roomType) {
      throw HttpError.notFound('Room type not found');
    }

    return this.formatRoomTypeResponse(roomType);
  }

  /**
   * Create new room type
   */
  async createRoomType(data: any): Promise<RoomTypeType> {
    const { hotelId, name, description, basePrice, adults, children } = data;

    if (!hotelId || !name || !basePrice || !adults) {
      throw HttpError.badRequest('Hotel ID, name, base price, and adult count are required');
    }

    const roomType = await this.roomTypeRepository.create({
      hotelId,
      name,
      description,
      basePrice,
      adults,
      children,
    });

    return this.formatRoomTypeResponse(roomType);
  }

  /**
   * Update room type
   */
  async updateRoomType(roomTypeId: number, data: any): Promise<RoomTypeType> {
    const roomType = await this.roomTypeRepository.findById(roomTypeId);

    if (!roomType) {
      throw HttpError.notFound('Room type not found');
    }

    await this.roomTypeRepository.update(roomTypeId, data);

    const updated = await this.roomTypeRepository.findById(roomTypeId);
    return this.formatRoomTypeResponse(updated!);
  }

  /**
   * Delete room type
   */
  async deleteRoomType(roomTypeId: number) {
    const roomType = await this.roomTypeRepository.findById(roomTypeId);

    if (!roomType) {
      throw HttpError.notFound('Room type not found');
    }

    await this.roomTypeRepository.delete(roomTypeId);
  }

  /**
   * Format room type response - converts ORM instance to shared type
   */
  private formatRoomTypeResponse(roomType: RoomType): RoomTypeType {
    const rtJson = roomType.toJSON() as any;
    return {
      id: rtJson.id,
      hotelId: rtJson.hotelId,
      name: rtJson.name,
      description: rtJson.description,
      basePrice: rtJson.basePrice,
      isActive: rtJson.isActive,
      adults: rtJson.adults,
      children: rtJson.children,
      createdAt: rtJson.createdAt,
      updatedAt: rtJson.updatedAt,
      hotel: rtJson.hotel,
    };
  }
}
