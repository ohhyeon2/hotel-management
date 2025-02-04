import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GradeService } from 'src/grade/grade.service';
import { Grade } from 'src/grade/entity/grade.entity';
import { EncryptService } from 'src/common/encrypt/encrypt.service';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Grade]), ScheduleModule.forRoot()],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, JwtService, GradeService, EncryptService, Logger],
})
export class UserModule {}
