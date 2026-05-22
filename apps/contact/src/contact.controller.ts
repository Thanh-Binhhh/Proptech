import { Controller, Get } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  getHello(): string {
    return this.contactService.getHello();
  }
}
