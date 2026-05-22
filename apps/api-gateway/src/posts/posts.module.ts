import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { POSTS } from '../constant';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: POSTS,
        transport: Transport.TCP,
        options: { port: 4001 }
      }
    ])
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule { }
