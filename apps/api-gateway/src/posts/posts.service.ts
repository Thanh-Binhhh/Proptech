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
  create = async (req, request, coverPicture) => {
    try {
      const accessToken = await getTokenFromCookies(req, 'access')
      return await this.postsClient.send(POSTS_PATTERNS.CREATE, { accessToken, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  update = async (req, _id, request, coverPicture) => {
    try {
      const accessToken = await getTokenFromCookies(req, 'access')
      return await this.postsClient.send(POSTS_PATTERNS.UPDATE, { accessToken, _id, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  updateStatus = async (req, _id, request) => {
    try {
      const accessToken = await getTokenFromCookies(req, 'access')
      return await this.postsClient.send(POSTS_PATTERNS.UPDATE_STATUS, { accessToken, _id, request });
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

  find = async (req, page, categoryId) => {
    try {
      const accessToken = req.cookies?.access_token
      return await this.postsClient.send(POSTS_PATTERNS.FIND, { accessToken, page, categoryId });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }
}