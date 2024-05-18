import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = crypto.randomBytes(32);
  private readonly iv = crypto.randomBytes(16);

  encrypt(code: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(code, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted + ' ' + this.iv.toString('hex');
  }

  decrypt(code: string): string {
    const [encrypted, iv] = code.split(' ');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex'),
    );
    let decrypted = decipher.update(encrypted, 'hex', 'hex');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
