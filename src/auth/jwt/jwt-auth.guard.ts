import {
  ExecutionContext,
  Injectable,
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

    const authorization = headers['authorization']
  
    if (!authorization) throw new UnauthorizedException();
    if (!authorization.includes('Bearer')) throw new UnauthorizedException();

    const token = /Bearer\s(.+)/.exec(authorization)[1];
    if (!token) throw new UnauthorizedException('액세스 토큰 필요');

    const decodeToken = this.jwtService.decode(token);
    if (url !== '/auth/refresh' && decodeToken['tokenType'] === 'refresh') {
      throw new UnauthorizedException('인증되지 않은 사용자 입니다.');
    }

    return super.canActivate(context);
  }
}
