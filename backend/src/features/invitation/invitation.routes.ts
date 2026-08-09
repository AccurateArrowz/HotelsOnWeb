import { Router } from 'express';
import { InvitationController } from './invitation.controller';
import { authenticateToken } from '@/middleware/auth.middleware';
import { requireHotelOwner } from '@/middleware/hotel-owner.middleware';

const router = Router({ mergeParams: true });
const invitationController = new InvitationController();

/**
 * Public routes (no authentication required)
 * Mounted at: /api/staff-invitations
 */

/**
 * GET /staff-invitations/:token
 * Get invitation details by token (for accept page)
 */
router.get('/staff-invitations/:token', invitationController.getInvitationByToken);

/**
 * POST /staff-invitations/:token/accept
 * Accept invitation and create user account
 */
router.post('/staff-invitations/:token/accept', invitationController.acceptInvitation);

/**
 * POST /staff-invitations/:token/decline
 * Decline invitation (token-based, no authentication required)
 */
router.post('/staff-invitations/:token/decline', invitationController.declineInvitation);

/**
 * Protected routes (authentication + hotel ownership required)
 * Mounted at: /api/hotels/:hotelId/staff-invitations
 */

/**
 * POST /
 * Create and send staff invitation
 */
router.post(
  '/',
  authenticateToken,
  requireHotelOwner,
  invitationController.createInvitation
);

/**
 * GET /
 * Get pending invitations for a hotel
 */
router.get(
  '/',
  authenticateToken,
  requireHotelOwner,
  invitationController.getPendingInvitations
);

/**
 * POST /:invitationId/resend
 * Resend invitation email
 */
router.post(
  '/:invitationId/resend',
  authenticateToken,
  requireHotelOwner,
  invitationController.resendInvitation
);

/**
 * DELETE /:invitationId
 * Cancel invitation (owner-cancelled)
 */
router.delete(
  '/:invitationId',
  authenticateToken,
  requireHotelOwner,
  invitationController.cancelInvitation
);

export default router;
