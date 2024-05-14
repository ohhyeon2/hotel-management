import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailReqDto {
  @ApiProperty({ required: true, example: 'nestjs@naver.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string
}