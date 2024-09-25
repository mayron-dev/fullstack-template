import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { env } from '../../env';

@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtp://${env.SMTP_USER}:${env.SMTP_PASSWORD}@${env.SMTP_HOST}`,
        defaults: {
          from: env.SMTP_FROM,
        },
        template: {
          dir: __dirname + "/templates",
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  exports: [EmailService],
})
export class EmailModule {}
