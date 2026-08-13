import crypto from 'crypto';
import { InvitationRepository } from './invitation.repository';
import { HttpError } from '@/common/http-error';
import { EmailService } from '@/services/email.service';
import User from '@/features/auth/models/User';
import Hotel from '@/features/hotel/models/Hotel';
import Role from '@/features/rbac/models/Role';
import HotelStaff from '@/features/hotel/models/HotelStaff';
import Invitation from './models/Invitation';
import type { Invitation as InvitationType, InvitationDetails } from '@hotelsonweb/shared';

/**
 * Invitation service for staff invitation operations
 */
export class InvitationService {
  private invitationRepository: InvitationRepository;

  constructor() {
    this.invitationRepository = new InvitationRepository();
  }

  /**
   * Create and send an invitation
   */
  async createAndSendInvitation(
    hotelId: number,
    invitedEmail: string,
    roleId: number,
    invitedByUserId: number
  ): Promise<InvitationType> {
    // Verify hotel exists
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      throw HttpError.notFound('Hotel not found');
    }

    // Verify role exists
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw HttpError.notFound('Role not found');
    }

    // Verify inviter exists
    const inviter = await User.findByPk(invitedByUserId);
    if (!inviter) {
      throw HttpError.notFound('Inviter not found');
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ where: { email: invitedEmail } });
    if (existingUser) {
      throw HttpError.conflict('User with this email already exists');
    }

    // Check for duplicate pending invitation
    const hasPending = await this.invitationRepository.hasPendingInvitation(hotelId, invitedEmail);
    if (hasPending) {
      throw HttpError.conflict('A pending invitation already exists for this email');
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7); // 7 days

    // Create invitation
    const invitation = await this.invitationRepository.create({
      hotelId,
      invitedEmail,
      invitedBy: invitedByUserId,
      roleId,
      token,
      tokenExpiresAt,
      status: 'pending',
    });

    // Send invitation email
    const acceptLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invite?token=${token}`;
    const emailResult = await EmailService.sendInvitationEmail(
      invitedEmail,
      hotel.name,
      `${inviter.firstName} ${inviter.lastName}`,
      role.description || role.name,
      acceptLink
    );

    if (!emailResult.success) {
      // Delete invitation if email fails
      await this.invitationRepository.delete(invitation.id);
      throw HttpError.internalServerError(`Failed to send invitation email: ${emailResult.error}`);
    }

    return this.formatInvitationResponse(invitation);
  }

  /**
   * Get pending invitations for a hotel
   */
  async getPendingInvitations(
    hotelId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ data: InvitationType[]; pagination: { total: number; page: number; limit: number; pages: number } }> {
    const { rows, count } = await this.invitationRepository.findByHotelWithPagination(
      hotelId,
      limit,
      offset,
      'pending'
    );

    const page = Math.floor(offset / limit) + 1;

    return {
      data: rows.map((inv) => this.formatInvitationResponse(inv)),
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Accept invitation and create user account
   */
  async acceptInvitation(
    token: string,
    firstName: string,
    lastName: string,
    password: string,
    phone?: string
  ) {
    // Find and validate invitation
    const invitation = await this.invitationRepository.findByToken(token);
    if (!invitation) {
      throw HttpError.notFound('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw HttpError.conflict(`Invitation has already been ${invitation.status}`);
    }

    if (new Date() > invitation.tokenExpiresAt) {
      await this.invitationRepository.markAsExpired(invitation.id);
      throw HttpError.unprocessableEntity('Invitation has expired');
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ where: { email: invitation.invitedEmail } });
    if (existingUser) {
      throw HttpError.conflict('User with this email already exists');
    }

    // Create user account
    const user = await User.create({
      email: invitation.invitedEmail,
      password,
      firstName,
      lastName,
      phone: phone || null,
      roleId: null, // Staff don't have a global role, only hotel-specific roles
    });

    // Create hotel staff record
    await HotelStaff.create({
      userId: user.id,
      hotelId: invitation.hotelId,
      roleId: invitation.roleId,
      invitedBy: invitation.invitedBy,
      status: 'active',
    });

    // Mark invitation as accepted
    await this.invitationRepository.markAsAccepted(invitation.id, user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: 'Invitation accepted successfully',
    };
  }

  /**
   * Resend invitation email
   */
  async resendInvitation(invitationId: number) {
    const invitation = await this.invitationRepository.findById(invitationId, {
      include: [
        { association: 'hotel' },
        { association: 'inviter' },
        { association: 'role' },
      ],
    });

    if (!invitation) {
      throw HttpError.notFound('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw HttpError.conflict('Only pending invitations can be resent');
    }

    if (new Date() > invitation.tokenExpiresAt) {
      throw HttpError.unprocessableEntity('Invitation has expired');
    }

    // Resend email
    const acceptLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invite?token=${invitation.token}`;
    const emailResult = await EmailService.sendInvitationEmail(
      invitation.invitedEmail,
      invitation.hotel!.name,
      `${invitation.inviter!.firstName} ${invitation.inviter!.lastName}`,
      invitation.role!.description || invitation.role!.name,
      acceptLink
    );

    if (!emailResult.success) {
      throw HttpError.internalServerError(`Failed to resend invitation email: ${emailResult.error}`);
    }

    return invitation;
  }

  /**
   * Cancel invitation (owner-cancelled)
   */
  async cancelInvitation(invitationId: number, cancelledByUserId: number) {
    const invitation = await this.invitationRepository.findById(invitationId);
    if (!invitation) {
      throw HttpError.notFound('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw HttpError.conflict('Only pending invitations can be cancelled');
    }

    await this.invitationRepository.markAsCancelled(invitationId, cancelledByUserId);
  }

  /**
   * Decline invitation (invitee-declined, token-based)
   */
  async declineInvitation(token: string) {
    const invitation = await this.invitationRepository.findByToken(token);
    if (!invitation) {
      throw HttpError.notFound('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw HttpError.conflict(`Invitation has already been ${invitation.status}`);
    }

    if (new Date() > invitation.tokenExpiresAt) {
      await this.invitationRepository.markAsExpired(invitation.id);
      throw HttpError.unprocessableEntity('Invitation has expired');
    }

    await this.invitationRepository.markAsDeclined(invitation.id);
  }

  /**
   * Get invitation details by token (public endpoint for accept page)
   */
  async getInvitationByToken(token: string): Promise<InvitationDetails> {
    const invitation = await this.invitationRepository.findByToken(token);
    if (!invitation) {
      throw HttpError.notFound('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw HttpError.conflict(`Invitation has already been ${invitation.status}`);
    }

    if (new Date() > invitation.tokenExpiresAt) {
      await this.invitationRepository.markAsExpired(invitation.id);
      throw HttpError.unprocessableEntity('Invitation has expired');
    }

    return {
      email: invitation.invitedEmail,
      hotelName: invitation.hotel?.name || '',
      roleName: invitation.role?.description || invitation.role?.name || '',
      inviterName: invitation.inviter ? `${invitation.inviter.firstName} ${invitation.inviter.lastName}` : 'Unknown',
    };
  }

  /**
   * Format invitation response - converts ORM instance to shared type
   */
  private formatInvitationResponse(invitation: Invitation): InvitationType {
    const invJson = invitation.toJSON() as any;
    return {
      id: invJson.id,
      hotelId: invJson.hotelId,
      invitedEmail: invJson.invitedEmail,
      invitedBy: invJson.invitedBy,
      roleId: invJson.roleId,
      token: invJson.token,
      tokenExpiresAt: invJson.tokenExpiresAt,
      status: invJson.status,
      acceptedAt: invJson.acceptedAt,
      acceptedByUserId: invJson.acceptedByUserId,
      cancelledAt: invJson.cancelledAt,
      cancelledBy: invJson.cancelledBy,
      createdAt: invJson.createdAt,
      updatedAt: invJson.updatedAt,
      hotel: invJson.hotel,
      inviter: invJson.inviter,
      role: invJson.role,
      acceptedBy: invJson.acceptedBy,
      cancelledByUser: invJson.cancelledByUser,
    };
  }
}
