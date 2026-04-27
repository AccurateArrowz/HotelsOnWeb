import { baseApi } from '@app/store/baseApi';

interface CreateHotelRequestRequest {
  hotelName: string;
  description: string;
  address: string;
  city: string;
  country: string;
  starRating?: number;
  amenities?: string[];
}

interface CreateHotelRequestResponse {
  id: number;
  hotelName: string;
  description: string;
  address: string;
  city: string;
  country: string;
  ownerId: number;
  status: 'pending';
  createdAt: string;
}

export const hotelRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createHotelRequest: builder.mutation<
      CreateHotelRequestResponse,
      CreateHotelRequestRequest
    >({
      query: (body) => ({
        url: '/hotel-requests/request',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateHotelRequestMutation } = hotelRequestsApi;
