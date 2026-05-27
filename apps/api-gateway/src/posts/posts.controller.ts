import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param, Query, DefaultValuePipe, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from '@app/contracts/posts/post.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../guards/decorator/public.decorater';
import { CreateCategoryDto } from '@app/contracts/posts/category.dto';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

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

  @Post()
  @UseInterceptors(FileInterceptor('cover_picture'))
  async create(
    @Body() request: CreatePostDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.create(request, coverPicture);
  }

  @Post(':_id')
  @UseInterceptors(FileInterceptor('cover_picture'))
  async update(
    @Param('_id') _id: string,
    @Body() request: CreatePostDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.update(_id, request, coverPicture);
  }

  @Public()
  @Get(':_id')
  async findOne(@Param('_id') _id: string) {
    return this.postsService.findOne(_id);
  }

  @Public()
  @Get()
  async find(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return await this.postsService.find(page)
  }
}