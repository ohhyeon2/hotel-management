import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { GradeService } from 'src/grade/grade.service';
import { Verification } from 'src/auth/entity/verification.entity';
import { EncryptService } from 'src/common/encrypt/encrypt.service';
import { SignupReqDto } from './../auth/dto/req.dto';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    private readonly gradeService: GradeService,
    private readonly encryptService: EncryptService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signupReqDto: SignupReqDto, password: string, verified: Verification) {
    const { email, nickname, name, phone } = signupReqDto;

    const encryptEmail = this.encryptService.encrypt(email);
    const encryptPhone = this.encryptService.encrypt(phone);
    const encryptName = this.encryptService.encrypt(name);

    const user = this.userRepository.create({
      email: encryptEmail,
      name: encryptName,
      phone: encryptPhone,
      nickname,
      password,
      verified: [verified],
    });

    const grade = await this.gradeService.createGrade(user);
    user.grade = grade;

    await this.userRepository.save(user);

    return user;
  }

  // @Cron('0 0 1 * *')
  async checkUserUsageAndUpgrade() {
    Logger.log('유저 등급 조정 작업 시작');
    const users = await this.userRepository.find({ relations: ['grade'] });

    for (const user of users) {
      const id = user.id;
      const usageCount = user.usageCount;
      await this.gradeService.updateGrade({ id, usageCount });
    }
  }

  async findOneByUserId(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['grade'] });

    const email = this.encryptService.decrypt(user.email);
    const phone = this.encryptService.decrypt(user.phone);
    const name = this.encryptService.decrypt(user.name);

    return { email, name, phone, grade: user.grade.grade };
  }

  async findOneByUsageCount(id: string) {
    const { usageCount } = await this.userRepository.findOneBy({ id });
    return { usageCount };
  }

  async findOneByUserEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
