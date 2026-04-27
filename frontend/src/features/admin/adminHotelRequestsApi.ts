import { baseApi } from '@app/store/baseApi';

type HotelRequestStatus = 'pending' | 'approved' | 'rejected';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface HotelRequest {
  id: number;
  hotelName: string;
  description: string;
  address: string;
  street: string;
  city: string;
  country: string;
  ownerId: number;
  ownerName: string;
  status: HotelRequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

interface UpdateHotelRequestStatusRequest {
  id: number;
  status: HotelRequestStatus;
  adminNotes?: string;
}

interface UpdateHotelRequestStatusResponse {
  id: number;
  status: HotelRequestStatus;
  adminNotes?: string;
  updatedAt: string;
}

export const adminHotelRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotelRequests: builder.query<HotelRequest[], HotelRequestStatus | void>({
      query: (status) => ({
        url: '/hotel-requests/all',
        params: status ? { status } : undefined,
      }),
      providesTags: ['HotelRequest'],
    }),

    updateHotelRequestStatus: builder.mutation<
      UpdateHotelRequestStatusResponse,
      UpdateHotelRequestStatusRequest
    >({
      query: ({ id, status, adminNotes }) => ({
        url: `/hotel-requests/request/${id}/status`,
        method: 'PATCH',
        body: { status, adminNotes },
      }),
      invalidatesTags: ['HotelRequest', 'Hotel'],
    }),
  }),
});

export const {
  useGetHotelRequestsQuery,
  useUpdateHotelRequestStatusMutation,
} = adminHotelRequestsApi;
