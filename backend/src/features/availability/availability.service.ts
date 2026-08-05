import { RoomTypeRepository } from '@/features/roomType/roomType.repository';
import { BookingRepository } from '@/features/booking/booking.repository';
import { HttpError } from '@/common/http-error';

/**
 * Max rooms shown to the client per room type. This is a display cap only -
 * it never affects the real availability calculation (isAvailable, actual counts used internally).
 */
const MAX_DISPLAYED_ROOMS = 5;

/**
 * Availability service - checks room availability across a date range for a hotel.
 * Spans RoomType, Room and Booking, so it lives outside any single one of those features.
 */
export class AvailabilityService {
  private roomTypeRepository: RoomTypeRepository;
  private bookingRepository: BookingRepository;

  constructor() {
    this.roomTypeRepository = new RoomTypeRepository();
    this.bookingRepository = new BookingRepository();
  }

  /**
   * Get availability for all room types at a hotel for the given dates
   */
  async getHotelAvailability(hotelId: number, checkInDate: string, checkOutDate: string) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (!Number.isFinite(nights) || nights <= 0) {
      throw HttpError.badRequest('Check-out date must be after check-in date');
    }

    const roomTypes = await this.roomTypeRepository.findByHotelId(hotelId);
    const overlappingBookings = await this.bookingRepository.findOverlappingBookings(hotelId, checkInDate, checkOutDate);

    // Count booked rooms per room type from overlapping bookings
    const bookedCounts: Record<number, number> = {};
    for (const booking of overlappingBookings) {
      for (const bookingRoom of booking.bookingRooms ?? []) {
        bookedCounts[bookingRoom.roomTypeId] = (bookedCounts[bookingRoom.roomTypeId] || 0) + 1;
      }
    }

    return roomTypes.map((roomType) => {
      const totalRooms = roomType.rooms?.length ?? 0;
      const bookedRooms = bookedCounts[roomType.id] || 0;
      const availableRooms = Math.max(0, totalRooms - bookedRooms);
      const totalPrice = Number(roomType.pricePerNight) * nights;

      return {
        roomTypeId: roomType.id,
        name: roomType.name,
        description: roomType.description,
        pricePerNight: Number(roomType.pricePerNight),
        capacity: roomType.capacity,
        amenities: roomType.amenities,
        // Display-only cap - real availability (isAvailable) is computed from the uncapped counts above
        totalRooms: Math.min(totalRooms, MAX_DISPLAYED_ROOMS),
        availableRooms: Math.min(availableRooms, MAX_DISPLAYED_ROOMS),
        bookedRooms,
        nights,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        isAvailable: availableRooms > 0,
      };
    });
  }
}
