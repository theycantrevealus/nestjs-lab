import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GuardThrottlerRedeem } from './guard.throttle.redeem';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(GuardThrottlerRedeem)
  @HttpCode(HttpStatus.OK)
  @Post()
  redeem(@Body() body) {
    return this.appService.redeem(body);
  }
}
