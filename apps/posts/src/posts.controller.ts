import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/books.patterns';
import { CreatePostDto } from '@app/contracts/posts/post.dto';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @MessagePattern(POSTS_PATTERNS.CREATE)
  async create(@Payload() payload: {
    request: CreatePostDto,
    coverPicture: Express.Multer.File
  }) {
    return await this.postsService.create(payload.request, payload.coverPicture);
  }

  @MessagePattern(POSTS_PATTERNS.UPDATE)
  async update(@Payload() payload: {
    _id: string,
    request: CreatePostDto,
    coverPicture: Express.Multer.File
  }) {
    return await this.postsService.update(payload._id, payload.request, payload.coverPicture);
  }

  @MessagePattern(POSTS_PATTERNS.FIND_ONE)
  async findOne(@Payload() request: string) {
    return await this.postsService.findOne(request)
  }

  @MessagePattern(POSTS_PATTERNS.FIND)
  async find() {
    return await this.postsService.find()
  }
}
