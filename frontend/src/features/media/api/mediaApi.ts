import { baseApi } from '@app/store/baseApi';

interface MediaAuthResponse {
  signature: string;
  expire: number;
  token: string;
}

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMediaAuth: builder.query<MediaAuthResponse, void>({
      query: () => ({
        url: '/media/auth',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetMediaAuthQuery } = mediaApi;
