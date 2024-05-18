import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags } from '@nestjs/swagger';
import { EmailSendReqDto } from './dto/req.dto';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post('send')
  async send(@Body() { email }: EmailSendReqDto): Promise<void> {
    this.emailService.send(email);
  }

  @Public()
  @Post('verify')
  async verify(@Body() email: string, code: string) {
    const verified = this.emailService.verifyAuthCode(email, code);
  }
}
