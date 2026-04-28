import { baseApi } from '@app/store/baseApi';

export interface Room {
  id: number;
  roomId: string;
  hotelId: number;
  roomTypeId: number;
  roomNumber: string;
  floor: number | null;
  adults: number;
  children: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  roomType?: {
    id: number;
    name: string;
    basePrice: string | number;
  };
}

export interface CreateRoomRequest {
  roomNumber: string;
  floor?: number;
  roomTypeId: number;
  adults?: number;
  children?: number;
  status?: Room['status'];
}

export interface UpdateRoomRequest {
  roomNumber?: string;
  floor?: number;
  roomTypeId?: number;
  adults?: number;
  children?: number;
  status?: Room['status'];
  isActive?: boolean;
}

export const roomsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoomsByHotel: builder.query<Room[], number>({
      query: (hotelId) => `/hotels/${hotelId}/rooms`,
      providesTags: (result, _error, hotelId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Room' as const, id })),
              { type: 'Room', id: `HOTEL-${hotelId}` },
            ]
          : [{ type: 'Room', id: `HOTEL-${hotelId}` }],
    }),

    getRoomById: builder.query<Room, { hotelId: number; roomId: number }>({
      query: ({ hotelId, roomId }) => `/hotels/${hotelId}/rooms/${roomId}`,
      providesTags: (_result, _error, { roomId }) => [{ type: 'Room', id: roomId }],
    }),

    createRoom: builder.mutation<Room, { hotelId: number; data: CreateRoomRequest }>({
      query: ({ hotelId, data }) => ({
        url: `/hotels/${hotelId}/rooms`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { hotelId }) => [
        { type: 'Room', id: `HOTEL-${hotelId}` },
      ],
    }),

    updateRoom: builder.mutation<
      Room,
      { hotelId: number; roomId: number; data: UpdateRoomRequest }
    >({
      query: ({ hotelId, roomId, data }) => ({
        url: `/hotels/${hotelId}/rooms/${roomId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { hotelId, roomId }) => [
        { type: 'Room', id: roomId },
        { type: 'Room', id: `HOTEL-${hotelId}` },
      ],
    }),

    deleteRoom: builder.mutation<void, { hotelId: number; roomId: number }>({
      query: ({ hotelId, roomId }) => ({
        url: `/hotels/${hotelId}/rooms/${roomId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { hotelId, roomId }) => [
        { type: 'Room', id: roomId },
        { type: 'Room', id: `HOTEL-${hotelId}` },
      ],
    }),
  }),
});

export const {
  useGetRoomsByHotelQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi;
