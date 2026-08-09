import { RoomTypeRepository } from './roomType.repository';
import { HttpError } from '@/common/http-error';
import RoomType from '@/features/roomType/models/RoomType';

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
  async getRoomTypesByHotel(hotelId: number) {
    const roomTypes = await this.roomTypeRepository.findByHotelId(hotelId);

    if (!roomTypes || roomTypes.length === 0) {
      throw HttpError.notFound('No room types found for this hotel');
    }

    return roomTypes;
  }

  /**
   * Get room type by ID
   */
  async getRoomTypeById(roomTypeId: number) {
    const roomType = await this.roomTypeRepository.findByIdWithRelations(roomTypeId);

    if (!roomType) {
      throw HttpError.notFound('Room type not found');
    }

    return roomType;
  }

  /**
   * Create new room type
   */
  async createRoomType(data: any) {
    const { hotelId, name, description, pricePerNight, capacity, amenities } = data;

    if (!hotelId || !name || !pricePerNight || !capacity) {
      throw HttpError.badRequest('Hotel ID, name, price per night, and capacity are required');
    }

    const roomType = await this.roomTypeRepository.create({
      hotelId,
      name,
      description,
      pricePerNight,
      capacity,
      amenities,
    });

    return roomType;
  }

  /**
   * Update room type
   */
  async updateRoomType(roomTypeId: number, data: any) {
    const roomType = await this.roomTypeRepository.findById(roomTypeId);

    if (!roomType) {
      throw HttpError.notFound('Room type not found');
    }

    await this.roomTypeRepository.update(roomTypeId, data);

    return this.roomTypeRepository.findById(roomTypeId);
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
}
