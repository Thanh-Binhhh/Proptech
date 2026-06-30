import { Injectable } from '@nestjs/common';
import { PostsService } from '../posts.service';
import { JobsDb } from './job-posts.db';

@Injectable()
export class JobsService {
    constructor(
        private readonly jobsDb: JobsDb,
        private readonly postsService: PostsService,
    ) { }

    create = async (payload) => {
        return await this.postsService.create(payload, this.jobsDb)
    }

    update = async (payload) => {
        return await this.postsService.update(payload, this.jobsDb)
    }

    updateStatus = async (payload) => {
        return await this.postsService.updateStatus(payload, this.jobsDb)
    }

    /*==========================
      QUERY POSTS
    ============================*/
    findOne = async (_id) => {
        return await this.postsService.findOne(_id, this.jobsDb)
    }

    publicFindOne = async (_id) => {
        return await this.postsService.publicFindOne(_id, this.jobsDb)
    }

    find = async (payload) => {
        return await this.postsService.find(payload, this.jobsDb)
    }

    publicFind = async (page) => {
        return await this.postsService.publicFind(page, this.jobsDb)
    }
}