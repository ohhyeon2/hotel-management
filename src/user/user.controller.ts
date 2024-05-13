import { Controller, Post, Get, Param } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { FindUserReqDto } from './dto/req.dto';

@ApiTags('User')
@ApiExtraModels(FindUserReqDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param() { id }: FindUserReqDto) {
    return this.userService.userProfile(id);
  }
}
