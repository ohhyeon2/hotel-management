import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { HotelImage } from './hotel-image.entity';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  telephone: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  price: number;

  @Column()
  checkIn: string;

  @Column()
  checkOut: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => HotelImage, (hotelImage) => hotelImage.hotel)
  image: HotelImage[];
}
