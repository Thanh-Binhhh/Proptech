import { Injectable, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { buildMap, throwRpcException } from '@app/contracts/helper-functions';
import { AUTH } from 'libs/contracts/constant';
import { AUTH_PATTERNS } from '@app/contracts/auth/auth.patterns';
import { AccountRole } from 'apps/auth/src/schemas/register.schema';
import { PostsDb } from './posts.db';
import { CloudinaryService } from './pictures/cloudinary.service';
import { ElasticSearchService } from './elasticsearch.service';
import { PostStatus_Stage1, PostStatus_Stage2, PostStatus_Stage3 } from './properties-posts/schemas/post-status';

@Injectable()
export class PostsService {
  private readonly LIMIT = 12;

  constructor(
    private readonly postsDb: PostsDb,
    private readonly cloudinaryService: CloudinaryService,
    private readonly elasticsearchService: ElasticSearchService,

    @Inject(AUTH)
    private readonly authService: ClientProxy
  ) { }

  /*==========================
    CU POSTS
  ============================*/
  create = async (payload, db, dbName?) => {
    const { author, request, coverPicture } = payload

    try {
      // If there is a cover picture, upload it to Cloudinary.
      let cover_picture
      if (coverPicture)
        cover_picture = await this.uploadToCloudinary(coverPicture)

      const response = await db.create({
        ...request,
        cover_picture,
        authorId: author.sub
      })

      if (dbName && dbName === 'posts')
        await this.syncPostToElasticsearch(response, 'create');

      let message
      if (!request.status || request.status === PostStatus_Stage1.DRAFT)
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

  update = async (payload, db, dbName?) => {
    const { actionBy, _id, request, coverPicture } = payload
    let cover_picture

    try {
      const oldPost = await this.findOne(_id, db)

      // Only managers are allowed to 
      // update post statuses and modify published posts.
      if (actionBy.role !== AccountRole.MANAGER) {
        if (oldPost.data.status === PostStatus_Stage2.PUBLISHED)
          throwRpcException(403, 'Chỉ quản lý mới có thể cập nhật bài đăng đã xuất bản.')
        else if (oldPost.data.status !== request.status
          && oldPost.data.status !== PostStatus_Stage1.DRAFT
          && oldPost.data.status !== PostStatus_Stage1.PENDING_APPROVAL
        )
          throwRpcException(403, 'Chỉ quản lý mới có thể cập nhật trạng thái bài đăng.')
      }

      if (coverPicture)
        cover_picture = await this.uploadToCloudinary(coverPicture)

      await this.handleStatusTransition(
        { _id, oldStatus: oldPost.data!.status, request, actionBy: actionBy.sub },
        db,
        dbName
      )
      const response = await db.update(
        _id,
        {
          ...request,
          cover_picture,
        }
      )

      if (dbName && dbName === 'posts')
        await this.syncPostToElasticsearch(response, 'update');

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

      // Format the response
      const author = await firstValueFrom(
        this.authService.send(AUTH_PATTERNS.FIND_ONE, { _id: response!.authorId }),
      );

      const { authorId, ...rest } = response!.toObject()

      return {
        message: 'Cập nhật bài đăng thành công.',
        data: {
          ...rest,
          author
        }
      }
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

  updateStatus = async (payload, db, dbName?) => {
    try {
      const { actionBy, _id, request } = payload

      const oldPost = await this.findOne(_id, db)
      const oldStatus = oldPost.data.status
      const { message, response } = await this.handleStatusTransition(
        { _id, oldStatus, request, actionBy: actionBy.sub },
        db,
        dbName
      )

      const employee = await firstValueFrom(
        this.authService.send(AUTH_PATTERNS.FIND_ONE, { _id: response.actionBy }),
      );

      response.actionBy = employee

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
  findOne = async (_id, db) => {
    const response = await db.findOne(_id, true)
    if (!response)
      throwRpcException(404, 'Không tìm thấy bài đăng tương ứng.')

    // Get author of the posts
    const author = await firstValueFrom(
      this.authService.send(AUTH_PATTERNS.FIND_ONE, { _id: response!.authorId }),
    );

    const { authorId, ...res } = response!.toObject()
    return {
      message: 'Lấy thông tin chi tiết bài đăng cho nội bộ công ty thành công.',
      data: {
        ...res,
        author
      }
    }
  }

  publicFindOne = async (_id, db) => {
    const response = await db.findOne(_id)
    if (!response)
      throwRpcException(404, 'Không tìm thấy bài đăng tương ứng.')

    const { authorId, ...res } = response!.toObject()
    return {
      message: 'Lấy thông tin chi tiết bài đăng thành công.',
      data: {
        ...res,
      }
    }
  }

  find = async (payload, db, dbName?) => {
    const { page, status, category } = payload
    const skip = (page - 1) * this.LIMIT

    const statusNumber = await db.countAllStatus()

    const totalPosts =
      dbName === 'posts'
        ? await db.count(true, status, category)
        : await db.count(true, status);

    if (totalPosts === 0) {
      return {
        message: 'Chưa có bài đăng nào.',
        data: {
          status: statusNumber
        }
      }
    }

    const totalPages = Math.ceil(totalPosts / this.LIMIT)
    if (page > totalPages)
      return throwRpcException(409, "Số trang vượt quá giới hạn.")

    const response =
      dbName === 'posts'
        ? await db.find(skip, this.LIMIT, true, status, category)
        : await db.find(skip, this.LIMIT, true, status)

    const posts = await this.getAuthors(response)

    return {
      message: 'Lấy danh sách bài đăng cho nội bộ công ty thành công.',
      pagination: {
        page,
        limit: this.LIMIT,
        totalPosts,
        totalPages,
      },
      data: {
        status: statusNumber,
        posts
      }
    }
  }

  publicFind = async (page, db) => {
    const skip = (page - 1) * this.LIMIT

    const totalPosts = await db.count()
    if (totalPosts === 0)
      return { message: 'Chưa có bài đăng nào được xuất bản.' }

    const totalPages = Math.ceil(totalPosts / this.LIMIT)
    if (page > totalPages)
      return throwRpcException(409, "Số trang vượt quá giới hạn.")

    const response = await db.find(skip, this.LIMIT)

    return {
      message: 'Lấy danh sách bài đăng thành công.',
      pagination: {
        page,
        limit: this.LIMIT,
        totalPosts,
        totalPages,
      },
      data: {
        posts: response
      }
    }
  }

  /*==========================
    HELPER FUNCTIONS
  ============================*/
  private syncPostToElasticsearch = async (post, action = 'index') => {
    try {
      if (!post) return;

      await this.elasticsearchService.indexPost({
        _id: String(post._id),
        title: post.title,
        developer: post.developer,
        location: post.location,
        region: post.region,
        status: post.status,
        updatedAt: post.updatedAt || new Date(),
      });
    } catch (error) {
      console.error(`Lỗi khi đồng bộ lên Elasticsearch - [${action}]:`, error);
    }
  };

  private uploadToCloudinary = async (coverPicture) => {
    const uploadedImage = await this.cloudinaryService.upload(coverPicture)
    return {
      url: uploadedImage.url,
      publicId: uploadedImage.publicId,
    }
  }

  private handleStatusTransition = async (payload, db, dbName) => {
    const { _id, oldStatus, request, actionBy } = payload
    let messageForWrongStatus = 'Trạng thái bài đăng muốn cập nhật không hợp lệ'
    let message
    let response

    if (oldStatus === request.status)
      throwRpcException(400, 'Trạng thái bài đăng không thay đổi.')

    switch (request.status) {
      case PostStatus_Stage1.PENDING_APPROVAL:
        if (oldStatus !== PostStatus_Stage1.DRAFT)
          throwRpcException(400, messageForWrongStatus)

        response = await this.createStatusHistory(_id, request, actionBy)
        message = 'Bài đăng đã vào trạng thái chờ duyệt.'
        break

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
          && oldStatus !== PostStatus_Stage3.PRIVATE
        ) {
          console.log(oldStatus)
          console.log(PostStatus_Stage1.PENDING_APPROVAL)
          throwRpcException(400, messageForWrongStatus)
        }
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

    const updatedPost = await db.updateStatus(_id, request.status)

    if (dbName && dbName === 'posts')
      await this.syncPostToElasticsearch(updatedPost, 'updateStatus');

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

  getAuthors = async (response: any[]) => {
    const authorIds: string[] = [
      ...new Set(
        response
          .map((post) => post.authorId?.toString())
          .filter((id): id is string => typeof id === 'string'),
      ),
    ];

    const [authorMap] = await Promise.all([
      buildMap(
        authorIds,
        AUTH_PATTERNS.FIND_ONE,
        this.authService,
      ),
    ]);

    return response.map((post) => {
      const { authorId, ...rest } = post;

      const author = authorMap.get(authorId?.toString());

      return {
        ...rest,
        ...(author ? { author } : {}),
      };
    });
  };
}