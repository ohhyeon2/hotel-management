import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entity/grade.entity';
import { GradeDiscount, Grade as Grades } from './enum/grade.enum';
import { UpdateUserGradeReqDto } from './dto/req.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}

  async createGrade(user: User): Promise<Grade> {
    const grade = this.gradeRepository.create({ users: [user] });

    await this.gradeRepository.save(grade);
    return grade;
  }

  async updateGrade({ id, usageCount }: UpdateUserGradeReqDto): Promise<void> {
    let newGrade: Grades | null = null;

    if (usageCount >= 5) {
      newGrade = Grades.GOLD;
    } else if (usageCount >= 3) {
      newGrade = Grades.SILVER;
    } else if (usageCount >= 1) {
      newGrade = Grades.BRONZE;
    }

    const userGrade = await this.gradeRepository.findOne({
      relations: ['users'],
      where: { users: { id } },
    });

    if (newGrade && newGrade != userGrade.grade) {
      userGrade.grade = newGrade;
      await this.gradeRepository.save(userGrade);
    }
  }

  async benefit(id: string): Promise<number> {
    const user = await this.gradeRepository.findOne({
      relations: ['users'],
      where: { users: { id } },
    });

    const benefit = GradeDiscount[user.grade];
    return benefit;
  }
}
