import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret_key',
      signOptions: {
        expiresIn: '1h'
      }
    }),
    TypeOrmModule.forFeature([User]),
    UserModule, 
    PassportModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
