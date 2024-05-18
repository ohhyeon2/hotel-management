import { RedisService } from './../redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { CryptoService } from 'src/common/encrypt/crypto.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
    private readonly cryptoService: CryptoService,
  ) {}

  async send(email: string) {
    const code = this.generateRandomString(6);

    await this.mailerService.sendMail({
      to: email,
      from: 'nestjs@gmail.com',
      subject: 'hotel-management 회원가입 코드입니다.',
      text: '회원가입 코드입니다.',
      html: `<br>회원가입 인증 코드입니다.<br>${code}</br>`,
    });

    const encryptCode = this.cryptoService.encrypt(code);
    this.redisService.set(email, encryptCode, 180);
  }

  async verifyAuthCode(email: string, code: string) {
    const encryptCode = await this.redisService.get(email);
    const decryptCode = this.cryptoService.decrypt(encryptCode);

    if (code != decryptCode) {
      throw new UnauthorizedException('인증 번호가 맞지 않습니다.');
    }

    await this.redisService.del(email);

    return true;
  }

  private generateRandomString(length: number): string {
    const randomBytes = crypto
      .randomBytes(length)
      .toString('base64')
      .slice(0, length);
    return randomBytes;
  }
}
