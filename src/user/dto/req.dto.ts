import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class SignupReqDto {
  @ApiProperty({ required: true, example: '김길동' })
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ required: true, example: 'nestjs@naver.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 'Nestjs1!' })
  password: string;

  @ApiProperty({ required: true, example: 'Nestjs1!' })
  passwordCheck: string;
}

export class FindUserReqDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;
}
