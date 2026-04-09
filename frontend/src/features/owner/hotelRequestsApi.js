import { baseApi } from '@app/store/baseApi';

export const hotelRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createHotelRequest: builder.mutation({
      query: (body) => ({
        url: '/hotel-requests/request',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateHotelRequestMutation } = hotelRequestsApi;
