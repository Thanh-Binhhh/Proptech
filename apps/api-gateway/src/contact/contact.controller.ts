import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

      @Post()
      create(@Body() request: CreateContactDto) {
        return this.contactService.create(request);
      }

    //   @Get()
    //   findAll() {
    //     return this.contactService.find();
    //   }

    //   @Get(':id')
    //   findOne(@Param('id') id: string) {
    //     return this.contactService.findOne(id);
    //   }

    //   @Patch(':id')
    //   update(@Param('id') id: string, @Body() request: UpdateContactDto) {
    //     return this.contactService.update(+id, request);
    //   }
}
