import type { Hotel } from './hotel';
import type { RoomType } from './roomType';

/**
 * Room status constants
 */
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  RESERVED: 'reserved',
} as const;

export type RoomStatus = (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS];

/**
 * Room entity
 */
export interface Room {
  id: number;
  hotelId: number;
  roomTypeId: number;
  roomNumber: string;
  status: RoomStatus;
  createdAt: string;
  updatedAt: string;
}
