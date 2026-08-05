import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateToken } from '@/middleware/auth.middleware';
import { validateBody } from '@/middleware/validate.middleware';
import { LoginSchema, RegisterSchema } from '@hotelsonweb/shared';

const router = Router();
const authController = new AuthController();

router.post('/register', validateBody(RegisterSchema), authController.register);

router.post('/login', validateBody(LoginSchema), authController.login);

router.post('/refresh', authController.refresh);

router.post('/logout', authenticateToken, authController.logout);

router.post('/logout-all', authenticateToken, authController.logoutAll);

router.get('/profile', authenticateToken, authController.getProfile);

export default router;