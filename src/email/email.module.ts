import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

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
  providers: [EmailService, RedisService],
})
export class EmailModule {}
