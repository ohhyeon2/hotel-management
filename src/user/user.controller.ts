import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { FindUserReqDto, SignupReqDto } from './dto/req.dto';
import { GetUserResDto, SignupResDto } from './dto/res.dto';

@ApiTags('User')
@ApiExtraModels(FindUserReqDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({type: SignupResDto})
  @Post('signup')
  async create(@Body() signupReqDto: SignupReqDto): Promise<SignupResDto> {
    const { id } = await this.userService.createUser(signupReqDto);
    return { id };
  }

  @Get(':id')
  async getUser(@Param() { id }: FindUserReqDto): Promise<GetUserResDto> {
    return this.userService.findOneByUserId(id);
  }
}
