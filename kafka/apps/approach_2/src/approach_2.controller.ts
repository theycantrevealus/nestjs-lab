import { Controller, Get, Inject, OnModuleInit } from "@nestjs/common";
import { KafkaTopic } from "../../module/decorator";
import { Payload } from "@nestjs/microservices";
import { Consumer } from "kafkajs";
import { KafkaService } from "../../module/service";

@Controller()
export class Approach2Controller implements OnModuleInit {
  constructor(@Inject("TEST_SERVICE") private client: KafkaService) {}

  onModuleInit(): void {
    this.client.subscribeToResponseOf("test", this);
  }

  @KafkaTopic("KAFKA_TOPICS")
  async test(
    @Payload() payload: any,
    key: any,
    offset: string,
    timestamp: string,
    partition: number,
    topic: string,
    consumer: Consumer,
    headers: any
  ) {
    console.log(`Topic     : ${topic}`);
    console.log(`Key       : ${JSON.stringify(key, null, 2)}`);
    console.log(`Offset    : ${offset}`);
    console.log(`Timestamp : ${timestamp}`);
    console.log(`Partition : ${partition}`);
    console.log(`Payload   : ${JSON.stringify(payload, null, 2)}`);
    console.log(`Header    : ${JSON.stringify(headers, null, 2)}`);
  }
}
