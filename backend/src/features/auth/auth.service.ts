import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthRepository } from './auth.repository';
import { HttpError } from '@/common/http-error';
import User from '@/models/User';

/**
 * Auth service for authentication and token management
 */
export class AuthService {
  private authRepository: AuthRepository;
  private jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  private jwtExpiry = process.env.JWT_EXPIRY || '1h';
  private refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

  constructor() {
    this.authRepository = new AuthRepository();
  }

  /**
   * Generate JWT token
   */
  generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
      },
      this.jwtSecret as string,
      { expiresIn: this.jwtExpiry } as any
    );
  }

  /**
   * Generate refresh token
   */
  async generateRefreshToken(userId: number): Promise<string> {
    const token = jwt.sign({ userId }, this.jwtSecret as string, {
      expiresIn: this.refreshTokenExpiry,
    } as any);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Hash the token before storing for security
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await this.authRepository.create({
      userId,
      tokenHash,
      expiresAt,
    });

    return token;
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(token: string): Promise<{ userId: number }> {
    try {
      // Hash the token to match stored hash
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const refreshToken = await this.authRepository.findByTokenHash(tokenHash);

      if (!refreshToken) {
        throw HttpError.unauthorized('Invalid refresh token');
      }

      if (new Date() > refreshToken.expiresAt) {
        throw HttpError.unauthorized('Refresh token expired');
      }

      const decoded = jwt.verify(token, this.jwtSecret) as { userId: number };
      return decoded;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw HttpError.unauthorized('Invalid refresh token');
    }
  }

  /**
   * Revoke refresh token (logout)
   */
  async revokeRefreshToken(token: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const refreshToken = await this.authRepository.findByTokenHash(tokenHash);
    if (refreshToken) {
      await this.authRepository.delete(refreshToken.id);
    }
  }

  /**
   * Revoke all user tokens (logout from all devices)
   */
  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.authRepository.deleteUserTokens(userId);
  }

  /**
   * Clean up expired tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    return this.authRepository.deleteExpired();
  }
}
