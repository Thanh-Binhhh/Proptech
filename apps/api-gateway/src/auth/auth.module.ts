import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH } from '../constant';
import { Guard } from '../guards/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';

@Module({
  imports: [
    ConfigModule,

    ClientsModule.register([
      {
        name: AUTH,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4003,
        },
      },
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {
          expiresIn: (
            configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED') || '15m'
          ) as SignOptions['expiresIn'],
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    Guard,
  ],
  controllers: [AuthController],
})
export class AuthModule { }