import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/posts.patterns';
import { CATEGORIES_PATTERNS } from '@app/contracts/posts/categories.patterns';
import { CreatePostDto } from '@app/contracts/posts/create-post.dto';
import { CreateCategoryDto } from '@app/contracts/posts/category.dto';
import { PostsService } from './properties-posts/properties-posts.service';
import { CategoriesService } from './categories/categories.service';
import { UpdateStatusPostDto } from '@app/contracts/posts/update-post-status.dto';

@Controller()
export class PostsController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService
  ) { }

  /*==========================
    CATEGORIES
  ============================*/
  @MessagePattern(CATEGORIES_PATTERNS.CREATE)
  async createCategory(
    @Payload() request: CreateCategoryDto
  ) {
    return await this.categoriesService.create(request);
  }

  @MessagePattern(CATEGORIES_PATTERNS.UPDATE)
  async editCategory(
    @Payload() payload: {
      _id: string,
      request: CreateCategoryDto,
    }) {
    return await this.categoriesService.edit(payload._id, payload.request);
  }

  @MessagePattern(CATEGORIES_PATTERNS.FIND)
  async findCategory() {
    return await this.categoriesService.find()
  }

  /*==========================
    POSTS -- FOR CUSTOMERS
  ============================*/
  @MessagePattern(POSTS_PATTERNS.PUBLIC_FIND_ONE)
  async publicFindOne(
    @Payload() request: string
  ) {
    return await this.postsService.publicFindOne(request)
  }

  @MessagePattern(POSTS_PATTERNS.PUBLIC_FIND)
  async publicFind(
    @Payload() request: number) {
    return await this.postsService.publicFind(request)
  }

  @MessagePattern(POSTS_PATTERNS.PUBLIC_SEARCH)
  async publicSearch(
    @Payload() payload: {
      page: number,
      keyword: string
    }) {
    return await this.postsService.publicSearch(payload)
  }

  /*==========================
    POSTS -- FOR INTERNAL COMPANY USE ONLY
  ============================*/
  @MessagePattern(POSTS_PATTERNS.CREATE)
  async create(
    @Payload() payload: {
      author,
      request: CreatePostDto,
      coverPicture: Express.Multer.File
    }) {
    return await this.postsService.create(payload);
  }

  @MessagePattern(POSTS_PATTERNS.UPDATE)
  async update(
    @Payload() payload: {
      actionBy,
      _id: string,
      request: CreatePostDto,
      coverPicture: Express.Multer.File
    }) {
    return await this.postsService.update(payload);
  }

  @MessagePattern(POSTS_PATTERNS.UPDATE_STATUS)
  async updateStatus(
    @Payload() payload: {
      actionBy,
      _id: string,
      request: UpdateStatusPostDto,
    }) {
    return await this.postsService.updateStatus(payload);
  }

  @MessagePattern(POSTS_PATTERNS.FIND_ONE)
  async findOne(
    @Payload() request: string
  ) {
    return await this.postsService.findOne(request)
  }

  @MessagePattern(POSTS_PATTERNS.FIND_ONE_FOR_CONTACT)
  async findOneForContactService(
    @Payload() payload: {
      _id: string
    }) {
    return await this.postsService.findOneForContactService(payload)
  }

  @MessagePattern(POSTS_PATTERNS.FIND)
  async find(
    @Payload() payload: {
      page: number,
      status: string,
      category: string
    }) {
    return await this.postsService.find(payload)
  }

  @MessagePattern(POSTS_PATTERNS.SEARCH)
  async search(
    @Payload() payload: {
      page: number,
      keyword: string
    }) {
    return await this.postsService.search(payload)
  }
}