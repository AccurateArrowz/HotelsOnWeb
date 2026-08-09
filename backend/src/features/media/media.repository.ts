import { BaseRepository } from '@/common/base.repository';
import HotelImage from '@/features/hotel/models/HotelImage';
import HotelRequestImage from '@/features/hotel-request/models/HotelRequestImage';

/**
 * Media repository for media operations
 */
export class MediaRepository {
  private hotelImageRepository: BaseRepository<HotelImage>;
  private hotelRequestImageRepository: BaseRepository<HotelRequestImage>;

  constructor() {
    this.hotelImageRepository = new BaseRepository(HotelImage);
    this.hotelRequestImageRepository = new BaseRepository(HotelRequestImage);
  }

  /**
   * Get hotel images
   */
  async getHotelImages(hotelId: number): Promise<HotelImage[]> {
    return this.hotelImageRepository.findAll({
      where: { hotelId },
      order: [['orderIndex', 'ASC']],
    });
  }

  /**
   * Get hotel image by ID
   */
  async getHotelImageById(imageId: number): Promise<HotelImage | null> {
    return this.hotelImageRepository.findById(imageId);
  }

  /**
   * Create hotel image
   */
  async createHotelImage(data: any): Promise<HotelImage> {
    return this.hotelImageRepository.create(data);
  }

  /**
   * Update hotel image
   */
  async updateHotelImage(imageId: number, data: any): Promise<HotelImage | null> {
    await this.hotelImageRepository.update(imageId, data);
    return this.hotelImageRepository.findById(imageId);
  }

  /**
   * Delete hotel image
   */
  async deleteHotelImage(imageId: number): Promise<void> {
    await this.hotelImageRepository.delete(imageId);
  }

  /**
   * Set primary image
   */
  async setPrimaryImage(hotelId: number, imageId: number): Promise<void> {
    // Remove primary from all images
    await HotelImage.update({ isPrimary: false }, { where: { hotelId } });

    // Set new primary
    await this.hotelImageRepository.update(imageId, { isPrimary: true });
  }

  /**
   * Get hotel request images
   */
  async getHotelRequestImages(requestId: number): Promise<HotelRequestImage[]> {
    return this.hotelRequestImageRepository.findAll({
      where: { hotelRequestId: requestId },
      order: [['orderIndex', 'ASC']],
    });
  }

  /**
   * Get hotel request image by ID
   */
  async getHotelRequestImageById(imageId: number): Promise<HotelRequestImage | null> {
    return this.hotelRequestImageRepository.findById(imageId);
  }

  /**
   * Create hotel request image
   */
  async createHotelRequestImage(data: any): Promise<HotelRequestImage> {
    return this.hotelRequestImageRepository.create(data);
  }

  /**
   * Update hotel request image
   */
  async updateHotelRequestImage(imageId: number, data: any): Promise<HotelRequestImage | null> {
    await this.hotelRequestImageRepository.update(imageId, data);
    return this.hotelRequestImageRepository.findById(imageId);
  }

  /**
   * Delete hotel request image
   */
  async deleteHotelRequestImage(imageId: number): Promise<void> {
    await this.hotelRequestImageRepository.delete(imageId);
  }

  /**
   * Bulk delete hotel images
   */
  async bulkDeleteHotelImages(imageIds: number[]): Promise<number> {
    return HotelImage.destroy({ where: { id: imageIds } });
  }

  /**
   * Bulk delete hotel request images
   */
  async bulkDeleteHotelRequestImages(imageIds: number[]): Promise<number> {
    return HotelRequestImage.destroy({ where: { id: imageIds } });
  }
}
