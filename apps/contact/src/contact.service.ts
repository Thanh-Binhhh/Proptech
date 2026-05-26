import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ContactDb } from './contact.db';
import { throwRpcException } from '@app/contracts/helper-functions';
import { POSTS } from 'libs/contracts/constant';
import { POSTS_PATTERNS } from '@app/contracts/posts/books.patterns';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactDb: ContactDb,

    @Inject(POSTS)
    private readonly postService: ClientProxy
  ) { }

  /*==========================
      CU CONTACTS
  ============================*/
  create = async (request) => {
    if (request.propertyId) {
      // await this.postService.send(POSTS_PATTERNS.FIND_ONE, request.propertyId);
    }

    const response = await this.contactDb.create(request)

    return {
      message: "Chúng tôi sẽ sớm liên lạc với quý khách. Cảm ơn quý khách vì lựa chọn tin tưởng",
      data: response
    }
  }

  update = async (_id, request) => {
    await this.findOne(_id)

    const response = await this.contactDb.update(_id, request.status)

    return {
      message: 'Cập nhật trang thái yêu cầu tư vấn thành công',
      data: response
    }
  }

  /*==========================
      QUERY CONTACTS
  ============================*/
  findOne = async (_id) => {
    const response = await this.contactDb.findOne(_id)
    if (!response)
      return throwRpcException(404, 'Không tìm thấy yêu cầu tư vấn tương ứng')

    return {
      message: 'Lấy thông tin yêu cầu tư vấn thành công',
      data: response
    }
  }

  find = async () => {
    const response = await this.contactDb.find()

    if (!response)
      return { message: 'Khách hàng chưa gửi yêu cầu nào.' }

    return {
      message: "Lấy danh sách yêu cầu tư vấn từ khách hàng thành công",
      data: response
    }
  }
}