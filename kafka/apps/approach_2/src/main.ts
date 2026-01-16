import { NestFactory } from "@nestjs/core";
import { Approach2Module } from "./approach_2.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DecoratorProcessorService, SubscribeTo } from "../../module/decorator";
import { Approach2Controller } from "./approach_2.controller";
import { KAFKA_TOPICS } from "../../module/constant";

async function bootstrap() {
  const app = await NestFactory.create(Approach2Module);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: {
        port: 4001,
      },
    },
    { inheritAppConfig: true }
  );

  app.get(DecoratorProcessorService).processDecorators([
    {
      target: Approach2Controller,
      constant: KAFKA_TOPICS,
      meta: `kafka.stock.topic`,
      decorator: SubscribeTo,
    },
  ]);

  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
