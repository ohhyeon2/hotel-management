import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entity/hotel.entity';
import { Repository } from 'typeorm';
import { CreateHotelReqDto } from './dto/req.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  async create(createHotelReqDto: CreateHotelReqDto) {
    const { email, telephone } = createHotelReqDto;

    const existEmail = await this.hotelRepository.findOneBy({ email });
    if (existEmail) throw new BadRequestException();

    const existTelephone = await this.hotelRepository.findOneBy({ telephone });
    if (existTelephone) throw new BadRequestException();

    const hotel = this.hotelRepository.create(createHotelReqDto);
    await this.hotelRepository.save(hotel);

    return hotel;
  }
}
