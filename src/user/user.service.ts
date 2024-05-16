import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { SignupReqDto } from './dto/req.dto';
import { GradeService } from 'src/grade/grade.service';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    private readonly gradeService: GradeService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(signupReqDto: SignupReqDto) {
    const { name, email, password, passwordCheck, nickname, phone } = signupReqDto;
    
    await this.validateCreateUser(email, password, passwordCheck)

    const hashPassword = await this.generatePassword(password);
    const user = this.userRepository.create({
      name,
      nickname,
      email,
      phone,
      password: hashPassword,
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

  private async validateCreateUser(email: string, password: string, passwordCheck: string) {
    const existUser = await this.userRepository.findOneBy({ email })

    if (existUser) throw new BadRequestException("이미 존재하는 email입니다.");
    if (password != passwordCheck) throw new BadRequestException("패스워드가 일치하지 않습니다.");
  }

  private async generatePassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
