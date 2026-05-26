import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from '@app/contracts/posts/post.dto';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

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

  @Get(':_id')
  async findOne(@Param('_id') _id: string) {
    return this.postsService.findOne(_id);
  }

  @Get()
  async find(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return await this.postsService.find(page)
  }
}