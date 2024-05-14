import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'dhgus1235@gmail.com',
      subject: 'hotel-management 회원가입 코드입니다.',
      text: '회원가입 코드입니다.',
      html: `<br>회원가입 인증 코드입니다.<br>${code}</br>`,
    });
  }
}