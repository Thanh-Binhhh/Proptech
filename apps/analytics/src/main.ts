import { NestFactory } from '@nestjs/core';
import { AnalyticsModule } from './analytics.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.PORT ?? '4004');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AnalyticsModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port,
      }
    }
  );
  await app.listen();
}
bootstrap();
