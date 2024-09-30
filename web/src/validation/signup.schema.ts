import { z } from 'zod';
import { passwordSchema } from './password.schema';
export const signupSchema = z.object({
  email: z.string().email("Email invalido"),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(50, 'Nome deve ter no máximo 50 caracteres'),
  password: passwordSchema,
});

export type SignupSchema = z.infer<typeof signupSchema>;