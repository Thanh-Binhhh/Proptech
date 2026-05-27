import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CloudinaryService } from './pictures/cloudinary.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/posts.schema';
import { PostsDb } from './posts.db';
import { CloudinaryProvider } from './pictures/cloudinary.provider';
import { CategoriesService } from './categories/categories.service';
import { CategoriesDb } from './categories/categories.db';
import { Category, CategorySchema } from './schemas/categories.schema';

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

    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
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
  providers: [PostsService, CloudinaryService, CategoriesService, CloudinaryProvider, PostsDb, CategoriesDb],
})
export class PostsModule { }