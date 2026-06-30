import { Inject, Injectable } from '@nestjs/common';
import { POSTS } from '../../../../libs/contracts/constant';
import { ClientProxy } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/posts.patterns';
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
    POSTS -- FOR CUSTOMERS
  ============================*/
  publicFindOne = async (_id) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.PUBLIC_FIND_ONE, _id);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  publicFind = async (page) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.PUBLIC_FIND, page);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  publicSearch = async (page, keyword) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.PUBLIC_SEARCH, { page, keyword });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  /*==========================
    POSTS -- FOR INTERNAL COMPANY USE ONLY
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

  findOne = async (_id) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.FIND_ONE, _id);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  find = async (page, status, category) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.FIND, { page, status, category });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  search = async (page, keyword) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.SEARCH, { page, keyword });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  /*==========================
    NEWS -- FOR CUSTOMERS
  ============================*/
  publicFinANews = async (_id) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.PUBLIC_FIND_ONE, _id);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  publicFindNews = async (page) => {
    try {
      return await this.postsClient.send(POSTS_PATTERNS.PUBLIC_FIND, page);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }
}