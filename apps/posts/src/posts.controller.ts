import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/books.patterns';
import { CreatePostDto } from '@app/contracts/posts/post.dto';


@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @MessagePattern(POSTS_PATTERNS.CREATE)
  async create(@Payload() request: CreatePostDto) {
    return await this.postsService.create(request);
  }
}
