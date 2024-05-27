import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { faker } from '@faker-js/faker';
import { Hotel } from './entity/hotel.entity';
import { HotelImage } from './entity/hotel-image.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class HotelSeeder implements Seeder {
  constructor(
    @InjectRepository(Hotel) private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(HotelImage) private readonly hotelImageRepository: Repository<HotelImage>,
  ) {}
  
  async seed(): Promise<void> {
    for (let i = 0; i < 100; i++) {
      const hotel = new Hotel();
      hotel.id = faker.datatype.uuid();
      hotel.name = faker.company.name();
      hotel.email = faker.internet.email();
      hotel.telephone = faker.phone.number();
      hotel.description = faker.lorem.paragraph();
      hotel.address = faker.address.streetAddress();
      hotel.price = faker.datatype.number({ min: 50, max: 500 });
      hotel.checkIn = faker.date.past().toISOString();
      hotel.checkOut = faker.date.future().toISOString();
      hotel.createdAt = new Date();
      hotel.updatedAt = new Date();

      await this.hotelRepository.save(hotel);

      const images: HotelImage[] = [];
      for (let j = 0; j < faker.datatype.number({ min: 1, max: 5 }); j++) {
        const image = new HotelImage();
        image.id = faker.datatype.uuid();
        image.path = faker.image.imageUrl();
        image.mimetype = 'image/png';
        image.hotel = hotel;
        images.push(image);
      }
      
      await this.hotelImageRepository.save(images);
    }
  }

  async drop(): Promise<void> {
    await this.hotelRepository.delete({});
    await this.hotelImageRepository.delete({});
  }
}
