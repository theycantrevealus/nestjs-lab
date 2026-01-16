import { Injectable } from '@nestjs/common';

@Injectable()
export class Approach2Service {
  getHello(): string {
    return 'Hello World!';
  }
}
