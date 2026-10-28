import type { Hotel } from './hotel';

/**
 * RoomType entity
 */
export interface RoomType {
  id: string;
  hotelId: number;
  name: string;
  description: string | null;
  basePrice: number;
  isActive: boolean;
  adults: number;
  children: number;
  createdAt: string;
  updatedAt: string;
  availableRooms: number;
  isAvailable: boolean;
}

export type SelectedRoomTypes = Array<{roomTypeId: string, count: number}>

