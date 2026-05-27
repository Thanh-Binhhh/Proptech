import { Inject, Injectable } from '@nestjs/common';
import { POSTS } from '../../../../libs/contracts/constant';
import { ClientProxy } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/books.patterns';
import { handleMicroserviceError } from '@app/contracts/helper-functions';
import { CATEGORIES_PATTERNS } from '@app/contracts/posts/categories.patterns';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POSTS)
    private readonly postsClient: ClientProxy
  ) { }

  /*==========================
    CATEGORIES
  ============================*/
  createCategory = async (request) => {
    try {
      return await this.postsClient.send(CATEGORIES_PATTERNS.CREATE, request);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  editCategory = async (_id, request) => {
    try {
      return await this.postsClient.send(CATEGORIES_PATTERNS.UPDATE, { _id, request });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  findCategories = async () => {
    try {
      return await this.postsClient.send(CATEGORIES_PATTERNS.FIND, {});
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  /*==========================
    POSTS
  ============================*/
  create = async (request, coverPicture) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.CREATE, { request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  update = async (_id, request, coverPicture) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.UPDATE, { _id, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  findOne = async (_id) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.FIND_ONE, _id);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  find = async (page) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.FIND, page);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }
}