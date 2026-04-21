import { z } from 'zod';
import { LoginSchema, RegisterSchema } from '@hotelsonweb/shared';

export const loginSchema = z.object({
  body: LoginSchema,
});

export const registerSchema = z.object({
  body: RegisterSchema,
});
