import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags } from '@nestjs/swagger';
import { EmailReqDto } from './dto/req.dto';
import { Public } from 'src/common/decorator/public.decorator';
import * as crypto from 'crypto';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post()
  async send(@Body() { email }: EmailReqDto) {
    const code = this.generateRandomString(6);
    this.emailService.send(email, code);
  }

  private generateRandomString(length: number): string {
    const randomBytes = crypto.randomBytes(length).toString('base64').slice(0, length)
    return randomBytes;
  }
}
