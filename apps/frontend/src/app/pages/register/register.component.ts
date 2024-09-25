import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { registerSchema } from '@fullstack-template/schemas';
import { ZodError } from 'zod';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, FloatLabelModule, CheckboxModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  errors: { [key: string]: string } = { };

  constructor(
    private readonly authService: AuthService,
    private fb: FormBuilder
  ) {
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      fisrtName: [''],
      lastName: [''],
      username: [''],
      email: [''],
      password: [''],
    });
    this.form.valueChanges.subscribe((formValue) => {
      this.validateForm(formValue); // Valida a cada mudança
    });
  }
  validateForm(value: unknown) {
    const result = registerSchema.safeParse(value);
    if (!result.success) {
      this.form.setErrors(this.formatErrors(result.error));
      this.errors = this.formatErrors(result.error); // Atualiza os erros
    } else {
      this.errors = {}; // Limpa os erros se válido
    }
  }

  // Função para formatar os erros do Zod
  private formatErrors(error: ZodError): { [key: string]: string } {
    const formattedErrors: { [key: string]: string } = {};
    for (const issue of error.issues) {
      formattedErrors[issue.path[0]] = issue.message;
    }
    return formattedErrors;
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log('Erros no formulário', this.form.errors);
    } else {
      console.log('Formulário válido', this.form.value);
    }
  }
}
