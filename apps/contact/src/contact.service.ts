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
    if (request.propertyId) {
      try {
        await firstValueFrom(
          this.postService.send(POSTS_PATTERNS.FIND_ONE, request.propertyId),
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

  update = async (request) => {
    const { accessToken, _id, status } = request
    await this.findOne(_id)

    const payload = await this.jwtService.verifyAsync(
      accessToken, {
      secret: process.env.SECRET_KEY
    })

    const response = await this.contactDb.update(_id, status, payload.sub)

    return {
      message: 'Cập nhật trang thái yêu cầu tư vấn thành công',
      data: response
    }
  }

  /*==========================
      QUERY CONTACTS
  ============================*/
  findOne = async (_id) => {
    let property
    let employee

    const response = await this.contactDb.findOne(_id)
    if (!response)
      return throwRpcException(404, 'Không tìm thấy yêu cầu tư vấn tương ứng')

    if (response.propertyId) {
      property = await firstValueFrom(
        this.postService.send(POSTS_PATTERNS.FIND_ONE_FOR_CONTACT, response.propertyId),
      );
    }

    if (response.employeeId) {
      employee = await firstValueFrom(
        this.authService.send(AUTH_PATTERNS.FIND_ONE, response.employeeId),
      );
    }

    return {
      message: 'Lấy thông tin yêu cầu tư vấn thành công',
      data: {
        response,
        property,
        employee
      }

    }
  }

  find = async (page) => {
    const limit = 12
    const skip = (page - 1) * limit

    const total = await this.contactDb.count()
    const totalPages = Math.ceil(total / limit)
    if (page > totalPages)
      return throwRpcException(409, "Tham số truy vấn không hợp lệ")

    const response = await this.contactDb.find(skip, limit);
    if (!response) {
      return {
        message: 'Khách hàng chưa gửi yêu cầu nào.',
      };
    }

    // Get set of propertyId and set of employeeId from contact
    const propertyIds = [
      ...new Set(
        response
          .map((contact) => contact.propertyId?.toString())
          .filter(Boolean),
      ),
    ];

    const employeeIds = [
      ...new Set(
        response
          .map((contact) => contact.employeeId?.toString())
          .filter(Boolean),
      ),
    ];

    // Get details posts and employees from posts and auth services
    const [propertyMap, employeeMap] = await Promise.all([
      buildMap(
        propertyIds,
        POSTS_PATTERNS.FIND_ONE_FOR_CONTACT,
        this.postService,
      ),

      buildMap(
        employeeIds,
        AUTH_PATTERNS.FIND_ONE,
        this.authService,
      ),
    ]);

    const data = response.map((contact) => {
      const propertyId = contact.propertyId?.toString();
      const employeeId = contact.employeeId?.toString();
      const property = propertyId ? propertyMap.get(propertyId) : null;
      const employee = employeeId ? employeeMap.get(employeeId) : null;

      return {
        ...contact,
        ...(property ? { property } : {}),
        ...(employee ? { employee } : {}),
      };
    });

    const { propertyId, employeeId, ...res } = data

    return {
      message: 'Lấy danh sách yêu cầu tư vấn từ khách hàng thành công',
      pagination: {
        page,
        limit,
        totalPages,
      },
      data: res,
    };
  };

  /*==========================
      HELPER FUNCTIONS
  ============================*/

}