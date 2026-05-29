import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CloudinaryService } from './pictures/cloudinary.service';
import { PostsDb } from './posts.db';
import { throwRpcException } from '@app/contracts/helper-functions';
import { JwtService } from '@nestjs/jwt';
import { PostStatus_Stage1, PostStatus_Stage2, PostStatus_Stage3 } from './schemas/post-status';
import { AccountRole } from '@app/contracts/auth/register.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsDb: PostsDb,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  /*==========================
    CU POSTS
  ============================*/
  create = async (payload) => {
    const { accessToken, request, coverPicture } = payload

    try {
      // If there is a cover picture, upload it to Cloudinary.
      let cover_picture
      if (coverPicture)
        cover_picture = await this.uploadToCloudinary(coverPicture)

      // Get the author of the post.
      const author = await this.jwtService.verifyAsync(
        accessToken, {
        secret: process.env.SECRET_KEY
      })

      const response = await this.postsDb.create({
        ...request,
        cover_picture,
        authorId: author.sub
      })

      let message
      if (request.status === PostStatus_Stage1.DRAFT)
        message = 'Bản nháp đã được lưu.'
      else // PostStatus_Stage1.PENDING_APPROVAL
        message = 'Bài đăng sẽ được quản lý duyệt trước khi được xuất bản.'

      return {
        message,
        data: response
      };
    } catch (error) {
      // Delete the cover picture if post creation fails 
      // after a successful Cloudinary upload.
      if (coverPicture)
        await this.cloudinaryService.delete(coverPicture.publicId);

      return throwRpcException(
        500,
        'Tạo mới bài đăng thất bại. Vui lòng thử lại sau.',
      );
    }
  }

  update = async (payload) => {
    const { accessToken, _id, request, coverPicture } = payload

    const oldPost = await this.findOne(_id)
    if (!oldPost)
      throwRpcException(404, 'Không tìm thấy bài đăng tương ứng.')

    const actionBy = await this.extractUserFromToken(accessToken)
    if (actionBy.role !== AccountRole.MANAGER)
      throwRpcException(403, 'Người dùng không có quyền cập nhật trạng thái bài đăng')

    let cover_picture
    try {
      if (coverPicture)
        cover_picture = await this.uploadToCloudinary(coverPicture)

      await this.handleStatusTransition(_id, oldPost.data!.status, request, actionBy.sub)

      const response = await this.postsDb.update(
        _id,
        {
          ...request,
          cover_picture,
        }
      )

      if (cover_picture && oldPost.data!.cover_picture) {
        try {
          await this.cloudinaryService.delete(oldPost.data!.cover_picture.publicId)
        } catch (deleteOldImageError) {
          return throwRpcException(
            500,
            'Không thể xóa ảnh cũ của bài đăng.'
          );
        }
      }

      return {
        message: 'Cập nhật bài đăng thành công.',
        data: response
      };
    } catch (error) {
      if (cover_picture)
        await this.cloudinaryService.delete(cover_picture.publicId);

      if (error instanceof RpcException) {
        throw error;
      }

      return throwRpcException(
        500,
        'Cập nhật bài đăng thất bại. Vui lòng thử lại sau.',
      );
    }
  }

  updateStatus = async (payload) => {
    try {
      const { accessToken, _id, request } = payload

      const oldPost = await this.findOne(_id)
      const oldStatus = oldPost.data!.status

      const actionBy = await this.extractUserFromToken(accessToken)
      const { message, response } = await this.handleStatusTransition(_id, oldStatus, request, actionBy.sub)

      return {
        message,
        data: response
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      throwRpcException(
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
      throwRpcException(404, 'Không tìm thấy bài đăng tương ứng')

    return {
      message: 'Lấy thông tin bài đăng thành công',
      data: response
    }
  }

  findOneForContactService = async (_id) => {
    const response = await this.findOne(_id)

    return {
      _id: response.data!._id,
      title: response.data!.title,
      cover_picture: response.data!.cover_picture
    }
  }

  find = async (payload) => {
    const { accessToken, page, categoryId } = payload
    const limit = 12
    const skip = (page - 1) * limit
    const totalPosts = await this.postsDb.count(accessToken, categoryId)
    const totalPages = Math.ceil(totalPosts / limit)

    if (page > totalPages)
      return throwRpcException(409, "Số trang vượt quá giới hạn.")

    const response = await this.postsDb.find(skip, limit, categoryId, accessToken)
    if (!response)
      return { message: 'Chưa có bài đăng nào' }

    return {
      message: 'Lấy danh sách bài đăng thành công',
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
      },
      data: response
    }
  }

  /*==========================
    HELPER FUNCTIONS
  ============================*/
  private uploadToCloudinary = async (coverPicture) => {
    const uploadedImage = await this.cloudinaryService.upload(coverPicture)
    return {
      url: uploadedImage.url,
      publicId: uploadedImage.publicId,
    }
  }

  private extractUserFromToken = async (accessToken) => {
    const actionBy = await this.jwtService.verifyAsync(
      accessToken, {
      secret: process.env.SECRET_KEY
    })

    return {
      sub: actionBy.sub,
      role: actionBy.role,
    }
  }

  private handleStatusTransition = async (_id, oldStatus, request, actionBy) => {
    let messageForWrongStatus = 'Trạng thái bài đăng muốn cập nhật không hợp lệ'
    let message
    let response

    if (oldStatus === request.status)
      throwRpcException(400, 'Trạng thái bài đăng không thay đổi.')

    switch (request.status) {
      case PostStatus_Stage2.REJECTED:
        if (oldStatus !== PostStatus_Stage1.PENDING_APPROVAL)
          throwRpcException(400, messageForWrongStatus)

        if (!request.reason)
          throwRpcException(400, 'Bạn cần đưa ra nguyên nhân từ chối duyệt bài.')

        response = await this.createStatusHistory(_id, request, actionBy)
        message = 'Bạn đã từ chối xuất bản bài đăng này.'
        break

      case PostStatus_Stage2.PUBLISHED:
        if (oldStatus !== PostStatus_Stage1.PENDING_APPROVAL
          || oldStatus !== PostStatus_Stage3.PUBLISHED
        )
          throwRpcException(400, messageForWrongStatus)

        response = await this.createStatusHistory(_id, request, actionBy, true)
        message = 'Bạn đã duyệt thành công. Bài đăng sẽ được xuất hiện công khai.'
        break

      case PostStatus_Stage3.PRIVATE:
        if (oldStatus !== PostStatus_Stage2.PUBLISHED)
          throwRpcException(400, messageForWrongStatus)

        response = await this.createStatusHistory(_id, request, actionBy)
        message = 'Bài đăng từ đây sẽ không được hiển thị đến khách hàng.'
        break
    }

    await this.postsDb.updateStatus(_id, request.status)
    return { message, response }
  }

  private createStatusHistory = async (_id, request, actionBy, p = false) => {
    let payload = {
      status: request.status,
      reason: request.reason ?? undefined,
      actionBy: actionBy,
      publication_date: p ? new Date() : undefined
    }

    return await this.postsDb.createStatusHistory(_id, payload)
  }
}