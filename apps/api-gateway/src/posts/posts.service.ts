import { Inject, Injectable } from '@nestjs/common';
import { POSTS } from '../../../../libs/contracts/constant';
import { ClientProxy } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/posts.patterns';
import { getTokenFromCookies, handleMicroserviceError } from '@app/contracts/helper-functions';
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
  create = async (author, request, coverPicture) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.CREATE, { author, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  update = async (actionBy, _id, request, coverPicture) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.UPDATE, { actionBy, _id, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  updateStatus = async (actionBy, _id, request) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.UPDATE_STATUS, { actionBy, _id, request });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  findOne = async (req, _id) => {
    try {
      const accessToken = req.cookies?.access_token
      return await this.postsClient.send(POSTS_PATTERNS.FIND_ONE, { accessToken, _id });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  find = async (req, page, status, category) => {
    try {
      const accessToken = req.cookies?.access_token
      return await this.postsClient.send(POSTS_PATTERNS.FIND, { accessToken, page, status, category });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }
}