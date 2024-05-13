import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async signin(email: string, password: string) {
    const user = await this.userService.findOneByUserEmail(email);
    if (!user) throw new UnauthorizedException();

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) throw new UnauthorizedException();

    const refreshToken = this.jwtService.sign(
      { sub: user.id, tokenType: 'refresh' },
      { expiresIn: '30d' },
    );
    await this.createUserRefreshToken(user.id, refreshToken);
    return {
      accessToken: this.jwtService.sign({ sub: user.id, tokenType: 'access' }),
      refreshToken,
    };
  }

  async refresh(token: string, userId: string) {
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({token})
    if (!refreshTokenEntity) throw new BadRequestException();
    const accessToken = this.jwtService.sign({sub: userId, tokenType: 'access'}, { expiresIn: '1d'})
    const refreshToken = this.jwtService.sign({sub: userId, tokenType: 'access'}, { expiresIn: '1d'})
    refreshTokenEntity.token = refreshToken;
    await this.refreshTokenRepository.save(refreshTokenEntity)
    return { accessToken, refreshToken}
  }

  private async createUserRefreshToken(userId: string, refreshToken: string) {
    let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      user: { id: userId },
    });
    if (refreshTokenEntity) {
      refreshTokenEntity.token = refreshToken;
    } else {
      refreshTokenEntity = this.refreshTokenRepository.create({
        user: { id: userId },
        token: refreshToken,
      });
    }
    await this.refreshTokenRepository.save(refreshTokenEntity);
  }
}
