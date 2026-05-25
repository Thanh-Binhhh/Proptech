import { Inject, Injectable } from '@nestjs/common';
import { POSTS } from '../constant';
import { ClientProxy } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/books.patterns';
import { handleMicroserviceError } from '@app/contracts/helper-functions';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POSTS)
    private readonly postService: ClientProxy
  ) { }

  create = async (request, coverPicture) => {
    try {
      return await this.postService.send(POSTS_PATTERNS.CREATE, { request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  update = async (_id, request, coverPicture) => {
    try {
      return await this.postService.send(POSTS_PATTERNS.UPDATE, { _id, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  findOne = async (_id) => {
    try {
      return await this.postService.send(POSTS_PATTERNS.FIND_ONE, { _id });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  find = async (page) => {
    try {
      return await this.postService.send(POSTS_PATTERNS.FIND, page);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  /*==========================
      HELPER FUNCTIONS
    ============================*/
}
