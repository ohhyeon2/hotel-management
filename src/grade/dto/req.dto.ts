import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateGradeReqDto {
  @ApiProperty({ required: true })
  id: string
}

export class UpdateUserGradeReqDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string

  @ApiProperty({ required: true })
  @IsNumber()
  usageCount: number
}