import type { Hotel } from './hotel';

/**
 * RoomType entity
 */
export interface RoomType {
  id: number;
  hotelId: number;
  name: string;
  description: string | null;
  basePrice: number;
  isActive: boolean;
  adults: number;
  children: number;
  createdAt: string;
  updatedAt: string;
  // Optional nested associations
  hotel?: Hotel;
}
