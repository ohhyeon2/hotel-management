import { HotelService } from './hotel.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateHotelReqDto } from './dto/req.dto';

@ApiTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  async create(@Body() createHotelReqDto: CreateHotelReqDto) {
    return this.hotelService.create(createHotelReqDto)
  }
}
