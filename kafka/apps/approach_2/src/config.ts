import * as process from "process";

export const KafkaConfig = () => {
  return {
    schema_registry: {
      host: process.env.KAFKA_SCHEMA_REGISTRY_SERVER,
    },
    kafka: {
      stock: {
        port: {
          transport: 4001,
          service: 4011,
        },
        service: "TEST_SERVICE",
        topic: {
          test: "test",
        },
        client: "test_client",
        broker: "localhost:9092,localhost:9094,localhost:9096",
        from_beginning: "false",
        cons_group: "TEST_CONS_GROUP",
      },
    },
  };
};
