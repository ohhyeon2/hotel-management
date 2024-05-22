import { Logger, Module } from '@nestjs/common';
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
  providers: [Logger],
})
export class EmailModule {}
