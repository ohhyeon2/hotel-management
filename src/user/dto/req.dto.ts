import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

export class FindUserReqDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;
}
