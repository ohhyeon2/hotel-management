import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendEmailReqDto, SigninReqDto, SignupReqDto, VerifyCodeReqDto } from './dto/req.dto';
import { RefreshTokenResDto, SigninResDto, SignupResDto } from './dto/res.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { UserAfterAuth } from 'src/common/decorator/user.decorator';
import { User } from 'src/common/decorator/user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse()
  @Public()
  @Post('signup')
  async signup(@Body() signupReqDto: SignupReqDto): Promise<SignupResDto> {
    const { id, accessToken, refreshToken } = await this.authService.signup(signupReqDto);
    return { id, accessToken, refreshToken };
  }

  @ApiCreatedResponse({ type: SigninResDto })
  @Public()
  @Post('signin')
  async signin(@Body() { email, password }: SigninReqDto): Promise<SigninResDto> {
    return this.authService.signin(email, password);
  }

  @Public()
  @Post('verify-email/send')
  async send(@Body() { email }: SendEmailReqDto) {
    this.authService.sendVerificationCode(email);
  }

  @Public()
  @Post('verify-email/match')
  async verify(@Body() { email, code }: VerifyCodeReqDto) {
    this.authService.matchVerificationCode(email, code);
  }

  @ApiCreatedResponse({ type: RefreshTokenResDto })
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(@Headers('authorization') authorization, @User() user: UserAfterAuth): Promise<RefreshTokenResDto> {
    const token = /Bearer\s(.+)/.exec(authorization)[1];
    const { accessToken, refreshToken } = await this.authService.refresh(token, user.id);
    return { accessToken, refreshToken };
  }
}
