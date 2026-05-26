import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../schemas/contact.schema';
import { ContactDb } from './contact.db';
import { POSTS } from 'libs/contracts/constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/contact/.env'
    }),

    ClientsModule.registerAsync([
      {
        name: POSTS,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async () => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: 4001,
          },
        }),
      },
    ]),

    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB')
      })
    }),
  ],
  controllers: [ContactController],
  providers: [ContactService, ContactDb],
})
export class ContactModule { }