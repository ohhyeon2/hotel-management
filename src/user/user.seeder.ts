// import { InjectRepository } from '@nestjs/typeorm';
// import { Seeder } from 'nestjs-seeder';
// import { Repository } from 'typeorm';
// import { User } from './entity/user.entity';
// import { faker } from '@faker-js/faker';


// export class UserSeeder implements Seeder {
//   constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

//   async seed(): Promise<void> {
//     const user = await this.userRepository.create({
//       id: faker.datatype.uuid(),
//       name: "이름",
//       email: "nest@naver.com",
//       phone: '010-1234-1234',
//       nickname: '닉네임',
//       grade: {
//         id: faker.datatype.uuid(),
//         grade: 'gold',
//       }
//     })
//   }
// }