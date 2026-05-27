import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/books.patterns';
import { CATEGORIES_PATTERNS } from '@app/contracts/posts/categories.patterns';
import { CreatePostDto } from '@app/contracts/posts/post.dto';
import { CreateCategoryDto } from '@app/contracts/posts/category.dto';
import { PostsService } from './posts.service';
import { CategoriesService } from './categories/categories.service';

@Controller()
export class PostsController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService
  ) { }

  @MessagePattern(CATEGORIES_PATTERNS.CREATE)
  async createCategory(@Payload() request: CreateCategoryDto) {
    return await this.categoriesService.create(request);
  }

  @MessagePattern(CATEGORIES_PATTERNS.UPDATE)
  async editCategory(@Payload() payload: {
    _id: string,
    request: CreatePostDto,
  }) {
    return await this.categoriesService.edit(payload._id, payload.request);
  }

  @MessagePattern(CATEGORIES_PATTERNS.FIND)
  async findCategory() {
    return await this.categoriesService.find()
  }

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

  @MessagePattern(POSTS_PATTERNS.FIND_ONE_FOR_CONTACT)
  async findOneForContactService(@Payload() request: string) {
    return await this.postsService.findOneForContactService(request)
  }

  @MessagePattern(POSTS_PATTERNS.FIND)
  async find(@Payload() request: number) {
    return await this.postsService.find(request)
  }
}