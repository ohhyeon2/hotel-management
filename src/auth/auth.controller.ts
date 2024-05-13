import { BadRequestException, Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninReqDto } from './dto/req.dto';
import { RefreshTokenResDto, SigninResDto } from './dto/res.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({type: SigninResDto})
  @Post('signin')
  async signin(@Body() {email, password}: SigninReqDto): Promise<SigninResDto> {
    return this.authService.signin(email, password)
  }

  @ApiCreatedResponse({type: RefreshTokenResDto})
  @Post('refresh')
  async refresh(@Headers('authorization') authorization, user: User): Promise<RefreshTokenResDto> {
    const token = /Bearer\/s(.+)/.exec(authorization)[1];
    const { accessToken, refreshToken } = await this.authService.refresh(token, user.id)
    return { accessToken, refreshToken }
  }
}
