import { Module } from '@nestjs/common';
import { Approach1Controller } from './approach_1.controller';
import { Approach1Service } from './approach_1.service';

@Module({
  imports: [],
  controllers: [Approach1Controller],
  providers: [Approach1Service],
})
export class Approach1Module {}
