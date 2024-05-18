import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendVerificationCode(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'nestjs@gmail.com',
      subject: 'hotel-management 회원가입 코드입니다.',
      text: '회원가입 코드입니다.',
      html: `<br>회원가입 인증 코드입니다.<br>${code}</br>`,
    });
  }
}
