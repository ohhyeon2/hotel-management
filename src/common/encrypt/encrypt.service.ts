import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptService {
  private readonly algorithm: string;
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor(private configService: ConfigService) {
    this.algorithm = this.configService.get('encryption.algorithm');
    this.key = Buffer.from(
      this.configService.get<string>('encryption.key'),
      'hex',
    );
    this.iv = Buffer.from(
      this.configService.get<string>('encryption.iv'),
      'hex',
    );
  }

  encrypt(code: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(code, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted + ' ' + this.iv.toString('hex');
  }

  decrypt(code: string): string {
    const [encrypted, ivHex] = code.split(' ');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
