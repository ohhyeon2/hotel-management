import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { SigninResDto, SignupResDto } from './dto/res.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({type: SignupResDto})
  @Post('signup')
  async signup(@Body() {name, email, password, passwordCheck }: SignupReqDto): Promise<SignupResDto> {
    if (password !== passwordCheck) throw new BadRequestException();
    const { id } = await this.authService.signup(name, email, password)
    return { id }
  }

  @ApiCreatedResponse({type: SigninResDto})
  @Post('signin')
  async signin(@Body() {email, password}: SigninReqDto): Promise<SigninResDto> {
    return this.authService.signin(email, password)
  }
}
