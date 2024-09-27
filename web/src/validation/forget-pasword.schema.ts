import { z } from 'zod';
export const forgetPassword = z.object({
  email: z.string().email("Email invalido"),
});

export type ForgetPassword = z.infer<typeof forgetPassword>;