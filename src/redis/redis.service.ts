import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(key: string, value: string, ttl: number) {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}