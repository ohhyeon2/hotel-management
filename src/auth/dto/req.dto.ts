import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class SignupReqDto {
  @ApiProperty({ required: true, example: '김길동' })
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ required: true, example: '닉네임' })
  nickname: string;

  @ApiProperty({ required: true, example: '010-1234-5678' })
  @Matches(/^\d{3}-\d{4}-\d{4}$/)
  phone: string;

  @ApiProperty({ required: true, example: 'nestjs@naver.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 'Nestjs1!' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}/)
  password: string;

  @ApiProperty({ required: true, example: 'Nestjs1!' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}/)
  passwordCheck: string;
}

export class SigninReqDto {
  @ApiProperty({ required: true, example: 'nestjs@naver.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 'Nestjs1!' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{10,20}/)
  password: string;
}
