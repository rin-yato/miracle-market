import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(40, 'Password must be at most 40 characters.'),
});

export type SignupSchema = typeof signupSchema;
