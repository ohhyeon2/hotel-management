import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
    UserModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: APP_GUARD, 
      useClass: JwtAuthGuard
    },
  ],
  controllers: [AuthController]
})
export class AuthModule {}
