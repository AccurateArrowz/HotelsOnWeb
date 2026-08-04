import { HotelRepository } from './hotel.repository';
import { HttpError } from '@/common/http-error';
import Hotel from '@/models/Hotel';
import HotelImage from '@/models/HotelImage';

const IMAGEKIT_BASE_URL = 'https://ik.imagekit.io/kbk987i3nx/hotels-on-web-images';

const SHARED_IMAGES = [
  'reception .jpg',
  'room-1.jpg',
  'room-2.jpg',
  'room-3.jpg',
  'room-4.jpg',
  'washroom1.jpg',
  'washrooom-2.jpg',
  'pool.jpg',
];

/**
 * Hotel service for hotel operations
 */
export class HotelService {
  private hotelRepository: HotelRepository;

  constructor() {
    this.hotelRepository = new HotelRepository();
  }

  /**
   * Get all active hotels with search and pagination
   */
  async getHotels(search?: string, limit: number = 20, offset: number = 0) {
    const { hotels, total } = await this.hotelRepository.findActiveHotels(search, limit, offset);

    return {
      data: hotels.map((hotel) => this.formatHotelResponse(hotel)),
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get hotel by ID
   */
  async getHotelById(hotelId: number) {
    const hotel = await this.hotelRepository.findByIdWithAssociations(hotelId);

    if (!hotel) {
      throw HttpError.notFound('Hotel not found');
    }

    return this.formatHotelResponse(hotel);
  }

  /**
   * Create new hotel
   */
  async createHotel(data: any, ownerId: number) {
    const hotel = await this.hotelRepository.create({
      ...data,
      ownerId,
      isActive: true,
    });

    return hotel;
  }

  /**
   * Update hotel
   */
  async updateHotel(hotelId: number, data: any) {
    const hotel = await this.hotelRepository.findById(hotelId);

    if (!hotel) {
      throw HttpError.notFound('Hotel not found');
    }

    await this.hotelRepository.update(hotelId, data);

    return this.hotelRepository.findById(hotelId);
  }

  /**
   * Delete hotel (soft delete)
   */
  async deleteHotel(hotelId: number) {
    const hotel = await this.hotelRepository.findById(hotelId);

    if (!hotel) {
      throw HttpError.notFound('Hotel not found');
    }

    await this.hotelRepository.update(hotelId, { isActive: false });
  }

  /**
   * Get hotels by owner
   */
  async getHotelsByOwner(ownerId: number) {
    const hotels = await this.hotelRepository.findByOwnerId(ownerId);

    return hotels.map((hotel) => this.formatHotelResponse(hotel));
  }

  /**
   * Search hotels
   */
  async searchHotels(query: string, limit: number = 20, offset: number = 0) {
    const hotels = await this.hotelRepository.search(query, limit, offset);

    return hotels.map((hotel) => this.formatHotelResponse(hotel));
  }

  /**
   * Get hotel statistics
   */
  async getStatistics() {
    return this.hotelRepository.getStatistics();
  }

  /**
   * Format hotel response with images
   */
  private formatHotelResponse(hotel: Hotel) {
    const hotelJson = hotel.toJSON();

    // Get primary image from database
    const images = hotelJson.images || [];
    const primaryImage = images.find((img: any) => img.isPrimary);

    // Build images array: primary image first, then shared images from ImageKit
    const finalImages = [];

    if (primaryImage) {
      finalImages.push({
        id: primaryImage.id,
        imageUrl: primaryImage.imageUrl,
        isPrimary: true,
        orderIndex: 0,
      });
    }

    // Append shared images from ImageKit in the specified order
    SHARED_IMAGES.forEach((imageName, index) => {
      finalImages.push({
        id: `shared-${index}`,
        imageUrl: `${IMAGEKIT_BASE_URL}/${imageName}`,
        isPrimary: false,
        orderIndex: primaryImage ? index + 1 : index,
      });
    });

    return {
      ...hotelJson,
      images: finalImages,
    };
  }
}
