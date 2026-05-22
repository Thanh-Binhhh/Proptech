import { NestFactory } from '@nestjs/core';
import { ContactModule } from './contact.module';

async function bootstrap() {
  const app = await NestFactory.create(ContactModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
