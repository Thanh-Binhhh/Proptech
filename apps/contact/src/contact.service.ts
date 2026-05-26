import { Injectable } from '@nestjs/common';
import { ContactDb } from './contact.db';
import { throwRpcException } from '@app/contracts/helper-functions';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactDb: ContactDb
  ) { }

  /*==========================
      CU CONTACTS
  ============================*/
  create = async (request) => {
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