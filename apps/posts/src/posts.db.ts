import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./schemas/posts.schema";
import { Model, Types } from "mongoose";

export class PostsDb {
    constructor(
        @InjectModel(Post.name)
        private readonly postModel: Model<Post>
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
    }

    findOne = async (_id) => {
        if (!Types.ObjectId.isValid(_id)) {
            return null;
        }
        return await this.postModel.findById(_id)
    }

    find = async () => {
        return await this.postModel.find().lean()
    }
}