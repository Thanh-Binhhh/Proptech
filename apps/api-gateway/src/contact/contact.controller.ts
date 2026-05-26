import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from '@app/contracts/contact/create-contact.dto';
import { UpdateStatusDto } from '@app/contracts/contact/update-status.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Post()
  async create(@Body() request: CreateContactDto) {
    return await this.contactService.create(request);
  }

  @Patch(':_id')
  async update(@Param('_id') _id: string, @Body() request: UpdateStatusDto) {
    return await this.contactService.update(_id, request);
  }

  @Get(':_id')
  async findOne(@Param('_id') _id: string) {
    return await this.contactService.findOne(_id);
  }

  @Get()
  async findAll() {
    return await this.contactService.find();
  }
}