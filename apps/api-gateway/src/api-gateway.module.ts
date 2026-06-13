import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: 'apps/api-gateway/.env',
  }),
    AuthModule,
    PostsModule,
    ContactModule,
    AnalyticsModule
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }