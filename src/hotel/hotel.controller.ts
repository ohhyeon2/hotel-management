import { HotelService } from './hotel.service';
import { Body, Controller, Delete, Param, Post, Put, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateHotelReqDto, UpdateHotelReqDto } from './dto/req.dto';

@ApiTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  async create(@Body() createHotelReqDto: CreateHotelReqDto) {
    return this.hotelService.create(createHotelReqDto);
  }

  @Put(':id')
  async update(@Param() id: string, @Body() updateHotelReqDto: UpdateHotelReqDto) {
    return this.hotelService.update(id, updateHotelReqDto);
  }

  @Delete()
  async remove(@Param() id: string): Promise<boolean> {
    return this.hotelService.remove(id);
  }

  @Get()
  async findAll() {
    return this.hotelService.findAll();
  }
}
