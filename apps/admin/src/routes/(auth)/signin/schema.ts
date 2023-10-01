import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Email isn't valid."),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(40, 'Password must be at most 40 characters.'),
});

export type LoginSchema = typeof loginSchema;
