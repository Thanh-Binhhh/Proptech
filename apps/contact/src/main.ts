import { NestFactory } from '@nestjs/core';
import { ContactModule } from './contact.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.PORT ?? '4002');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ContactModule,
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