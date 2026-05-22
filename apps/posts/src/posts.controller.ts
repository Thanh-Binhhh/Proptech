import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePostDto } from '@app/contracts/posts/create-post.dto';
import { POSTS_PATTERNS } from '@app/contracts/posts/books.patterns';


@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @MessagePattern(POSTS_PATTERNS.CREATE)
  async create(@Payload() request: CreatePostDto) {
    return await this.postsService.create(request);
  }
}
