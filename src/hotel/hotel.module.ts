import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entity/hotel.entity';
import { HotelImage } from './entity/hotel-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, HotelImage])],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
