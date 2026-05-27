import { getTokenFromCookies, handleMicroserviceError } from '@app/contracts/helper-functions';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONTACT } from '../../../../libs/contracts/constant';
import { CONTACTS_PATTERNS } from '@app/contracts/contact/contacts.pattern';

@Injectable()
export class ContactService {
    constructor(
        @Inject(CONTACT)
        private readonly contactService: ClientProxy
    ) { }

    create = async (request) => {
        try {
            return await this.contactService.send(CONTACTS_PATTERNS.CREATE, request)
        } catch (error) {
            handleMicroserviceError(error)
        }
    }

    update = async (req, _id, request) => {
        try {
            const accessToken = await getTokenFromCookies(req, 'access')
            return await this.contactService.send(CONTACTS_PATTERNS.UPDATE, { accessToken, _id, request })
        } catch (error) {
            handleMicroserviceError(error)
        }
    }

    findOne = async (_id) => {
        try {
            return await this.contactService.send(CONTACTS_PATTERNS.FIND_ONE, _id);
        } catch (error) {
            handleMicroserviceError(error)
        }
    }

    find = async (page) => {
        try {
            return await this.contactService.send(CONTACTS_PATTERNS.FIND, page);
        } catch (error) {
            handleMicroserviceError(error)
        }
    }
}