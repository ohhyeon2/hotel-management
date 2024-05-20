import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { GradeService } from 'src/grade/grade.service';
import { Grade } from 'src/grade/entity/grade.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { EncryptService } from 'src/common/encrypt/encrypt.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Grade]), ScheduleModule.forRoot()],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, JwtService, GradeService, EncryptService],
})
export class UserModule {}
