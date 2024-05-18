import { Controller, Post, Get, Param, Body, UseGuards, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { FindUserReqDto } from './dto/req.dto';
import { GetUserResDto } from './dto/res.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('User')
@ApiExtraModels(FindUserReqDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param() { id }: FindUserReqDto): Promise<GetUserResDto> {
    return this.userService.findOneByUserId(id);
  }
}
