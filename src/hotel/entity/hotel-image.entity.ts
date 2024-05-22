import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity()
export class HotelImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mimetype: string;

  @Column()
  path: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Hotel, (hotel) => hotel.image)
  @JoinColumn({ name: 'hotelImage_id' })
  hotel: Hotel;
}
