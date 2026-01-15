import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisThrottlerStorage } from './storage.throttle';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [{ ttl: 5000, limit: 1 }],
        storage: new RedisThrottlerStorage(),
      }),
    }),
    MongooseModule.forRootAsync({}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
