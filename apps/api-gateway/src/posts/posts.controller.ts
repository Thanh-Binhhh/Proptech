import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '@app/contracts/posts/post.dto';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  create(
    @Body() request: CreatePostDto
  ) {
    return await this.postsService.create(request);
  }
}
