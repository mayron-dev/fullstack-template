import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { env } from '../../../env';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {
    super({
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const { name, emails, id } = profile;
    // find by google id
    const user = await this.txHost.tx.user.findFirst({
      include: { providers: true },
      where: { providers: { some: { providerId: id, type: 'GOOGLE' } } },
    })

    if (!user) {
      // create new user
      const newUser = await this.txHost.tx.user.create({
        data: {
          email: emails[0].value,
          firstName: name.givenName,
          lastName: name.familyName,
          providers: { create: { type: 'GOOGLE', providerId: id } },
        }
      })
      done(null, newUser)
    }
    done(null, user);
  }
}
