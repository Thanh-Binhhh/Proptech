import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { POSTS } from '../constant';
import { ClientProxy } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/books.patterns';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POSTS)
    private readonly postService: ClientProxy
  ) { }

  create(createPostDto: CreatePostDto) {
    return this.postService.send(POSTS_PATTERNS.CREATE, createPostDto);
  }
}
