import { ApiProperty } from '@nestjs/swagger';

export class FindHotelResDto {
  @ApiProperty({ required: true, example: '그랜드 부다페스트 호텔' })
  name: string;
}
