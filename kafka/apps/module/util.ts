import { KafkaModuleOption, KafkaProviderConfig } from "./interface";
import { ConfigService } from "@nestjs/config";
import { KafkaModule } from "./module";
import { join } from "path";

export function KafkaProvider(
  providerNames: string[],
  configuration: KafkaProviderConfig[]
) {
  const providerLists: KafkaModuleOption[] = [];
  return KafkaModule.registerAsync(providerNames, {
    useFactory: async (configService: ConfigService) => {
      configuration.map(async (a) => {
        const schemaList = [];
        a.schema.map((b) => {
          schemaList.push({
            topic: configService.get<string>(
              `${a.configClass}.topic.${b.topic}`
            ),
            headers: join(
              __dirname,
              `../apps/utility/kafka/avro/schema/${b.headers}`
            ),
            key: join(__dirname, `../apps/utility/kafka/avro/schema/${b.key}`),
            value: join(
              __dirname,
              `../apps/utility/kafka/avro/schema/${b.value}`
            ),
          });
        });

        providerLists.push({
          name: configService.get<string>(`${a.configClass}.service`),
          options: {
            consumeFromBeginning: configService.get<boolean>(
              `${a.configClass}.from_beginning`
            ),
            producerModeOnly: a.producerModeOnly,
            consumer: {
              groupId: configService.get<string>(`${a.configClass}.cons_group`),
            },
            producer: {
              idempotent: true,
              maxInFlightRequests: 1,
            },
            client: {
              clientId: configService.get<string>(`${a.configClass}.client`),
              brokers: configService
                .get<string>(`${a.configClass}.broker`)
                .split(","),
            },
          },
        });
      });
      return providerLists;
    },
    inject: [ConfigService],
  });
}
