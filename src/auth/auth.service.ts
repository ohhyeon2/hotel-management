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
import * as crypto from 'crypto';
import { EmailService } from 'src/email/email.service';
import { EncryptService } from 'src/common/encrypt/encrypt.service';
import { RedisService } from 'src/redis/redis.service';
import { Verification } from './entity/verification.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly encryptService: EncryptService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}

  async signup(signupReqDto: SignupReqDto) {
    const { email, password, passwordCheck } = signupReqDto;

    await this.validateUserSignup(email, password, passwordCheck)

    const verifiedStatus = await this.verificationRepository.findOne({
      where: { email, verified: true },
    });
    if (!verifiedStatus)
      throw new BadRequestException('이메일을 인증해 주세요');

    const hashPassword = await this.generatePassword(password);
    const user = await this.userService.create(
      signupReqDto,
      hashPassword,
      verifiedStatus,
    );

    verifiedStatus.user = user;

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.refreshTokenRepository.create({
      token: this.generateRefreshToken(user.id),
      user: { id: user.id },
    });

    await this.refreshTokenRepository.save(refreshToken);
    await this.verificationRepository.save(verifiedStatus);

    return { id: user.id, accessToken, refreshToken: refreshToken.token };
  }

  private async validateUserSignup(email: string, password: string, passwordCheck: string) {
    const user = await this.userService.findOneByUserEmail(email);
    if (user) throw new BadRequestException('이미 존재하는 이메일 입니다.');

    if (password !== passwordCheck) throw new BadRequestException('패스워드가 일치하지 않습니다.');
  }

  async signin(email: string, password: string) {
    const user = await this.validateUserSignin(email, password)

    const refreshToken = this.generateRefreshToken(user.id)

    await this.createUserRefreshToken(user.id, refreshToken);
    return {
      accessToken: this.generateAccessToken(user.id),
      refreshToken,
    };
  }

  private async validateUserSignin(email: string, password: string) {
    const user = await this.userService.findOneByUserEmail(email);
    if (!user) throw new UnauthorizedException('이메일 또는 패스워드가 일치하지 않습니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('이메일 또는 패스워드가 일치하지 않습니다.');

    return user;
  }

  async refresh(token: string, userId: string) {
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      token,
    });

    if (!refreshTokenEntity) throw new BadRequestException();

    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    refreshTokenEntity.token = refreshToken;
    await this.refreshTokenRepository.save(refreshTokenEntity);
    return { accessToken, refreshToken };
  }

  async sendVerificationCode(email: string) {
    const code = this.generateRandomCode(6);
    const encryptCode = this.encryptService.encrypt(code);

    await this.redisService.set(email, encryptCode);
    await this.emailService.sendVerificationCode(email, code);

    let verification = await this.verificationRepository.findOne({
      where: { email },
    });
    if (!verification) {
      verification = this.verificationRepository.create({ email });
      await this.verificationRepository.save(verification);
    }
  }

  async matchVerificationCode(email: string, code: string) {
    const encryptCode = await this.redisService.get(email);
    const decryptCode = this.encryptService.decrypt(encryptCode);

    const verifiedStatus = this.verificationRepository.create({ email });

    if (code !== decryptCode) throw new BadRequestException();
    if (code === decryptCode) await this.redisService.del(email);

    const verification = await this.verificationRepository.findOne({
      where: { email },
    });
    if (!verification) throw new BadRequestException();

    verifiedStatus.verified = true;
    await this.verificationRepository.save(verifiedStatus);
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId, tokenType: 'access' },
      { expiresIn: '1d' },
    );
  }

  private generateRefreshToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId, tokenType: 'refresh' },
      { expiresIn: '30d' },
    );
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
    return bcrypt.hash(password, 10);
  }

  private generateRandomCode(length: number) {
    const randomBytes = crypto
      .randomBytes(length)
      .toString('base64')
      .slice(0, length);
    return randomBytes;
  }
}
