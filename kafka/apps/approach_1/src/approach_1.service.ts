import { Injectable } from '@nestjs/common';

@Injectable()
export class Approach1Service {
  getHello(): string {
    return 'Hello World!';
  }
}
