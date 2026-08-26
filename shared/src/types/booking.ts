import type { User } from './user';
import type { Hotel } from './hotel';
import type { Room } from './room';
import type { RoomType } from './roomType';

/**
 * Booking status constants
 */
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

/**
 * BookingRoom entity (junction between Booking and Room)
 */
export interface BookingRoom {
  id: number;
  bookingId: number;
  roomId: number;
  roomTypeId: number;
  quantity: number;
  pricePerNight: number;
  createdAt: string;
  updatedAt: string;
  // Optional nested associations
  room?: Room;
  roomType?: RoomType;
}

/**
 * Booking entity
 */
export interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  checkInDate: string; // ISO date string
  checkOutDate: string; // ISO date string
  specialRequests: string | null;
  status: BookingStatus;
  totalPrice: number;
  paymentStatus: string | null;
  cancelledBy: number | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional nested associations
  user?: User;
  hotel?: Hotel;
  cancelledByUser?: User;
  bookingRooms?: BookingRoom[];
}
