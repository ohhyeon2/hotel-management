import { ApiProperty } from '@nestjs/swagger';

export class SignupResDto {
  @ApiProperty({ required: true })
  id: string;
}

export class FindUserResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true, example: 'nestjs@naver.com' })
  email: string;
}

export class GetUserResDto {
  @ApiProperty({ required: true, example: 'nestjs@naver.com' })
  email: string;

  @ApiProperty({ required: true, example: '010-1234-5678' })
  phone: string;

  @ApiProperty({ required: true, example: '닉네임' })
  nickname: string;
}
