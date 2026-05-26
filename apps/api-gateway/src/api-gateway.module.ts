import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { ContactService } from './contact/contact.service';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: 'apps/api-gateway/.env',
  }),

    AuthModule,

    PostsModule,

    ContactModule],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService, ContactService],
})
export class ApiGatewayModule { }