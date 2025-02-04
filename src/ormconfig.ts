import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { Hotel } from './hotel/entity/hotel.entity';
import { HotelImage } from './hotel/entity/hotel-image.entity';
import { HotelSeeder } from './hotel/hotel.seeder';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.development`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      dropSchema: true,
      entities: [Hotel, HotelImage],
    }),
    TypeOrmModule.forFeature([Hotel, HotelImage])
  ]
}).run([HotelSeeder])