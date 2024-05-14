import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          prot: 587,
          auth: {
            user: configService.get('email.user'),
            pass: configService.get('email.pass')
          }
        }
      })
    })
  ],
  providers: [EmailService],
  controllers: [EmailController]
})
export class EmailModule {}
