import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    NestRedisModule.forRoot({
      type: 'single',
      options: {
        host: 'localhost',
        port: 6379
      }
    }),
  ],
  providers: [RedisService],
})
export class RedisModule {}
