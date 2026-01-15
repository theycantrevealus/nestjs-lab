import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(ModelCase) private readonly modelExample: ModelCase,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  redeem(payload) {
    return `Redeem process : ${JSON.stringify(payload)}`;
  }
}
