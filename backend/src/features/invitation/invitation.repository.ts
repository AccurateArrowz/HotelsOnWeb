import { BaseRepository } from '@/common/base.repository';
import Invitation from '@/features/invitation/models/Invitation';
import { Op } from 'sequelize';

/**
 * Invitation repository for invitation operations
 */
export class InvitationRepository extends BaseRepository<Invitation> {
  constructor() {
    super(Invitation);
  }

  /**
   * Find invitation by token
   */
  async findByToken(token: string): Promise<Invitation | null> {
    return this.findOne({
      where: { token },
      include: [
        { association: 'hotel' },
        { association: 'inviter' },
        { association: 'role' },
      ],
    });
  }

  /**
   * Find pending invitations for a hotel
   */
  async findPendingByHotel(hotelId: number): Promise<Invitation[]> {
    return this.findAll({
      where: {
        hotelId,
        status: 'pending',
        tokenExpiresAt: { [Op.gt]: new Date() },
      },
      include: [
        { association: 'inviter' },
        { association: 'role' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find invitation by hotel, email, and status
   */
  async findByHotelAndEmail(
    hotelId: number,
    email: string,
    status: string = 'pending'
  ): Promise<Invitation | null> {
    return this.findOne({
      where: {
        hotelId,
        invitedEmail: email,
        status,
      },
    });
  }

  /**
   * Check if invitation exists and is still valid
   */
  async isValidInvitation(token: string): Promise<boolean> {
    const invitation = await this.findByToken(token);
    if (!invitation) return false;
    if (invitation.status !== 'pending') return false;
    if (new Date() > invitation.tokenExpiresAt) return false;
    return true;
  }

  /**
   * Mark invitation as accepted
   */
  async markAsAccepted(invitationId: number, userId: number): Promise<Invitation | null> {
    await this.update(invitationId, {
      status: 'accepted',
      acceptedAt: new Date(),
      acceptedByUserId: userId,
    });
    return this.findById(invitationId);
  }

  /**
   * Mark invitation as expired
   */
  async markAsExpired(invitationId: number): Promise<void> {
    await this.update(invitationId, { status: 'expired' });
  }

  /**
   * Mark invitation as cancelled by owner
   */
  async markAsCancelled(invitationId: number, cancelledByUserId: number): Promise<void> {
    await this.update(invitationId, {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelledBy: cancelledByUserId,
    });
  }

  /**
   * Mark invitation as declined by invitee
   */
  async markAsDeclined(invitationId: number): Promise<void> {
    await this.update(invitationId, {
      status: 'declined',
      cancelledAt: new Date(),
    });
  }

  /**
   * Find all invitations for a hotel with pagination
   */
  async findByHotelWithPagination(
    hotelId: number,
    limit: number = 20,
    offset: number = 0,
    status?: string
  ): Promise<{ rows: Invitation[]; count: number }> {
    const where: any = { hotelId };
    if (status) {
      where.status = status;
    }

    return this.findAndCount({
      where,
      include: [
        { association: 'inviter' },
        { association: 'role' },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find all invitations sent by a user
   */
  async findByInviter(inviterId: number): Promise<Invitation[]> {
    return this.findAll({
      where: { invitedBy: inviterId },
      include: [
        { association: 'hotel' },
        { association: 'role' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Check for duplicate pending invitation
   */
  async hasPendingInvitation(hotelId: number, email: string): Promise<boolean> {
    const count = await this.count({
      where: {
        hotelId,
        invitedEmail: email,
        status: 'pending',
        tokenExpiresAt: { [Op.gt]: new Date() },
      },
    });
    return count > 0;
  }
}
