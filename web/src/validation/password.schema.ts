import { z } from "zod";

export const passwordSchema = z.string()
  .min(6, "Senha deve ter pelo menos 6 caracteres")
  .max(50, "Senha não pode ter mais de 50 caracteres");