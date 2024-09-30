import { z } from 'zod';

export const signinSchema = z.object({
  account: z.string(),
  password: z.string()
});

export type SigninSchema = z.infer<typeof signinSchema>;