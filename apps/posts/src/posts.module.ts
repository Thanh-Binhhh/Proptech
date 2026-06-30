import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { MongooseModule } from '@nestjs/mongoose';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { Post, PostSchema } from './properties-posts/schemas/create-posts.schema';
import { PostsController } from './posts.controller';
import { PropertyPostsService } from './properties-posts/properties-posts.service';
import { CloudinaryService } from './pictures/cloudinary.service';
import { PropertyPostsDb } from './properties-posts/properties-posts.db';
import { CloudinaryProvider } from './pictures/cloudinary.provider';
import { CategoriesService } from './categories/categories.service';
import { CategoriesDb } from './categories/categories.db';
import { Category, CategorySchema } from './categories/schemas/categories.schema';
import { PostStatusHistory, PostStatusHistorySchema } from './properties-posts/schemas/status-history.schema';
import { AUTH } from 'libs/contracts/constant';
import { ElasticSearchService } from './elasticsearch.service';
import { News, NewsSchema } from './news-posts/schemas/news.schema';
import { NewsService } from './news-posts/news-post.service';
import { NewsDb } from './news-posts/news-posts.db';
import { PostsService } from './posts.service';
import { PostsDb } from './posts.db';

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

    MongooseModule.forFeature([
      {
        name: PostStatusHistory.name,
        schema: PostStatusHistorySchema,
      },
    ]),

    MongooseModule.forFeature([
      {
        name: News.name,
        schema: NewsSchema,
      },
    ]),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB')
      })
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED') || '15m') as SignOptions['expiresIn'],
        }
      }),
      inject: [ConfigService]
    }),

    ClientsModule.registerAsync([
      {
        name: AUTH,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_HOST'),
            port: Number(configService.get<string>('AUTH_PORT')),
          },
        }),
      },
    ]),

    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const node = configService.get<string>('ELASTICSEARCH_NODE');

        console.log('ELASTICSEARCH_NODE:', node);

        return {
          node,
        };
      },
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService, PropertyPostsService, NewsService, CloudinaryService, CategoriesService, ElasticSearchService, CloudinaryProvider, PostsDb, PropertyPostsDb, CategoriesDb, NewsDb],
})
export class PostsModule { }