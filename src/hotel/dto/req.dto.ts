import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';

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

  @ApiProperty({ required: true, example: 100_000 })
  price: number;

  @ApiProperty({ required: true })
  checkIn: string;

  @ApiProperty({ required: true })
  checkOut: string;
}

export class UpdateHotelReqDto {
  @ApiProperty({ example: '업데이트 그랜드 부다페스트 호텔' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'update_hotel@hotel.com' })
  @IsOptional()
  email?: string;

  @ApiProperty({ examples: ['02-123-1234', '031-1234-1234'] })
  @Matches(/^\d{2,3}-\d{3,4}-\d{4}$/)
  @IsOptional()
  telephone?: string;

  @ApiProperty({ example: '호텔 소개' })
  @MaxLength(100)
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '서울특별시 중구 동호로 249 (우 04605)' })
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 100_000 })
  @IsOptional()
  price?: number

  @ApiProperty()
  @IsOptional()
  checkIn?: string;

  @ApiProperty()
  @IsOptional()
  checkOut?: string;
}

export class DeleteHotelReqDto {
  @ApiProperty({ required: true })
  id: string;
}

export class FindHotelReqDto {
  @ApiProperty({ required: true })
  id: string;
}

export class CreateImageReqDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true, format: 'binary', type: 'string'})
  image: any;
}