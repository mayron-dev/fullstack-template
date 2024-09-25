import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Email isn't valid"),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at most 32 characters long'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(32, 'Username must be at most 32 characters long'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
