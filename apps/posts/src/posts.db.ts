import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./schemas/create-posts.schema";
import { Model, Types } from "mongoose";
import { PostStatusHistory } from "./schemas/status-history.schema";
import { PostStatus_Stage1, PostStatus_Stage2, PostStatusValues } from "./schemas/post-status";

export class PostsDb {
    constructor(
        @InjectModel(Post.name)
        private readonly postModel: Model<Post>,

        @InjectModel(PostStatusHistory.name)
        private readonly postStatusHistoryModel: Model<PostStatusHistory>
    ) { }

    create = async (request) => {
        return await this.postModel.create(request)
    }

    update = async (_id, request) => {
        return await this.postModel.findByIdAndUpdate(
            _id,
            { $set: request },
            { new: true },
        )
            .populate('category', 'name')
    }

    updateStatus = async (_id, status) => {
        return await this.postModel.findByIdAndUpdate(
            _id,
            { $set: { status } },
            { new: true },
        )
    }

    createStatusHistory = async (_id, request) => {
        return await this.postStatusHistoryModel.create({
            postId: new Types.ObjectId(_id),
            ...request
        });
    }

    findOne = async (token, _id) => {
        let select = token ? '' : '-authorId'

        if (!Types.ObjectId.isValid(_id))
            return null;

        return await this.postModel
            .findById(_id)
            .select(select)
            .populate('category', 'name')
    }

    findByStatus = async (skip, limit, status) => {
        return await this.postModel
            .find({ status })
            .select('-region -createdAt -htmlSource -jsonSource')
            .skip(skip)
            .limit(limit)
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .lean()
    }

    find = async (skip, limit, categoryId, token) => {
        const filter = this.filter(token, categoryId)
        let select = token
            ? '-region -createdAt -htmlSource -jsonSource'
            : '_id title developer location cover_picture'

        let query = this.postModel
            .find(filter)
            .select(select)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })

        if (token)
            query = query.populate('category', 'name')

        return await query.lean()
    }

    count = async (token, categoryId) => {
        const filter = this.filter(token, categoryId)
        return await this.postModel.countDocuments(filter)
    }

    countByStatus = async (status) => {
        return await this.postModel.countDocuments({ status });
    };

    countAllStatus = async () => {
        const response = await this.postModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ])

        var statusCount = Object.fromEntries(
            Object.values(PostStatusValues).map(s => [s, 0])
        )

        response.forEach(s => {
            statusCount[s._id] = s.count
        })

        return statusCount
    }

    /*==========================
        HELPER FUNCTIONS
    ============================*/
    private filter = (token, category) => {
        return {
            ...(category ? { category } : {}),
            ...(token ? {} : { status: PostStatus_Stage2.PUBLISHED }),
        };
    };
}