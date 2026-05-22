import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./schemas/posts.schema";
import { Model } from "mongoose";

export class PostsDb {
    constructor(
        @InjectModel(Post.name)
        private readonly postModel: Model<Post>
    ) { }

    create = async (request) => {
        return await this.postModel.create(request)
    }

    find = async () => {
        return await this.postModel.find().lean()
    }

    findById = async (_id) => {
        return await this.postModel.findById({ _id })
    }
}