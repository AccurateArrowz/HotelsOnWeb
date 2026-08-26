import { z } from 'zod';

/**
 * Create invitation request schema
 * Used by hotel owners to invite staff
 */
export const CreateInvitationSchema = z.object({
  invitedEmail: z.string().email('Invalid email format'),
  roleId: z.number().int().positive('Role ID must be a positive integer'),
});

/**
 * Accept invitation request schema
 * Used by invited staff to accept and create their account
 */
export const AcceptInvitationSchema = z.object({
  token: z.string().min(1, 'Invitation token is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>;
export type AcceptInvitationInput = z.infer<typeof AcceptInvitationSchema>;
