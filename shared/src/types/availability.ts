/** Availability data returned for one room type over a requested date range. */
export interface RoomTypeAvailability {
  roomTypeId: number;
  name: string;
  description: string | null;
  basePrice: number;
  adults: number;
  children: number;
  availableRooms: number;
  nights: number;
  totalPrice: number;
  isAvailable: boolean;
}

/** Data payload returned by GET /hotels/:hotelId/availability. */
export type HotelAvailabilityData = RoomTypeAvailability[];
