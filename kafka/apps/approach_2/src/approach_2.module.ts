import { Module } from "@nestjs/common";
import { Approach2Controller } from "./approach_2.controller";
import { Approach2Service } from "./approach_2.service";
import { KafkaProvider } from "../../module/util";
import { DecoratorProcessorService } from "../../module/decorator";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { KafkaConfig } from "./config";
import { KafkaModule } from "../../module/module";
import { KafkaModuleOption } from "../../module/interface";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [KafkaConfig],
    }),
    KafkaModule.registerAsync(["TEST_SERVICE"], {
      useFactory: async (configService: ConfigService) => {
        return [
          {
            name: "TEST_SERVICE",
            options: {
              consumeFromBeginning: false,
              producerModeOnly: false,
              consumer: {
                groupId: "consumer_test",
              },
              producer: { idempotent: true, maxInFlightRequests: 1 },
              client: {
                clientId: "test_client",
                brokers: ["localhost:9092", "localhost:9094", "localhost:9096"],
              },
            },
          },
        ] as KafkaModuleOption[];
      },
    }),
  ],
  controllers: [Approach2Controller],
  providers: [DecoratorProcessorService, Approach2Service],
  exports: [DecoratorProcessorService],
})
export class Approach2Module {}
