import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class FeedbackService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async test() {
    await this.redis.set('key3', 'value3');
    return await this.redis.get('key3');
  }
}
