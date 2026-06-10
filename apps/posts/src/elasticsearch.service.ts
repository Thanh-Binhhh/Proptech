import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { PostStatus_Stage2 } from './schemas/post-status';

interface PostSearchDocument {
    _id: string;
    title?: string;
    developer?: string;
    location?: string;
    region?: string;
    status: string;
    updatedAt: Date
}

@Injectable()
export class ElasticSearchService implements OnModuleInit {
    private readonly index: string;

    constructor(
        private readonly elasticsearchService: ElasticsearchService,
        private readonly configService: ConfigService,
    ) {
        this.index = this.configService.get<string>('POSTS_INDEX') || 'posts';
    }

    async onModuleInit() {
        try {
            const exists = await this.elasticsearchService.indices.exists({
                index: this.index,
            });

            if (!exists) {
                await this.elasticsearchService.indices.create({
                    index: this.index,
                    mappings: {
                        properties: {
                            title: { type: 'text' },
                            developer: { type: 'text' },
                            location: { type: 'text' },
                            region: { type: 'text' },
                            status: { type: 'keyword' },
                            updatedAt: { type: 'date' },
                        },
                    },
                });
            }
        } catch (error) {
            console.error('Elasticsearch init error:', error);
        }
    }

    async bulkIndexPosts(posts: PostSearchDocument[]) {
        if (!posts.length) {
            return {
                total: 0,
                message: 'Không có bài đăng nào để đồng bộ.',
            };
        }

        const operations = posts.flatMap((post) => [
            {
                index: {
                    _index: this.index,
                    _id: String(post._id),
                },
            },
            {
                title: post.title,
                developer: post.developer,
                location: post.location,
                region: post.region,
                status: post.status,
                updatedAt: post.updatedAt || new Date(),
            },
        ]);

        const result = await this.elasticsearchService.bulk({
            refresh: true,
            operations,
        });

        if (result.errors) {
            const erroredDocuments = result.items.filter(
                (item: any) => item.index?.error,
            );

            return {
                total: posts.length,
                errors: erroredDocuments.length,
                message: 'Đồng bộ Elasticsearch có lỗi.',
            };
        }

        return {
            total: posts.length,
            message: 'Đồng bộ bài đăng sang Elasticsearch thành công.',
        };
    }

    async countPostsInIndex() {
        const result = await this.elasticsearchService.count({
            index: this.index,
        });

        return result.count || 0;
    }

    async indexPost(post: PostSearchDocument) {
        return this.elasticsearchService.index({
            index: this.index,
            id: String(post._id),
            document: {
                title: post.title,
                developer: post.developer,
                location: post.location,
                region: post.region,
                status: post.status,
                updatedAt: post.updatedAt,
            },
        });
    }

    async search(payload) {
        const { accessToken, page, limit, skip, keyword } = payload;

        const must = keyword
            ? [
                {
                    multi_match: {
                        query: keyword,
                        fields: ['title^3', 'developer^2', 'location', 'region'],
                        fuzziness: 'AUTO',
                    },
                },
            ]
            : [
                {
                    match_all: {},
                },
            ];

        const filter: any[] = [];

        if (!accessToken) {
            filter.push({
                term: {
                    status: PostStatus_Stage2.PUBLISHED,
                },
            });
        }

        const result = await this.elasticsearchService.search<PostSearchDocument>({
            index: this.index,
            from: skip,
            size: limit,
            query: {
                bool: {
                    must,
                    filter,
                },
            },
            sort: keyword
                ? [
                    { _score: { order: 'desc' } },
                    { updatedAt: { order: 'desc' } },
                ]
                : [{ updatedAt: { order: 'desc' } }],
        });

        const ids = result.hits.hits.map((hit) => hit._id);

        return {
            ids,
            total:
                typeof result.hits.total === 'number'
                    ? result.hits.total
                    : result.hits.total?.value || 0,
            page,
            limit,
        };
    }

    // async deletePost(postId: string) {
    //     return this.elasticsearchService.delete({
    //         index: this.index,
    //         id: postId,
    //     });
    // }
}