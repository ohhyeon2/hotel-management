import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(email: string) {
    const code = this.generateRandomString(6);
    await this.mailerService.sendMail({
      to: email,
      from: 'dhgus1235@gmail.com',
      subject: 'hotel-management 회원가입 코드입니다.',
      text: '회원가입 코드입니다.',
      html: `<br>회원가입 인증 코드입니다.<br>${code}</br>`,
    });
  }

  private generateRandomString(length: number): string {
    const randomBytes = crypto.randomBytes(length).toString('base64').slice(0, length)
    return randomBytes;
  }
}