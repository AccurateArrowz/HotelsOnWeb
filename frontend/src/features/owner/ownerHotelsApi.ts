import { baseApi } from '@app/store/baseApi';
import type { RoomType } from '@features/owner/roomTypesApi';

export interface OwnerHotel {
  id: number;
  name: string;
  description: string | null;
  street: string;
  city: string;
  country: string;
  amenities: string[] | null;
  isActive: boolean;
  hotelOwnerId: number;
  createdAt?: string;
  updatedAt?: string;
  roomTypes?: RoomType[];
  images?: {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
    orderIndex: number;
  }[];
}

export const ownerHotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyHotels: builder.query<OwnerHotel[], void>({
      query: () => '/hotels/owner/my-hotels',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Hotel' as const, id })),
              { type: 'Hotel', id: 'OWNER_LIST' },
            ]
          : [{ type: 'Hotel', id: 'OWNER_LIST' }],
    }),

    getMyHotelById: builder.query<OwnerHotel, number>({
      query: (hotelId) => `/hotels/owner/my-hotels/${hotelId}`,
      providesTags: (_result, _error, hotelId) => [{ type: 'Hotel', id: hotelId }],
    }),
  }),
});

export const { useGetMyHotelsQuery, useGetMyHotelByIdQuery } = ownerHotelsApi;
