import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signin(email: string, password: string) {
    const user = await this.userService.findOneByUserEmail(email);
    if (!user) throw new UnauthorizedException();
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) throw new UnauthorizedException();
    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
