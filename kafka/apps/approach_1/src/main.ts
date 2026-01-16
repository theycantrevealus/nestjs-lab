import { NestFactory } from "@nestjs/core";
import { Approach1Module } from "./approach_1.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import * as cluster from "cluster";
import * as os from "os";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      Approach1Module,
      {
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ["localhost:9092", "localhost:9094", "localhost:9096"],
          },
          consumer: {
            groupId: "consumer_test",
          },
          run: {
            partitionsConsumedConcurrently: 3,
          },
        },
      }
    );

    await app.listen();
  }
  bootstrap();
}
