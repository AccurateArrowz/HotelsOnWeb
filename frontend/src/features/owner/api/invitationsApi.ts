import { baseApi } from '@app/store/baseApi';

export interface StaffInvitation {
  id: number;
  email: string;
  role: number;
  status: 'pending' | 'accepted' | 'expired' | 'declined' |'cancelled';
  createdAt: string;
}

export interface CreateStaffInvitationRequest {
  invitedEmail: string;
  roleId: number;
}

export interface StaffInvitationDetails {
  id: number;
  email: string;
  hotelName: string;
  roleName: string;
  inviterName: string;
}

export const staffInvitationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create and send invitation
    createStaffInvitation: builder.mutation<
      StaffInvitation,
      { hotelId: number; data: CreateStaffInvitationRequest }
    >({
      query: ({ hotelId, data }) => ({
        url: `/hotels/${hotelId}/staff-invitations`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { data: StaffInvitation }) => response.data,
      invalidatesTags: (_result, _error, { hotelId }) => [
        { type: 'Hotel', id: `INVITATIONS-${hotelId}` },
      ],
    }),

    // Get pending invitations for a hotel
    getPendingStaffInvitations: builder.query<
      { data: StaffInvitation[]; pagination: { total: number; page: number; limit: number; pages: number } },
      { hotelId: number; limit?: number; offset?: number }
    >({
      query: ({ hotelId, limit = 20, offset = 0 }) =>
        `/hotels/${hotelId}/staff-invitations?limit=${limit}&offset=${offset}`,
      transformResponse: (response: any) => ({
        data: response.data,
        pagination: response.meta?.pagination || { total: 0, page: 1, limit: 20, pages: 0 },
      }),
      providesTags: (_result, _error, { hotelId }) => [
        { type: 'Hotel', id: `INVITATIONS-${hotelId}` },
      ],
    }),

    // Get invitation details by token (public endpoint)
    getStaffInvitationByToken: builder.query<StaffInvitationDetails, string>({
      query: (token) => `/staff-invitations/${token}`,
      transformResponse: (response: { data: StaffInvitationDetails }) => response.data,
    }),

    // Accept invitation and create account
    acceptStaffInvitation: builder.mutation<
      { user: { id: number; email: string; firstName: string; lastName: string }; message: string },
      {
        token: string;
        firstName: string;
        lastName: string;
        password: string;
        phone?: string;
      }
    >({
      query: ({ token, ...body }) => ({
        url: `/staff-invitations/${token}/accept`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => response.data,
    }),

    // Resend invitation email
    resendStaffInvitation: builder.mutation<
      void,
      { hotelId: number; invitationId: number }
    >({
      query: ({ hotelId, invitationId }) => ({
        url: `/hotels/${hotelId}/staff-invitations/${invitationId}/resend`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { hotelId }) => [
        { type: 'Hotel', id: `INVITATIONS-${hotelId}` },
      ],
    }),

    // Cancel invitation
    cancelStaffInvitation: builder.mutation<
      void,
      { hotelId: number; invitationId: number }
    >({
      query: ({ hotelId, invitationId }) => ({
        url: `/hotels/${hotelId}/staff-invitations/${invitationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { hotelId }) => [
        { type: 'Hotel', id: `INVITATIONS-${hotelId}` },
      ],
    }),
  }),
});

export const {
  useCreateStaffInvitationMutation,
  useGetPendingStaffInvitationsQuery,
  useGetStaffInvitationByTokenQuery,
  useAcceptStaffInvitationMutation,
  useResendStaffInvitationMutation,
  useCancelStaffInvitationMutation,
} = staffInvitationsApi;
