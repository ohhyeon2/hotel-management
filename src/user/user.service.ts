import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { SignupReqDto } from './dto/req.dto';

@Injectable()
export class UserService {
  constructor(
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
    await this.userRepository.save(user);
    return user;
  }

  async findOneByUserEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async userProfile(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  private async validateCreateUser(email: string, password: string, passwordCheck: string) {
    const existUser = await this.userRepository.findOneBy({ email })
    if (existUser) throw new BadRequestException();
    if (password != passwordCheck) throw new BadRequestException();
  }

  private async generatePassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
