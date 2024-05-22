import { Inject, Injectable, InternalServerErrorException, Logger, LoggerService } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async sendVerificationCode(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'nestjs@gmail.com',
        subject: 'hotel-management 회원가입 코드입니다.',
        text: '회원가입 코드입니다.',
        html: `<br>회원가입 인증 코드입니다.<br>${code}</br>`,
      });
      this.logger.log('이메일 전송 성공');
    } catch (error) {
      this.logger.error('이메일 전송 실패', error.stack);
      throw new InternalServerErrorException('이메일 전송 사용 불가');
    }
  }
}
