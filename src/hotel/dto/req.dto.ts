import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class CreateHotelReqDto {
  @ApiProperty({ required: true, example: '그랜드 부다페스트 호텔' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: 'hotel@hotel.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, examples: ['02-123-1234', '031-1234-1234'] })
  @Matches(/^\d{2,3}-\d{3,4}-\d{4}$/)
  telephone: string;

  @ApiProperty({ required: true, example: '호텔 소개' })
  @MaxLength(100)
  description: string;

  @ApiProperty({ required: true, example: '서울특별시 중구 동호로 249 (우 04605)' })
  address: string;

  @ApiProperty({ required: true })
  checkIn: string;

  @ApiProperty({ required: true })
  checkOut: string;
}
