import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  })

  constructor(private authService: AuthService) {}
  onSubmit() {
    if (!this.loginForm.value.email || !this.loginForm.value.password) return;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(res => {
      console.log(res);
    });
  }
}
