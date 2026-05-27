import { Controller } from '@nestjs/common';
import { ContactService } from './contact.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CONTACTS_PATTERNS } from '@app/contracts/contact/contacts.pattern';
import { UpdateStatusDto } from '@app/contracts/contact/update-status.dto';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @MessagePattern(CONTACTS_PATTERNS.CREATE)
  async create(@Payload() payload) {
    return await this.contactService.create(payload)
  }

  @MessagePattern(CONTACTS_PATTERNS.UPDATE)
  async update(@Payload() payload: {
    accessToken: string,
    _id: string,
    request: UpdateStatusDto
  }) {
    return await this.contactService.update(payload)
  }

  @MessagePattern(CONTACTS_PATTERNS.FIND_ONE)
  async findOne(@Payload() request) {
    return await this.contactService.findOne(request)
  }

  @MessagePattern(CONTACTS_PATTERNS.FIND)
  async find(@Payload() request: number) {
    return await this.contactService.find(request)
  }
}