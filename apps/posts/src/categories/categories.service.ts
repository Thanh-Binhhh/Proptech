import { Injectable } from '@nestjs/common';
import { throwRpcException } from '@app/contracts/helper-functions';
import { CategoriesDb } from './categories.db';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesDb: CategoriesDb,
  ) { }

  create = async (request) => {
    const response = await this.categoriesDb.create(request)

    return {
      message: 'Tạo mới danh mục thành công.',
      data: response
    };
  }

  edit = async (_id, request) => {
    let response = await this.categoriesDb.findOne(_id)
    if (!response)
      throwRpcException(404, 'Không tìm thấy danh mục tương ứng.')

    response = await this.categoriesDb.edit(_id, request.name)
    return {
      message: 'Chỉnh sửa danh mục thành công.',
      data: response
    };

  }

  find = async () => {
    const response = await this.categoriesDb.find()
    if (!response)
      return { message: 'Chưa có danh mục nào.' }

    return {
      message: 'Lấy danh sách danh mục thành công.',
      data: response
    }
  }
}