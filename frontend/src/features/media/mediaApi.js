import { baseApi } from '@app/store/baseApi';

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMediaAuth: builder.query({
      query: () => ({
        url: '/media/auth',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetMediaAuthQuery } = mediaApi;
