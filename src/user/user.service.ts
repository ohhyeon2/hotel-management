import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUserAccount(name: string, email: string, password: string) {
    const user = this.userRepository.create({ name, email, password });
    await this.userRepository.save(user);
    return user;
  }

  async findOneByUserEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
