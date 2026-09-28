import { z } from 'zod';
import { RegisterSchema, passwordSchema } from '@hotelsonweb/shared';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const SignupFormSchema = z
  .object({
    firstName: RegisterSchema.shape.firstName,
    lastName: RegisterSchema.shape.lastName,
    email: RegisterSchema.shape.email,
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .refine(
        (val) => {
          try {
            return isValidPhoneNumber(val);
          } catch {
            return false;
          }
        },
        {
          message:
            'Please enter a valid international phone number (e.g. +977 9800000000)',
        }
      ),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['customer', 'owner']).default('customer'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['confirmPassword'],
      });
    }
  });

export type SignupFormValues = z.input<typeof SignupFormSchema>;
export type SignupFormOutput = z.output<typeof SignupFormSchema>;
