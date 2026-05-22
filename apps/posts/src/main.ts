import { NestFactory } from '@nestjs/core';
import { PostsModule } from './posts.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.PORT ?? '4001');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PostsModule,
    {
      transport: Transport.TCP,
      options: {
        port,
      }
    }
  );
  await app.listen();
}
bootstrap();
