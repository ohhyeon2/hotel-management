import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupReqDto {
  @ApiProperty({ required: true, example: "김길동" })
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ required: true, example: "nestjs@naver.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: "Nestjs1!" })
  password: string;

  @ApiProperty({ required: true, example: "Nestjs1!" })
  passwordCheck: string;
}

export class SigninReqDto {
  @ApiProperty({ required: true, example: "nestjs@naver.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: "Nestjs1!" })
  password: string;
}
