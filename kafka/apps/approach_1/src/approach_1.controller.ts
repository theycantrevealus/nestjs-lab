import { Controller, Get } from "@nestjs/common";
import { Approach1Service } from "./approach_1.service";
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from "@nestjs/microservices";

@Controller()
export class Approach1Controller {
  constructor() {}

  @MessagePattern("test")
  async consume_test(@Payload() data, @Ctx() context: KafkaContext) {
    const partition = context.getPartition();
    const offset = context.getMessage().offset;

    console.log(`Partition ${partition}, Offset ${offset}: ${data}`);
  }
}
