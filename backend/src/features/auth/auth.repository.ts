import { BaseRepository } from '@/common/base.repository';
import RefreshToken from '@/models/RefreshToken';

/**
 * Auth repository for refresh token operations
 */
export class AuthRepository extends BaseRepository<RefreshToken> {
  constructor() {
    super(RefreshToken);
  }

  /**
   * Find refresh token by token hash
   */
  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.findOne({
      where: { tokenHash },
      include: [{ association: 'user' }],
    });
  }

  /**
   * Find all tokens for a user
   */
  async findByUserId(userId: number): Promise<RefreshToken[]> {
    return this.findAll({
      where: { userId },
    });
  }

  /**
   * Delete expired tokens
   */
  async deleteExpired(): Promise<number> {
    return this.deleteWhere({
      expiresAt: {
        [require('sequelize').Op.lt]: new Date(),
      },
    });
  }

  /**
   * Delete all tokens for a user (logout)
   */
  async deleteUserTokens(userId: number): Promise<number> {
    return this.deleteWhere({ userId });
  }
}
