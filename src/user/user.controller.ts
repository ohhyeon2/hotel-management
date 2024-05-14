import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { FindUserReqDto, SignupReqDto } from './dto/req.dto';
import { GetUserResDto, SignupResDto } from './dto/res.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('User')
@ApiExtraModels(FindUserReqDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({type: SignupResDto})
  @Public()
  @Post('signup')
  async create(@Body() signupReqDto: SignupReqDto): Promise<SignupResDto> {
    const { id } = await this.userService.createUser(signupReqDto);
    return { id };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param() { id }: FindUserReqDto): Promise<GetUserResDto> {
    return this.userService.findOneByUserId(id);
  }
}
