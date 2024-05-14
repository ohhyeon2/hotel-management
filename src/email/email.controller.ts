import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags } from '@nestjs/swagger';
import { EmailReqDto } from './dto/req.dto';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post()
  async send(@Body() { email }: EmailReqDto) {
    this.emailService.send(email);
  }
}