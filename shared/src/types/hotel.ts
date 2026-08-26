import type { User } from './user';

/**
 * Hotel image entity
 */
export interface HotelImage {
  id: number;
  hotelId: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hotel entity
 */
export interface Hotel {
  id: number;
  name: string;
  description: string | null;
  street: string;
  city: string;
  country: string;
  amenities: string[] | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional nested associations
  images?: HotelImage[];
  owners?: User[];
}

/**
 * Hotel list item (minimal fields for list views)
 */
export interface HotelListItem {
  id: number;
  name: string;
  description: string | null;
  street: string;
  city: string;
  country: string;
  image: string | null; // primary image URL or null
}
