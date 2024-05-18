import { SignupReqDto } from './../auth/dto/req.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { GradeService } from 'src/grade/grade.service';
import { Verification } from 'src/auth/entity/verification.entity';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    private readonly gradeService: GradeService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signupReqDto: SignupReqDto, password: string, verified: Verification) {
    const { email, nickname, name, phone  } = signupReqDto;
    const user = this.userRepository.create({
      email,
      nickname,
      name,
      phone,
      password,
      verified: [ verified ]
  });

    const grade = await this.gradeService.createGrade(user);
    user.grade = grade;
    
    await this.userRepository.save(user);

    return user;
  }

  // @Cron('0 0 1 * *')
  async checkUserUsageAndUpgrade() {
    console.log("유저 등급 조정")
    const users = await this.userRepository.find({ relations: ['grade'] })

    for (const user of users) {
      const id = user.id;
      const usageCount = user.usageCount;

      await this.gradeService.updateGrade({id, usageCount})
    }
  }

  async findOneByUserId(id: string) {
    const { email, nickname, phone } = await this.userRepository.findOneBy({ id });
    return { email, nickname, phone };
  }

  async findOneByUseCount(id: string) {
    const { usageCount } = await this.userRepository.findOneBy({ id });
    return { usageCount }
  }

  async findOneByUserEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
