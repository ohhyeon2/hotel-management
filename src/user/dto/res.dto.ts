import { ApiProperty } from '@nestjs/swagger';
import { Grade } from 'src/grade/enum/grade.enum';

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

  @ApiProperty({ required: true, example: '김길동' })
  name: string;

  @ApiProperty({ required: true, example: 'normal'})
  grade: string;
}
