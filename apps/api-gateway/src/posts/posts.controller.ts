import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param, Query, DefaultValuePipe, ParseIntPipe, UseGuards, Put, Req, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from '@app/contracts/posts/properties/create-post.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../guards/decorator/public.decorater';
import { CreateCategoryDto } from '@app/contracts/posts/categories/category.dto';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../guards/decorator/roles.decorator';
import { AUTH_ROLE_PATTERNS } from '@app/contracts/auth/auth.role-patterns';
import { UpdateStatusPostDto } from '@app/contracts/posts/update-post-status.dto';
import { UpdatePostDto } from '@app/contracts/posts/properties/update-post.dto';
import { User } from '../guards/decorator/me.decorater';
import { CreateNewsDto } from '@app/contracts/posts/news/create-news.dto';
import { UpdateNewsDto } from '@app/contracts/posts/news/update-news.dto';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  /*==========================
    CATEGORIES
  ============================*/
  @Post('categories')
  async createCategory(
    @Body() request: CreateCategoryDto,
  ) {
    return await this.postsService.createCategory(request);
  }

  @Put('categories/:_id')
  async editCategory(
    @Param('_id') _id: string,
    @Body() request: CreateCategoryDto,
  ) {
    return await this.postsService.editCategory(_id, request);
  }

  @Get('categories')
  async findCategories() {
    return await this.postsService.findCategories();
  }

  /*==========================
    POSTS -- FOR CUSTOMERS
  ============================*/
  @Public()
  @Get('properties/public/search')
  async publicSearch(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('keyword') keyword: string,
  ) {
    return this.postsService.publicSearch(page, keyword);
  }

  @Public()
  @Get('properties/public/:_id')
  async publicFindOne(
    @Param('_id') _id: string
  ) {
    return this.postsService.publicFindOne(_id);
  }

  @Public()
  @Get('properties/public')
  async publicFind(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return await this.postsService.publicFind(page)
  }

  /*==========================
    POSTS -- FOR INTERNAL COMPANY USE ONLY
  ============================*/
  @Post('properties')
  @UseInterceptors(FileInterceptor('cover_picture'))
  async create(
    @User() author,
    @Body() request: CreatePostDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.create(author, request, coverPicture);
  }

  @Patch('properties/:_id')
  @UseInterceptors(FileInterceptor('cover_picture'))
  async update(
    @User() actionBy,
    @Param('_id') _id: string,
    @Body() request: UpdatePostDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.update(actionBy, _id, request, coverPicture);
  }

  @UseGuards(RoleGuard)
  @Roles(AUTH_ROLE_PATTERNS.MANAGER)
  @Patch('status/:_id')
  async updateStatus(
    @User() actionBy,
    @Param('_id') _id: string,
    @Body() request: UpdateStatusPostDto,
  ) {
    return await this.postsService.updateStatus(actionBy, _id, request);
  }

  @Get('properties/search')
  async search(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('keyword') keyword: string,
  ) {
    return this.postsService.search(page, keyword);
  }

  @Get('properties/:_id')
  async findOne(
    @Param('_id') _id: string
  ) {
    return this.postsService.findOne(_id);
  }

  @Get('properties')
  async find(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('status') status: string,
    @Query('category') category: string,
  ) {
    return await this.postsService.find(page, status, category)
  }

  /*==========================
    NEWS -- FOR CUSTOMERS
  ============================*/
  @Public()
  @Get('news/public/:_id')
  async publicFindANews(
    @Param('_id') _id: string
  ) {
    return this.postsService.publicFindOneNews(_id);
  }

  @Public()
  @Get('news/public')
  async publicFindNews(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('status') status: string,
  ) {
    return await this.postsService.publicFindNews(page, status)
  }

  /*==========================
    NEWS -- FOR INTERNAL COMPANY USE ONLY
  ============================*/
  @Post('news')
  @UseInterceptors(FileInterceptor('cover_picture'))
  async createNews(
    @User() author,
    @Body() request: CreateNewsDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.createNews(author, request, coverPicture);
  }

  @Patch('news/:_id')
  @UseInterceptors(FileInterceptor('cover_picture'))
  async updateNews(
    @User() actionBy,
    @Param('_id') _id: string,
    @Body() request: UpdateNewsDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.updateNews(actionBy, _id, request, coverPicture);
  }

  @Get('news/:_id')
  async findOneNews(
    @Param('_id') _id: string
  ) {
    return this.postsService.findOneNews(_id);
  }

  @Get('news')
  async findNews(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('status') status: string,
  ) {
    return await this.postsService.findNews(page, status)
  }

  /*==========================
    JOB -- FOR CUSTOMERS
  ============================*/
  @Public()
  @Get('jobs/public/:_id')
  async publicFindJob(
    @Param('_id') _id: string
  ) {
    return this.postsService.publicFindJob(_id);
  }

  @Public()
  @Get('jobs/public')
  async publicFindJobs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('status') status: string,
  ) {
    return await this.postsService.publicFindJobs(page, status)
  }

  /*==========================
    JOB -- FOR INTERNAL COMPANY USE ONLY
  ============================*/
  @Post('jobs')
  @UseInterceptors(FileInterceptor('cover_picture'))
  async createJob(
    @User() author,
    @Body() request: CreateNewsDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.createJob(author, request, coverPicture);
  }

  @Patch('jobs/:_id')
  @UseInterceptors(FileInterceptor('cover_picture'))
  async updateJob(
    @User() actionBy,
    @Param('_id') _id: string,
    @Body() request: UpdateNewsDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.updateJob(actionBy, _id, request, coverPicture);
  }

  @Get('jobs/:_id')
  async findOneJob(
    @Param('_id') _id: string
  ) {
    return this.postsService.findJob(_id);
  }

  @Get('jobs')
  async findJob(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('status') status: string,
  ) {
    return await this.postsService.findJobs(page, status)
  }
}