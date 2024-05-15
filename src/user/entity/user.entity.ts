import { RefreshToken } from 'src/auth/entity/refresh-token.entity';
import { Grade } from 'src/grade/entity/grade.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ unique: true })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //! 테스트
  @Column()
  tempGrade: string;

  @ManyToOne(() => Grade, (grade) => grade.user)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;
}
