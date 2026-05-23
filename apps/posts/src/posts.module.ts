import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CloudinaryService } from './pictures/cloudinary.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/posts.schema';
import { PostsDb } from './posts.db';
import { CloudinaryProvider } from './pictures/cloudinary.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/posts/.env'
    }),

    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
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
  controllers: [PostsController],
  providers: [PostsService, CloudinaryService, CloudinaryProvider, PostsDb],
})
export class PostsModule { }
