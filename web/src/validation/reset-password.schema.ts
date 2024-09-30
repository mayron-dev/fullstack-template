import { z } from 'zod';
import { passwordSchema } from './password.schema';

export const resetPassword = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'As senhas devem ser iguais',
    });
  }
});

export type ResetPassword = z.infer<typeof resetPassword>;