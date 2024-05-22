import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { FindUserReqDto } from './dto/req.dto';
import { FindUserResDto } from './dto/res.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@ApiTags('User')
@ApiExtraModels(FindUserReqDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param() { id }: FindUserReqDto): Promise<FindUserResDto> {
    return this.userService.findOneByUserId(id);
  }
}
