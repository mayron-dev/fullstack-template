import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { EmailService } from '../email/email.service';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { User } from '@prisma/client';
import { env } from '../../env';
import { RegisterSchema } from '@fullstack-template/schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly mailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.txHost.tx.user.findUnique({ where: { email } });
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register({ email, firstName, lastName, password, username}: RegisterSchema) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.txHost.tx.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      },
    });
    return user;
  }
  async sendMagicLink(email: string) {
    const token = this.jwtService.sign({ email });
    const link = `${env.CLIENT_URL}/auth/magic-link?token=${token}`;
    await this.mailService.sendEmail(email, 'Magic Link', `Click here to login: ${link}`);
    return { message: 'Magic link sent' };
  }

  async verifyMagicLink(token: string) {
    const { email } = this.jwtService.verify(token);
    return this.txHost.tx.user.findUnique({ where: { email } });
  }
}
