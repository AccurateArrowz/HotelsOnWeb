import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { ApiResponseHandler, asyncHandler, AuthenticatedRequest } from '@/common';
import { HttpError } from '@/common/http-error';
import { LoginInput, RegisterInput } from '@hotelsonweb/shared';
import User from '@/features/auth/models/User';

/**
 * Auth controller for authentication endpoints
 */
const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';
const REFRESH_TOKEN_COOKIE_SAME_SITE = (process.env.REFRESH_TOKEN_COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none';
const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, matches auth.service refresh token expiry

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: REFRESH_TOKEN_COOKIE_SAME_SITE,
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
      path: '/',
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: REFRESH_TOKEN_COOKIE_SAME_SITE,
      path: '/',
    });
  }

  /**
   * Register new user
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone, role } = req.body as RegisterInput;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw HttpError.conflict('Email already registered');
    }

    // Map role string to roleId (customer=1, admin=2, owner=3)
    const roleMap: Record<string, number> = {
      'customer': 1,
      'owner': 3,
    };
    const roleId = roleMap[role || 'customer'] || 1;

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      roleId,
    });

    // Generate tokens
    const accessToken = this.authService.generateToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user.id);
    this.setRefreshTokenCookie(res, refreshToken);

    return ApiResponseHandler.created(res, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: role || 'customer',
      },
      accessToken,
    });
  });

  /**
   * Login user
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginInput;

    // Find user with role
    const user = await User.findOne({ 
      where: { email },
      include: [{ association: 'role' }],
    });
    if (!user) {
      throw HttpError.unauthorized('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw HttpError.unauthorized('Invalid credentials');
    }

    // Generate tokens
    const accessToken = this.authService.generateToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user.id);
    this.setRefreshTokenCookie(res, refreshToken);

    return ApiResponseHandler.success(res, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role?.name || 'customer',
      },
      accessToken,
    });
  });

  /**
   * Refresh access token
   */
  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] || req.body?.refreshToken;

    if (!refreshToken) {
      throw HttpError.badRequest('Refresh token required');
    }

    // Verify refresh token
    const decoded = await this.authService.verifyRefreshToken(refreshToken);

    // Get user
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw HttpError.unauthorized('User not found');
    }

    // Generate new access token
    const newAccessToken = this.authService.generateToken(user);

    return ApiResponseHandler.success(res, {
      accessToken: newAccessToken,
    });
  });

  /**
   * Logout user
   */
  logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] || req.body?.refreshToken;

    if (refreshToken) {
      await this.authService.revokeRefreshToken(refreshToken);
    }

    this.clearRefreshTokenCookie(res);

    return ApiResponseHandler.success(res, null, 'Logged out successfully');
  });

  /**
   * Logout from all devices
   */
  logoutAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    await this.authService.revokeAllUserTokens(req.userId);

    return ApiResponseHandler.success(res, null, 'Logged out from all devices');
  });

  /**
   * Get current user profile
   */
  getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const user = await User.findByPk(req.userId, {
      include: [{ association: 'role' }],
    });

    if (!user) {
      throw HttpError.notFound('User not found');
    }

    return ApiResponseHandler.success(res, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role?.name || 'customer',
    });
  });
}
