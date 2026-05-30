import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query, DefaultValuePipe, ParseIntPipe, Req } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../guards/decorator/public.decorater';
import { ContactService } from './contact.service';
import { CreateContactDto } from '@app/contracts/contact/create-contact.dto';
import { UpdateStatusDto } from '@app/contracts/contact/update-status.dto';

@UseGuards(AuthGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Public()
  @Post()
  async create(
    @Body() request: CreateContactDto
  ) {
    return await this.contactService.create(request);
  }

  @Patch(':_id')
  async update(
    @Req() req: Request,
    @Param('_id') _id: string,
    @Body() request: UpdateStatusDto
  ) {
    return await this.contactService.update(req, _id, request);
  }

  @Get(':_id')
  async findOne(
    @Param('_id') _id: string
  ) {
    return await this.contactService.findOne(_id);
  }

  @Get()
  async find(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return await this.contactService.find(page);
  }
}