import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService)
  const port = configService.get('PORT')

  app.enableCors({
    origin: [
      configService.get('FE_LOCAL_URL'),
      configService.get('FE_PUBLIC_URL')
    ],
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  app.use(cookieParser())
  await app.listen(port);
}
bootstrap();
