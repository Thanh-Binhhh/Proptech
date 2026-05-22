import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  getHello(): string {
    return 'Hello World!';
  }

  create = async (request) => {
    return request;
  }
}
