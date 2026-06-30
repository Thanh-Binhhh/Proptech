import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PropertyPostsDb } from './properties-posts.db';
import { throwRpcException } from '@app/contracts/helper-functions';
import { ElasticSearchService } from '../elasticsearch.service';
import { PostsService } from '../posts.service';

@Injectable()
export class PropertyPostsService implements OnApplicationBootstrap {

  private readonly dbName = 'posts';
  private readonly LIMIT = 12;

  constructor(
    private readonly postsDb: PropertyPostsDb,
    private readonly postsService: PostsService,
    private readonly elasticsearchService: ElasticSearchService,
  ) { }

  async onApplicationBootstrap() {
    await this.syncPostsToElasticsearchOnStartup();
  }

  async syncPostsToElasticsearchOnStartup() {
    try {
      const elasticCount = await this.elasticsearchService.countPostsInIndex();

      if (elasticCount > 0)
        return;

      const posts = await this.postsDb.findForElasticsearch();

      const postSearchDocuments = posts.map((post: any) => ({
        _id: String(post._id),
        title: post.title,
        developer: post.developer,
        location: post.location,
        region: post.region,
        status: post.status,
        updatedAt: post.updatedAt || new Date(),
      }));

      await this.elasticsearchService.bulkIndexPosts(postSearchDocuments);
    } catch (error) {
      throwRpcException(500, "Lỗi khi đồng bộ dữ liệu lên Elasticsearch.")
    }
  }

  /*==========================
    CU POSTS
  ============================*/
  create = async (payload) => {
    return await this.postsService.create(payload, this.postsDb, this.dbName)
  }

  update = async (payload) => {
    return await this.postsService.update(payload, this.postsDb, this.dbName)
  }

  updateStatus = async (payload) => {
    return await this.postsService.updateStatus(payload, this.postsDb, this.dbName)
  }

  /*==========================
      QUERY POSTS
  ============================*/
  findOne = async (_id) => {
    return await this.postsService.findOne(_id, this.postsDb)
  }

  publicFindOne = async (_id) => {
    return await this.postsService.publicFindOne(_id, this.postsDb)
  }

  findOneForContactService = async (payload) => {
    const response = await this.findOne(payload)

    return {
      _id: response.data!._id,
      title: response.data!.title,
      cover_picture: response.data!.cover_picture
    }
  }

  find = async (payload) => {
    return await this.postsService.find(payload, this.postsDb, this.dbName)
  }

  publicFind = async (page) => {
    return await this.postsService.publicFind(page, this.postsDb)
  }

  search = async (payload) => {
    const { page, keyword } = payload
    const skip = (page - 1) * this.LIMIT

    const response = await this.elasticsearchService.search(
      { page, limit: this.LIMIT, skip, keyword },
      true
    );

    if (!response.ids.length) {
      return {
        message: 'Không tìm thấy bài đăng trùng khớp.'
      };
    }

    const posts = await this.postsDb.findByIds(response.ids, true);
    const data = await this.postsService.getAuthors(posts)

    return {
      message: 'Tìm kiếm bài đăng cho nội bộ công ty thành công.',
      pagination: {
        page: Number(page) || 1,
        limit: response.limit,
        totalPosts: response.total,
        totalPages: Math.ceil(response.total / response.limit),
      },
      data: {
        posts: data,
      },
    }
  }

  publicSearch = async (payload) => {
    const { page, keyword } = payload
    const skip = (page - 1) * this.LIMIT

    const response = await this.elasticsearchService.search(
      { page, limit: this.LIMIT, skip, keyword }
    );

    if (!response.ids.length) {
      return {
        message: 'Không tìm thấy bài đăng trùng khớp.'
      };
    }

    const posts = await this.postsDb.findByIds(response.ids);

    return {
      message: 'Tìm kiếm bài đăng thành công.',
      pagination: {
        page: Number(page) || 1,
        limit: response.limit,
        totalPosts: response.total,
        totalPages: Math.ceil(response.total / response.limit),
      },
      data: {
        posts
      },
    }
  }
}