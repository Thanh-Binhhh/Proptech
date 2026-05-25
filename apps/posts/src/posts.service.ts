import { Injectable } from '@nestjs/common';
import { CloudinaryService, UploadedImageResult } from './pictures/cloudinary.service';
import { PostsDb } from './posts.db';
import { RpcException } from '@nestjs/microservices';
import { PostStatus } from './schemas/posts.schema';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsDb: PostsDb,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  /*==========================
    CU POSTS
  ============================*/
  create = async (request, picture) => {
    let uploadedImage: UploadedImageResult | null = null;
    let message = 'Tạo mới bài đăng thành công.'

    try {
      uploadedImage = await this.cloudinaryService.upload(picture)
      const cover_picture = {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
      }

      const response = await this.postsDb.create({
        ...request,
        cover_picture,
      })

      if (response.status === PostStatus.PUBLISHED)
        message = 'Tạo mới bài đăng thành công. Cần chờ quản lý duyệt trước khi xuất bản'

      return {
        message,
        data: response
      };
    } catch (error) {
      if (uploadedImage)
        await this.cloudinaryService.delete(uploadedImage.publicId);

      return this.throwRpcException(
        500,
        'Tạo mới bài đăng thất bại. Vui lòng thử lại sau.',
      );
    }
  }

  update = async (_id, request, picture) => {
    let oldPost = await this.findOne(_id)
    if (!oldPost)
      return this.throwRpcException(
        404,
        "Không tìm thấy bài đăng tương ứng."
      )

    let uploadedImage: UploadedImageResult | null = null;

    try {
      uploadedImage = await this.cloudinaryService.upload(picture)
      const cover_picture = {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
      }

      const response = await this.postsDb.update(
        _id,
        {
          ...request,
          cover_picture,
        }
      )

      if (uploadedImage && oldPost.data) {
        try {
          await this.cloudinaryService.delete(
            oldPost.data.cover_picture.publicId,
          );
        } catch (deleteOldImageError) {
          return this.throwRpcException(
            500,
            'Không thể cập nhật ảnh bài đăng.'
          );
        }
      }

      return {
        message: 'Cập nhật bài đăng thành công. Cần chờ quản lý duyệt trước tái xuất bản',
        data: response
      };
    } catch (error) {
      if (uploadedImage)
        await this.cloudinaryService.delete(uploadedImage.publicId);

      return this.throwRpcException(
        500,
        'Cập nhật bài đăng thất bại. Vui lòng thử lại sau.',
      );
    }
  }

  /*==========================
      QUERY POSTS
  ============================*/
  findOne = async (_id) => {
    const response = await this.postsDb.findOne(_id)
    if (!response)
      return this.throwRpcException(404, 'Không tìm thấy bài đăng tương ứng')

    return {
      message: 'Lấy thông tin bài đăng thành công',
      data: response
    }
  }

  find = async () => {
    const response = await this.postsDb.find()
    if (!response)
      return { message: 'Chưa có bài đăng nào' }

    return {
      message: 'Lấy danh sách bài đăng thành công',
      data: response
    }
  }

  /*==========================
     HELPER FUNCTIONS
   ============================*/
  private throwRpcException = (statusCode, message): never => {
    throw new RpcException({
      statusCode,
      message
    })
  }
}
