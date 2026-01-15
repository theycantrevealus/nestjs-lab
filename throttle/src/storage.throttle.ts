import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: '127.0.0.1',
      port: 6379,
    });
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const now = Date.now();
    const redisKey = `throttle:${key}`;
    const blockKey = `throttle_block:${key}`;

    const blockedUntil = await this.redis.get(blockKey);
    if (blockedUntil && parseInt(blockedUntil) > now) {
      const remainingBlock = Math.ceil(parseInt(blockedUntil) - now);
      const ttlSeconds = await this.redis.ttl(redisKey);
      return {
        totalHits: limit,
        timeToExpire: ttlSeconds > 0 ? ttlSeconds : 0,
        isBlocked: true,
        timeToBlockExpire: remainingBlock,
      };
    }

    const totalHits = await this.redis.incr(redisKey);

    if (totalHits === 1) {
      await this.redis.pexpire(redisKey, ttl);
    }

    const timeToExpire = await this.redis.pttl(redisKey);

    if (totalHits > limit) {
      await this.redis.set(blockKey, now + blockDuration, 'PX', blockDuration);
      return {
        totalHits,
        timeToExpire,
        isBlocked: true,
        timeToBlockExpire: blockDuration,
      };
    }

    return {
      totalHits,
      timeToExpire,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }

  async getRecord(key: string): Promise<number[]> {
    const value = await this.redis.get(key);
    if (!value) return [];
    return JSON.parse(value);
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    const records = await this.getRecord(key);
    const now = Date.now();
    records.push(now);

    await this.redis.set(key, JSON.stringify(records), 'PX', ttl);
  }
}
