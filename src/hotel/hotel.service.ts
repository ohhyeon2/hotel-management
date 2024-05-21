import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entity/hotel.entity';
import { Repository } from 'typeorm';
import { CreateHotelReqDto, UpdateHotelReqDto } from './dto/req.dto';

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

  async update(id: string, updateHotelReqDto: UpdateHotelReqDto) {
    const hotel = await this.hotelRepository.findOneBy({ id })

    if (!hotel) throw new NotFoundException();

    const { email, telephone } = updateHotelReqDto;

    if (email && email !== hotel.email) {
      const existEmail = await this.hotelRepository.findOneBy({ email })
      if (existEmail) throw new BadRequestException()
    }

    if (telephone && telephone !== hotel.telephone) {
      const existTelephone = await this.hotelRepository.findOneBy({ telephone })
      if (existTelephone) throw new BadRequestException()
    }

    await this.hotelRepository.update(id, updateHotelReqDto)

    return hotel;
  }

  async remove(id: string) {
    const hotel = await this.hotelRepository.findOneBy({ id });

    if (!hotel) throw new NotFoundException();

    const result = await this.hotelRepository.delete(id);

    if (result.affected === 0) {
      throw new InternalServerErrorException("호텔 삭제 실패");
    }

    return true;
  }

  async findAll() {
    const hotels = await this.hotelRepository.find();
    return hotels;
  }
}
