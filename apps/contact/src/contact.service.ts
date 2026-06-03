import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ContactDb } from './contact.db';
import { buildMap, throwRpcException } from '@app/contracts/helper-functions';
import { firstValueFrom } from 'rxjs';
import { AUTH, POSTS } from 'libs/contracts/constant';
import { POSTS_PATTERNS } from '@app/contracts/posts/posts.patterns';
import { AUTH_PATTERNS } from '@app/contracts/auth/auth.patterns';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactDb: ContactDb,
    private readonly jwtService: JwtService,

    @Inject(AUTH)
    private readonly authService: ClientProxy,

    @Inject(POSTS)
    private readonly postService: ClientProxy
  ) { }

  /*==========================
      CU CONTACTS
  ============================*/
  create = async (request) => {
    if (request.postId) {
      try {
        const _id = request.postId
        await firstValueFrom(
          this.postService.send(POSTS_PATTERNS.FIND_ONE, { _id }),
        );
      } catch (error: any) {
        throwRpcException(error!.statusCode, error?.message,);
      }
    }

    const response = await this.contactDb.create(request)

    return {
      message: "Chúng tôi sẽ sớm liên lạc với quý khách. Cảm ơn quý khách vì lựa chọn tin tưởng",
      data: response
    }
  }

  update = async (payload) => {
    const { accessToken, _id, request } = payload
    let response = await this.findOne(_id)

    const resolver = await this.jwtService.verifyAsync(
      accessToken, {
      secret: process.env.SECRET_KEY
    })
    response = await this.contactDb.update(_id, request.status, resolver.sub)

    return {
      message: 'Cập nhật trạng thái yêu cầu tư vấn thành công',
      data: response
    }
  }

  /*==========================
      QUERY CONTACTS
  ============================*/
  findOne = async (_id) => {
    const response = await this.contactDb.findOne(_id)
    if (!response)
      return throwRpcException(404, 'Không tìm thấy yêu cầu tư vấn tương ứng.')

    const [data] = await this.getContactsDetail([response]);

    return {
      message: 'Lấy thông tin chi tiết yêu cầu tư vấn thành công.',
      data
    }
  }

  find = async (page) => {
    const limit = 12
    const skip = (page - 1) * limit

    const totalMessages = await this.contactDb.count()
    if (totalMessages === 0) {
      return {
        message: 'Khách hàng chưa gửi yêu cầu nào.',
      };
    }

    const totalPages = Math.ceil(totalMessages / limit)
    if (page > totalPages)
      return throwRpcException(409, "Tham số truy vấn không hợp lệ")

    const response = await this.contactDb.find(skip, limit);

    // Count number of contact requests of eachh status
    const responseStatus = await this.contactDb.countAllStatus()

    // Get set of postId and set of employeeId from contact
    const data = await this.getContactsDetail(response)

    return {
      message: 'Lấy danh sách yêu cầu tư vấn từ khách hàng thành công',
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages,
      },
      data: {
        status: responseStatus,
        contacts: data
      }
    };
  };

  /*==========================
      HELPER FUNCTIONS
  ============================*/
  private getContactsDetail = async (response) => {
    const resolverIds: string[] = [
      ...new Set(
        response
          .map((contact) => contact.resolvedBy?.toString())
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const postIds: string[] = [
      ...new Set(
        response
          .map((contact) => contact.post?.toString())
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const [resolverMap, postMap] = await Promise.all([
      buildMap(
        resolverIds,
        AUTH_PATTERNS.FIND_ONE,
        this.authService,
      ),

      buildMap(
        postIds,
        POSTS_PATTERNS.FIND_ONE_FOR_CONTACT,
        this.postService,
      ),
    ]);

    return response.map((contact) => ({
      ...contact,
      post: postMap.get(contact.post?.toString()),
      resolvedBy: resolverMap.get(contact.resolvedBy?.toString())
    }));
  };
}