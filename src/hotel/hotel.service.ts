import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entity/hotel.entity';
import { HotelImage } from './entity/hotel-image.entity';
import { CreateHotelReqDto, UpdateHotelReqDto } from './dto/req.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(HotelImage)
    private readonly hotelImageRepository: Repository<HotelImage>,
  ) {}

  async create(createHotelReqDto: CreateHotelReqDto) {
    const { email, telephone } = createHotelReqDto;

    const existEmail = await this.hotelRepository.findOneBy({ email });
    if (existEmail) throw new BadRequestException('이미 존재하는 이메일');

    const existTelephone = await this.hotelRepository.findOneBy({ telephone });
    if (existTelephone) throw new BadRequestException('이미 존재하는 전화번호');

    const hotel = this.hotelRepository.create(createHotelReqDto);

    await this.hotelRepository.save(hotel);

    return hotel;
  }

  async update(id: string, updateHotelReqDto: UpdateHotelReqDto) {
    const hotel = await this.hotelRepository.findOneBy({ id });

    if (!hotel) throw new NotFoundException();

    const { email, telephone } = updateHotelReqDto;

    if (email && email !== hotel.email) {
      const existEmail = await this.hotelRepository.findOneBy({ email });
      if (existEmail) throw new BadRequestException('이미 존재하는 이메일');
    }

    if (telephone && telephone !== hotel.telephone) {
      const existTelephone = await this.hotelRepository.findOneBy({
        telephone,
      });
      if (existTelephone) throw new BadRequestException('이미 존재하는 전화번호');
    }

    await this.hotelRepository.update(id, updateHotelReqDto);

    return hotel;
  }

  async remove(id: string) {
    const hotel = await this.hotelRepository.findOneBy({ id });

    if (!hotel) throw new NotFoundException('존재하지 않는 호텔');

    const result = await this.hotelRepository.delete(id);

    if (result.affected === 0) throw new InternalServerErrorException('호텔 삭제 실패');

    return true;
  }

  async upload(id: string, name: string, mimetype: string, path: string) {
    const hotel = await this.hotelRepository.findOneBy({ id });

    if (!hotel) throw new NotFoundException('존재하지 않는 호텔');

    const uploaded = this.hotelImageRepository.create({
      name,
      mimetype,
      path,
      hotel,
    });

    hotel.image.push(uploaded);

    await this.hotelImageRepository.save(uploaded);
    await this.hotelRepository.save(hotel);
  }

  async findAll() {
    const hotels = await this.hotelRepository.find();
    return hotels;
  }
}
