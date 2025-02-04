import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { RefreshToken } from 'src/auth/entity/refresh-token.entity';
import { Verification } from 'src/auth/entity/verification.entity';
import { Grade } from 'src/grade/entity/grade.entity';

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

  @Column({ default: 0 })
  usageCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Grade, (grade) => grade.users)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;

  @OneToMany(() => Verification, (verification) => verification.user)
  verified: Verification[];
}
