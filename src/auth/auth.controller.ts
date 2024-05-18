import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { RefreshTokenResDto, SigninResDto, SignupResDto } from './dto/res.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { UserAfterAuth } from 'src/common/decorator/user.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { UserService } from 'src/user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse()
  @Public()
  @Post('signup')
  async signup(@Body() signupReqDto: SignupReqDto): Promise<SignupResDto> {
    const { id, accessToken, refreshToken } = await this.authService.signup(signupReqDto);
    return { id, accessToken, refreshToken }
  }

  @ApiCreatedResponse({type: SigninResDto})
  @Public()
  @Post('signin')
  async signin(@Body() {email, password}: SigninReqDto): Promise<SigninResDto> {
    return this.authService.signin(email, password)
  }

  @ApiCreatedResponse({type: RefreshTokenResDto})
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(@Headers('authorization') authorization, @User() user: UserAfterAuth): Promise<RefreshTokenResDto> {
    const token = /Bearer\s(.+)/.exec(authorization)[1];
    const { accessToken, refreshToken } = await this.authService.refresh(token, user.id)
    return { accessToken, refreshToken }
  }
}
