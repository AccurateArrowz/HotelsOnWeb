import { Request, Response } from 'express';
import { InvitationService } from './invitation.service';
import { ApiResponseHandler, asyncHandler, AuthenticatedRequest } from '@/common';
import { HttpError } from '@/common/http-error';
import { CreateInvitationSchema, AcceptInvitationSchema } from '@hotelsonweb/shared';

/**
 * Invitation controller for staff invitation endpoints
 */
export class InvitationController {
  private invitationService: InvitationService;

  constructor() {
    this.invitationService = new InvitationService();
  }

  /**
   * POST /hotels/:hotelId/staff-invitations
   * Create and send staff invitation (owner only)
   */
  createInvitation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const { invitedEmail, roleId } = req.body as any;
    const hotelId = parseInt(req.params.hotelId as string);

    // Validate input
    const validation = CreateInvitationSchema.safeParse({ invitedEmail, roleId });
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return ApiResponseHandler.validationError(res, 'Validation failed', errors);
    }

    const invitation = await this.invitationService.createAndSendInvitation(
      hotelId,
      invitedEmail,
      roleId,
      req.userId
    );

    return ApiResponseHandler.created(res, {
      id: invitation.id,
      email: invitation.invitedEmail,
      role: invitation.roleId,
      status: invitation.status,
      createdAt: invitation.createdAt,
    });
  });

  /**
   * GET /hotels/:hotelId/staff-invitations
   * Get pending invitations for a hotel (owner only)
   */
  getPendingInvitations = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const hotelId = parseInt(req.params.hotelId as string);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const result = await this.invitationService.getPendingInvitations(hotelId, limit, offset);

    return ApiResponseHandler.successWithPagination(
      res,
      result.data.map((inv) => ({
        id: inv.id,
        email: inv.invitedEmail,
        role: inv.roleId,
        status: inv.status,
        createdAt: inv.createdAt,
      })),
      'Staff invitations retrieved successfully',
      result.pagination
    );
  });

  /**
   * POST /staff-invitations/:token/accept
   * Accept invitation and create user account (public endpoint)
   */
  acceptInvitation = asyncHandler(async (req: Request, res: Response) => {
    const token = req.params.token as string;
    const { firstName, lastName, password, phone } = req.body as any;

    // Validate input
    const validation = AcceptInvitationSchema.safeParse({
      token,
      firstName,
      lastName,
      password,
      phone,
    });
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return ApiResponseHandler.validationError(res, 'Validation failed', errors);
    }

    const result = await this.invitationService.acceptInvitation(
      token,
      firstName,
      lastName,
      password,
      phone
    );

    return ApiResponseHandler.success(res, result, 'Invitation accepted successfully', 201);
  });

  /**
   * POST /staff-invitations/:token/decline
   * Decline invitation (public endpoint, token-based)
   */
  declineInvitation = asyncHandler(async (req: Request, res: Response) => {
    const token = req.params.token as string;

    if (!token) {
      throw HttpError.badRequest('Invitation token is required');
    }

    await this.invitationService.declineInvitation(token);

    return ApiResponseHandler.success(res, null, 'Invitation declined successfully');
  });

  /**
   * GET /staff-invitations/:token
   * Get invitation details by token (public endpoint for accept page)
   */
  getInvitationByToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.params.token as string;

    if (!token) {
      throw HttpError.badRequest('Invitation token is required');
    }

    const invitation = await this.invitationService.getInvitationByToken(token);

    return ApiResponseHandler.success(res, invitation);
  });

  /**
   * POST /hotels/:hotelId/staff-invitations/:invitationId/resend
   * Resend invitation email (owner only)
   */
  resendInvitation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const invitationId = parseInt(req.params.invitationId as string);

    if (!Number.isInteger(invitationId)) {
      throw HttpError.badRequest('Invitation ID must be a numeric value');
    }

    await this.invitationService.resendInvitation(invitationId);

    return ApiResponseHandler.success(res, null, 'Staff invitation resent successfully');
  });

  /**
   * DELETE /hotels/:hotelId/staff-invitations/:invitationId
   * Cancel invitation (owner only, owner-cancelled)
   */
  cancelInvitation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const invitationId = parseInt(req.params.invitationId as string);

    if (!Number.isInteger(invitationId)) {
      throw HttpError.badRequest('Invitation ID must be a numeric value');
    }

    await this.invitationService.cancelInvitation(invitationId, req.userId);

    return ApiResponseHandler.success(res, null, 'Staff invitation cancelled successfully');
  });
}
