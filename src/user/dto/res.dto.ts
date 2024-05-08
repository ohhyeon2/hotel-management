import { ApiProperty } from '@nestjs/swagger';

export class FindUserResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true, example: "nestjs@naver.com" })
  email: string;
}
