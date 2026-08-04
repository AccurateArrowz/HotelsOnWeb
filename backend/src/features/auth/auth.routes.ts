import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateToken } from '@/middleware/auth.middleware';
import { validateBody } from '@/middleware/validate.middleware';
import { loginSchema, registerSchema } from '@hotelsonweb/shared';

const router = Router();
const authController = new AuthController();

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', validateBody(registerSchema), authController.register);

/**
 * POST /auth/login
 * Login user
 */
router.post('/login', validateBody(loginSchema), authController.login);

/**
 * POST /auth/refresh
 * Refresh access token
 */
router.post('/refresh', authController.refresh);

/**
 * POST /auth/logout
 * Logout user
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * POST /auth/logout-all
 * Logout from all devices
 */
router.post('/logout-all', authenticateToken, authController.logoutAll);

/**
 * GET /auth/profile
 * Get current user profile
 */
router.get('/profile', authenticateToken, authController.getProfile);

export default router;
