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
import { SignupReqDto } from './dto/req.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async signup(signupReqDto: SignupReqDto) {
    const { name, email, password, passwordCheck, nickname, phone } = signupReqDto

    const existUser = await this.userService.findOneByUserEmail(email);
    if (existUser) throw new BadRequestException();
    if (password !== passwordCheck) throw new BadRequestException();

    const hashPassword = await this.generatePassword(password);
    const user = await this.userService.create(name, email, hashPassword, nickname, phone);

    const accessToken = this.generateAccessToken(user.id)
    const refreshToken = this.refreshTokenRepository.create({
      token: this.generateRefreshToken(user.id),
      user: { id: user.id }
    })

    await this.refreshTokenRepository.save(refreshToken);
    return { id: user.id, accessToken, refreshToken: refreshToken.token };
  }

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
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({ token })

    if (!refreshTokenEntity) throw new BadRequestException();

    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    
    refreshTokenEntity.token = refreshToken;
    await this.refreshTokenRepository.save(refreshTokenEntity)
    return { accessToken, refreshToken}
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.sign({sub: userId, tokenType: 'access'}, {expiresIn: '1d'})
  }

  private generateRefreshToken(userId: string) {
    return this.jwtService.sign({sub: userId, tokenType: 'refresh'}, {expiresIn: '30d'})
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

  private async generatePassword(password: string) {
    return bcrypt.hash(password, 10)
  }
}
