import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ZodSchema } from 'zod';

export function zodValidator(schema: ZodSchema): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = schema.safeParse(control.value); // Valida usando Zod
    console.log('validate');

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message; // Mapeia o erro para o campo correspondente
      });
      return errors;
    }
    return null; // Se não houver erros, retorna null
  };
}
