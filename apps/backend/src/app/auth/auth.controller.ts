import { Controller, Post, UseGuards, Request, Get, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ZodPipe } from '../pipes/zod-pipe';
import { registerSchema } from "@fullstack-template/schemas";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login com email/senha
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body(new ZodPipe(registerSchema)) body) {
    return this.authService.register(body);
  }

  // Login com Google
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  googleLoginRedirect(@Request() req) {
    console.log(req.user);
    return this.authService.login(req.user);
  }

  // Login com Magic Link
  @Post('send-magic-link')
  async sendMagicLink(@Body('email') email: string) {
    return this.authService.sendMagicLink(email);
  }

  @Get('verify-magic-link')
  async verifyMagicLink(@Query('token') token: string) {
    return this.authService.verifyMagicLink(token);
  }
}
