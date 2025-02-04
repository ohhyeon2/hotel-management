import {
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const http = context.switchToHttp();
    const { url, headers } = http.getRequest<Request>();

    const authorization = headers['authorization'];

    if (!authorization || !authorization.includes('Bearer')) {
      const error = new UnauthorizedException('인증되지 않은 사용자');
      this.logger.log(error.message, error.stack);
      throw error;
    }
    
    const token = /Bearer\s(.+)/.exec(authorization)[1];
    if (!token) throw new UnauthorizedException('액세스 토큰 필요');

    const decodeToken = this.jwtService.decode(token);
    if (url !== '/auth/refresh' && decodeToken['tokenType'] === 'refresh') {
      const error = new UnauthorizedException('인증되지 않은 사용자');
      this.logger.log(error.message, error.stack);
      throw error;
    }

    return super.canActivate(context);
  }
}
