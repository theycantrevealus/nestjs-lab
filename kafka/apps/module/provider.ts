import { Inject, Injectable } from "@nestjs/common";
import { KAFKA_MODULE_OPTIONS } from "./constant";
import { KafkaModuleOption } from "./interface";

@Injectable()
export class KafkaModuleOptionsProvider {
  constructor(
    @Inject(KAFKA_MODULE_OPTIONS)
    private readonly kafkaModuleOptions: KafkaModuleOption[]
  ) {}

  getOptionsByName(name: string) {
    console.log(name);
    console.log(this.kafkaModuleOptions);
    return this.kafkaModuleOptions.find((x) => x.name === name).options;
  }
}
