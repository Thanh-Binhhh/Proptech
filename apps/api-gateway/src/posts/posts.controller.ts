import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Param, Query, DefaultValuePipe, ParseIntPipe, UseGuards, Put, Req, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from '@app/contracts/posts/create-post.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../guards/decorator/public.decorater';
import { CreateCategoryDto } from '@app/contracts/posts/category.dto';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../guards/decorator/roles.decorator';
import { AUTH_ROLE_PATTERNS } from '@app/contracts/auth/auth.role-patterns';
import { UpdateStatusPostDto } from '@app/contracts/posts/update-post-status.dto';
import { UpdatePostDto } from '@app/contracts/posts/update-post.dto';

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
    @Req() req: Request,
    @Body() request: CreatePostDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.create(req, request, coverPicture);
  }

  @Patch(':_id')
  @UseInterceptors(FileInterceptor('cover_picture'))
  async update(
    @Req() req: Request,
    @Param('_id') _id: string,
    @Body() request: UpdatePostDto,
    @UploadedFile() coverPicture: Express.Multer.File
  ) {
    return await this.postsService.update(req, _id, request, coverPicture);
  }

  @UseGuards(RoleGuard)
  @Roles(AUTH_ROLE_PATTERNS.MANAGER)
  @Patch('status/:_id')
  async updateStatus(
    @Req() req: Request,
    @Param('_id') _id: string,
    @Body() request: UpdateStatusPostDto,
  ) {
    return await this.postsService.updateStatus(req, _id, request);
  }

  @Public()
  @Get(':_id')
  async findOne(
    @Req() req: Request,
    @Param('_id') _id: string
  ) {
    return this.postsService.findOne(req, _id);
  }

  @Get()
  async findByStatus(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('status') status: string
  ) {
    return this.postsService.findByStatus(page, status);
  }

  @Public()
  @Get()
  async find(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('categoryId') categoryId: string,
  ) {
    return await this.postsService.find(req, page, categoryId)
  }
}