import { Inject, Injectable, Logger } from "@nestjs/common";
import { KAFKA_TOPICS, SUBSCRIBER_MAP } from "./constant";
import { ConfigService } from "@nestjs/config";

export function SubscribeTo(topic: string) {
  return (target, propertyKey, descriptor) => {
    const originalMethod = target[propertyKey];
    SUBSCRIBER_MAP.set(topic, originalMethod);
    return descriptor;
  };
}

@Injectable()
export class DecoratorProcessorService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {}

  processDecorators(types: any[]) {
    for (const type of types) {
      const propNames = Object.getOwnPropertyNames(type.target.prototype);
      for (const prop of propNames) {
        const propValue = Reflect.getMetadata(
          type.constant,
          Reflect.get(type.target.prototype, prop)
        );

        if (propValue) {
          const topic = this.configService.get<string>(`${type.meta}.${prop}`);

          Reflect.decorate(
            [type.decorator(topic)],
            type.target.prototype,
            prop,
            Reflect.getOwnPropertyDescriptor(type.target.prototype, prop)
          );
        }
      }
    }
  }
}

export function KafkaTopic(variable: string): any {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(KAFKA_TOPICS, variable, descriptor.value);
    return descriptor;
  };
}
