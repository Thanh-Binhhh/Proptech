import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONTACT } from 'libs/contracts/constant';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CONTACT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('CONTACT_HOST') || 'localhost',
            port: Number(configService.get<string>('CONTACT_PORT') || 4002),
          },
        }),
      },
    ]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule { }
