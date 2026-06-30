import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { handleMicroserviceError } from '@app/contracts/helper-functions';
import { POSTS } from '../../../../libs/contracts/constant';
import { CATEGORIES_PATTERNS } from '@app/contracts/posts/categories/categories.patterns';
import { POSTS_PATTERNS } from '@app/contracts/posts/properties/properties.patterns';
import { NEWS_PATTERNS } from '@app/contracts/posts/news/news.patterns';
import { JOBS_PATTERNS } from '@app/contracts/posts/jobs/jobs.patterns';

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
  publicFindOneNews = async (_id) => {
    try {
      return await this.postsClient.send(NEWS_PATTERNS.PUBLIC_FIND_ONE, _id);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  publicFindNews = async (page, status) => {
    try {
      return await this.postsClient.send(NEWS_PATTERNS.PUBLIC_FIND, { page, status });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  /*==========================
    NEWS -- FOR INTERNAL COMPANY USE ONLY
  ============================*/
  createNews = async (author, request, coverPicture) => {
    try {
      return await this.postsClient.send(NEWS_PATTERNS.CREATE, { author, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  updateNews = async (actionBy, _id, request, coverPicture) => {
    try {
      return await this.postsClient.send(NEWS_PATTERNS.UPDATE, { actionBy, _id, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  findOneNews = async (_id) => {
    try {
      return await this.postsClient.send(NEWS_PATTERNS.FIND_ONE, _id);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  findNews = async (page, status) => {
    try {
      return await this.postsClient.send(NEWS_PATTERNS.FIND, { page, status });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  /*==========================
    JOBS -- FOR CUSTOMERS
  ============================*/
  publicFindJob = async (_id) => {
    try {
      return await this.postsClient.send(JOBS_PATTERNS.PUBLIC_FIND_ONE, _id);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  publicFindJobs = async (page, status) => {
    try {
      return await this.postsClient.send(JOBS_PATTERNS.PUBLIC_FIND, { page, status });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  /*==========================
    NEWS -- FOR INTERNAL COMPANY USE ONLY
  ============================*/
  createJob = async (author, request, coverPicture) => {
    try {
      return await this.postsClient.send(JOBS_PATTERNS.CREATE, { author, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  updateJob = async (actionBy, _id, request, coverPicture) => {
    try {
      return await this.postsClient.send(JOBS_PATTERNS.UPDATE, { actionBy, _id, request, coverPicture });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  findJob = async (_id) => {
    try {
      return await this.postsClient.send(JOBS_PATTERNS.FIND_ONE, _id);
    } catch (error) {
      handleMicroserviceError(error)
    }
  }

  findJobs = async (page, status) => {
    try {
      return await this.postsClient.send(JOBS_PATTERNS.FIND, { page, status });
    } catch (error) {
      handleMicroserviceError(error)
    }
  }
}