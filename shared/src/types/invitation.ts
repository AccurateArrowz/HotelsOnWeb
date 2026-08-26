import type { User } from './user';
import type { Hotel } from './hotel';
import type { Role } from './role';

/**
 * Invitation status constants
 */
export const INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  DECLINED: 'declined',
} as const;

export type InvitationStatus = (typeof INVITATION_STATUS)[keyof typeof INVITATION_STATUS];

/**
 * Invitation entity (staff invitation to join hotel)
 */
export interface Invitation {
  id: number;
  hotelId: number;
  invitedEmail: string;
  invitedBy: number;
  roleId: number;
  token: string;
  tokenExpiresAt: string; // ISO date string
  status: InvitationStatus;
  acceptedAt: string | null; // ISO date string
  acceptedByUserId: number | null;
  cancelledAt: string | null; // ISO date string
  cancelledBy: number | null;
  createdAt: string;
  updatedAt: string;
  // Optional nested associations
  hotel?: Hotel;
  inviter?: User;
  role?: Role;
  acceptedBy?: User;
  cancelledByUser?: User;
}

/**
 * Invitation details for accept page (public endpoint response)
 */
export interface InvitationDetails {
  email: string;
  hotelName: string;
  roleName: string;
  inviterName: string;
}
