import { baseApi } from '@app/store/baseApi';

export interface RoomType {
  id: number;
  hotelId: number;
  name: string;
  description: string | null;
  basePrice: string | number;
  adults: number;
  children: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoomTypeRequest {
  name: string;
  description?: string;
  basePrice: number;
  adults?: number;
  children?: number;
}

export interface UpdateRoomTypeRequest {
  name?: string;
  description?: string;
  basePrice?: number;
  adults?: number;
  children?: number;
  isActive?: boolean;
}

export const roomTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoomTypesByHotel: builder.query<RoomType[], number>({
      query: (hotelId) => `/hotels/${hotelId}/room-types`,
      providesTags: (result, _error, hotelId) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'RoomType' as const, id })),
              { type: 'RoomType', id: `HOTEL-${hotelId}` },
            ]
          : [{ type: 'RoomType', id: `HOTEL-${hotelId}` }],
    }),

    getRoomTypeById: builder.query<RoomType, { hotelId: number; roomTypeId: number }>({
      query: ({ hotelId, roomTypeId }) => `/hotels/${hotelId}/room-types/${roomTypeId}`,
      providesTags: (_result, _error, { roomTypeId }) => [{ type: 'RoomType', id: roomTypeId }],
    }),

    createRoomType: builder.mutation<RoomType, { hotelId: number; data: CreateRoomTypeRequest }>({
      query: ({ hotelId, data }) => ({
        url: `/hotels/${hotelId}/room-types`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { hotelId }) => [
        { type: 'RoomType', id: `HOTEL-${hotelId}` },
      ],
    }),

    updateRoomType: builder.mutation<
      RoomType, 
      { hotelId: number; roomTypeId: number; data: UpdateRoomTypeRequest }
    >({
      query: ({ hotelId, roomTypeId, data }) => ({
        url: `/hotels/${hotelId}/room-types/${roomTypeId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { hotelId, roomTypeId }) => [
        { type: 'RoomType', id: roomTypeId },
        { type: 'RoomType', id: `HOTEL-${hotelId}` },
      ],
    }),

    deleteRoomType: builder.mutation<void, { hotelId: number; roomTypeId: number }>({
      query: ({ hotelId, roomTypeId }) => ({
        url: `/hotels/${hotelId}/room-types/${roomTypeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { hotelId, roomTypeId }) => [
        { type: 'RoomType', id: roomTypeId },
        { type: 'RoomType', id: `HOTEL-${hotelId}` },
      ],
    }),
  }),
});

export const {
  useGetRoomTypesByHotelQuery,
  useGetRoomTypeByIdQuery,
  useCreateRoomTypeMutation,
  useUpdateRoomTypeMutation,
  useDeleteRoomTypeMutation,
} = roomTypesApi;
