import { RoomTypeRepository } from '@/features/roomType/roomType.repository';
import { BookingRepository } from '@/features/booking/booking.repository';
import { HttpError } from '@/common/http-error';
import type { HotelAvailabilityData } from '@hotelsonweb/shared';

/**
 * Max rooms shown to the client per room type. This is a display cap only -
 * it never affects the real availability calculation (isAvailable, actual counts used internally).
 */
const MAX_DISPLAYED_ROOMS = 5;

/** Convert a validated ISO calendar date to an integer day ordinal. */
const toCalendarDay = (value: string): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const maxDay = daysInMonth[month - 1];
  if (year < 1 || maxDay === undefined || day < 1 || day > maxDay) {
    return null;
  }

  const priorYear = year - 1;
  const daysBeforeYear = priorYear * 365 + Math.floor(priorYear / 4) - Math.floor(priorYear / 100) + Math.floor(priorYear / 400);
  const daysBeforeMonth = daysInMonth.slice(0, month - 1).reduce((total, days) => total + days, 0);
  return daysBeforeYear + daysBeforeMonth + day;
};

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
  async getHotelAvailability(
    hotelId: number,
    checkInDate: string,
    checkOutDate: string
  ): Promise<HotelAvailabilityData> {
    const checkInDay = toCalendarDay(checkInDate);
    const checkOutDay = toCalendarDay(checkOutDate);
    const nights = (checkInDay === null || checkOutDay === null) ? 0 : checkOutDay - checkInDay;

    if (nights <= 0) {
      throw HttpError.badRequest('Check-in and check-out dates must be valid calendar dates, and check-out must be after check-in');
    }

    const roomTypes = await this.roomTypeRepository.findByHotelId(hotelId);
    const overlappingBookings = await this.bookingRepository.findOverlappingBookings(hotelId, checkInDate, checkOutDate);

    // Count booked rooms per room type from overlapping bookings
    const bookedCounts: Record<number, number> = {};
    for (const booking of overlappingBookings) {
      for (const bookingRoom of booking.bookingRooms ?? []) {
        bookedCounts[bookingRoom.roomTypeId] = (bookedCounts[bookingRoom.roomTypeId] || 0) + bookingRoom.quantity;
      }
    }

    return roomTypes.map((roomType) => {
      const totalRooms = roomType.rooms?.length ?? 0;
      const bookedRooms = bookedCounts[roomType.id] || 0;
      const availableRooms = Math.max(0, totalRooms - bookedRooms);
      const totalPrice = Number(roomType.basePrice) * nights;

      return {
        roomTypeId: roomType.id,
        name: roomType.name,
        description: roomType.description,
        basePrice: Number(roomType.basePrice),
        adults: roomType.adults,
        children: roomType.children,
        availableRooms: Math.min(availableRooms, MAX_DISPLAYED_ROOMS), // capped to MAX_DISPLAYED_ROOMS
        nights,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        isAvailable: availableRooms > 0,
      };
    });
  }
}
