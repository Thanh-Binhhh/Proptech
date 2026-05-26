import { Injectable } from '@nestjs/common';
import { CloudinaryService, UploadedImageResult } from './pictures/cloudinary.service';
import { PostsDb } from './posts.db';
import { PostStatus } from './schemas/posts.schema';
import { throwRpcException } from '@app/contracts/helper-functions';

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
    if (!picture)
      return throwRpcException(400, "Ảnh bìa bài đăng chưa được gửi lên.")

    let uploadedImage: UploadedImageResult | null = null;
    let message = 'Tạo mới bài đăng thành công.'

    try {
      // Upload cover picture to Cloudinary
      uploadedImage = await this.cloudinaryService.upload(picture)
      const cover_picture = {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
      }

      // Posts cannot be published before manager approval.
      if (request.status === PostStatus.PUBLISHED) {
        request.status = PostStatus.PENDING_APPROVAL
        message = 'Tạo mới bài đăng thành công. Cần chờ quản lý duyệt trước khi xuất bản'
      }

      const response = await this.postsDb.create({
        ...request,
        cover_picture,
      })

      return {
        message,
        data: response
      };
    } catch (error) {
      // Delete the cover picture if post creation fails 
      // after a successful Cloudinary upload.s
      if (uploadedImage)
        await this.cloudinaryService.delete(uploadedImage.publicId);

      return throwRpcException(
        500,
        'Tạo mới bài đăng thất bại. Vui lòng thử lại sau.',
      );
    }
  }

  update = async (_id, request, picture) => {
    if (!picture)
      return throwRpcException(400, "Ảnh bìa bài đăng chưa được gửi lên.")

    let message = 'Cập nhật bài đăng thành công.'
    let oldPost = await this.findOne(_id)
    if (!oldPost)
      return throwRpcException(
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

      if (request.status === PostStatus.PUBLISHED &&
        oldPost.data.status !== PostStatus.PUBLISHED) {
        message = 'Cập nhật bài đăng thành công. Cần chờ quản lý duyệt trước khi xuất bản'
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
          return throwRpcException(
            500,
            'Không thể cập nhật ảnh bài đăng.'
          );
        }
      }

      return {
        message,
        data: response
      };
    } catch (error) {
      if (uploadedImage)
        await this.cloudinaryService.delete(uploadedImage.publicId);

      return throwRpcException(
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
      return throwRpcException(404, 'Không tìm thấy bài đăng tương ứng')

    return {
      message: 'Lấy thông tin bài đăng thành công',
      data: response
    }
  }

  find = async (page) => {
    const limit = 12
    const skip = (page - 1) * limit

    const total = await this.postsDb.count()
    const totalPages = Math.ceil(total / limit)
    if (page > totalPages)
      return throwRpcException(409, "Tham số truy vấn không hợp lệ")

    const response = await this.postsDb.find(skip, limit)
    if (!response)
      return { message: 'Chưa có bài đăng nào' }

    return {
      message: 'Lấy danh sách bài đăng thành công',
      pagination: {
        page,
        limit,
        totalPages,
      },
      data: response
    }
  }

  /*==========================
     HELPER FUNCTIONS
   ============================*/
}
