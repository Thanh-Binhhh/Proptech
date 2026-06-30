import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { NewsDb } from './news-posts.db';
import { PostsService } from '../posts.service';

@Injectable()
export class NewsService {
    constructor(
        private readonly newsDb: NewsDb,
        private readonly postsService: PostsService,
    ) { }

    create = async (payload) => {
        return await this.postsService.create(payload, this.newsDb)
    }

    update = async (payload) => {
        return await this.postsService.update(payload, this.newsDb)
    }

    updateStatus = async (payload) => {
        return await this.postsService.updateStatus(payload, this.newsDb)
    }

    /*==========================
      QUERY POSTS
    ============================*/
    findOne = async (_id) => {
        return await this.postsService.findOne(_id, this.newsDb)
    }

    publicFindOne = async (_id) => {
        return await this.postsService.publicFindOne(_id, this.newsDb)
    }

    find = async (payload) => {
        return await this.postsService.find(payload, this.newsDb)
    }

    publicFind = async (page) => {
        return await this.postsService.publicFind(page, this.newsDb)
    }
}