import { ApiProperty } from '@nestjs/swagger';

export class FindUserResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true, example: 'nestjs@naver.com' })
  email: string;
}

export class UserProfileResDto {
  @ApiProperty({ required: true, example: 'nestjs@naver.com' })
  email: string;

  @ApiProperty({ required: true, example: '010-1234-5678' })
  phone: string;
}
