import { z } from 'zod';

/**
 * Login request schema
 */
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Register request schema
 */
export const RegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Refresh token request schema (empty body, optional)
 */
export const RefreshSchema = z.object({}).optional();

/**
 * Express request wrapper schemas for middleware validation
 */
export const loginSchema = z.object({
  body: LoginSchema,
});

export const registerSchema = z.object({
  body: RegisterSchema,
});

export const refreshSchema = z.object({
  body: RefreshSchema,
});

/**
 * Inferred types from schemas
 */
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type RefreshInput = z.infer<typeof RefreshSchema>;
