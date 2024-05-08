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

  async signup(name: string, email: string, password: string) {
    const user = await this.userService.findOneByUserEmail(email);
    if (user) throw new BadRequestException();
    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = await this.userService.createUserAccount(
      name,
      email,
      hashPassword,
    );
    return createUser;
  }

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
