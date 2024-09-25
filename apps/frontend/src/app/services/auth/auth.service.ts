import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterSchema } from '@fullstack-template/schemas';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post('/api/auth/login', { email, password });
  }

  register(body: RegisterSchema) {
    return this.http.post('/api/auth/register', body);
  }
}
