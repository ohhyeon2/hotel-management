import { ConfigService } from '@nestjs/config';
import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptService {
  private readonly algorithm: string;
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor(
    private configService: ConfigService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    this.algorithm = this.configService.get('encryption.algorithm');

    const key = this.configService.get('encryption.key');
    const iv = this.configService.get('encryption.iv');

    this.validateEncryption(this.algorithm, key, iv)

    this.key = Buffer.from(key, 'hex');
    this.iv = Buffer.from(iv, 'hex');
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

  private validateEncryption(algorithm: string, key: string, iv: string) {
    if (!algorithm) {
      const error = new NotFoundException('encryption algorithm undefined');
      this.logger.log(error.message, error.stack)
      throw error;
    }
    if (!key) {
      const error = new NotFoundException('encryption key undefined');
      this.logger.log(error.message, error.stack)
      throw error;
    }
    if (!iv) {
      const error = new NotFoundException('encryption iv undefined');
      this.logger.log(error.message, error.stack)
      throw error;
    }
  }
}
