import { MediaRepository } from './media.repository';
import { HttpError } from '@/common/http-error';

/**
 * Media service for media operations
 */
export class MediaService {
  private mediaRepository: MediaRepository;

  constructor() {
    this.mediaRepository = new MediaRepository();
  }

  /**
   * Get hotel images
   */
  async getHotelImages(hotelId: number) {
    const images = await this.mediaRepository.getHotelImages(hotelId);

    return images;
  }

  /**
   * Get hotel image by ID
   */
  async getHotelImageById(imageId: number) {
    const image = await this.mediaRepository.getHotelImageById(imageId);

    if (!image) {
      throw HttpError.notFound('Hotel image not found');
    }

    return image;
  }

  /**
   * Upload hotel image
   */
  async uploadHotelImage(hotelId: number, data: any) {
    const image = await this.mediaRepository.createHotelImage({
      hotelId,
      ...data,
    });

    return image;
  }

  /**
   * Update hotel image
   */
  async updateHotelImage(imageId: number, data: any) {
    const image = await this.mediaRepository.updateHotelImage(imageId, data);

    if (!image) {
      throw HttpError.notFound('Hotel image not found');
    }

    return image;
  }

  /**
   * Delete hotel image
   */
  async deleteHotelImage(imageId: number) {
    const image = await this.mediaRepository.getHotelImageById(imageId);

    if (!image) {
      throw HttpError.notFound('Hotel image not found');
    }

    await this.mediaRepository.deleteHotelImage(imageId);
  }

  /**
   * Set primary image
   */
  async setPrimaryImage(hotelId: number, imageId: number) {
    const image = await this.mediaRepository.getHotelImageById(imageId);

    if (!image || image.hotelId !== hotelId) {
      throw HttpError.notFound('Hotel image not found');
    }

    await this.mediaRepository.setPrimaryImage(hotelId, imageId);
  }

  /**
   * Get hotel request images
   */
  async getHotelRequestImages(requestId: number) {
    const images = await this.mediaRepository.getHotelRequestImages(requestId);

    return images;
  }

  /**
   * Get hotel request image by ID
   */
  async getHotelRequestImageById(imageId: number) {
    const image = await this.mediaRepository.getHotelRequestImageById(imageId);

    if (!image) {
      throw HttpError.notFound('Hotel request image not found');
    }

    return image;
  }

  /**
   * Upload hotel request image
   */
  async uploadHotelRequestImage(requestId: number, data: any) {
    const image = await this.mediaRepository.createHotelRequestImage({
      hotelRequestId: requestId,
      ...data,
    });

    return image;
  }

  /**
   * Update hotel request image
   */
  async updateHotelRequestImage(imageId: number, data: any) {
    const image = await this.mediaRepository.updateHotelRequestImage(imageId, data);

    if (!image) {
      throw HttpError.notFound('Hotel request image not found');
    }

    return image;
  }

  /**
   * Delete hotel request image
   */
  async deleteHotelRequestImage(imageId: number) {
    const image = await this.mediaRepository.getHotelRequestImageById(imageId);

    if (!image) {
      throw HttpError.notFound('Hotel request image not found');
    }

    await this.mediaRepository.deleteHotelRequestImage(imageId);
  }

  /**
   * Bulk delete hotel images
   */
  async bulkDeleteHotelImages(imageIds: number[]) {
    const deleted = await this.mediaRepository.bulkDeleteHotelImages(imageIds);

    return { deleted };
  }

  /**
   * Bulk delete hotel request images
   */
  async bulkDeleteHotelRequestImages(imageIds: number[]) {
    const deleted = await this.mediaRepository.bulkDeleteHotelRequestImages(imageIds);

    return { deleted };
  }
}
