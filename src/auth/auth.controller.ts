import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninReqDto } from './dto/req.dto';
import { RefreshTokenResDto, SigninResDto } from './dto/res.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { UserAfterAuth } from 'src/common/decorator/user.decorator';
import { User } from 'src/common/decorator/user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
