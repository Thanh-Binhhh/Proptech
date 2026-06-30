import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PostStatusHistory } from "./properties-posts/schemas/status-history.schema";

export class PostsDb {
    constructor(
        @InjectModel(PostStatusHistory.name)
        private readonly postStatusHistoryModel: Model<PostStatusHistory>
    ) { }

    createStatusHistory = async (_id, request) => {
        return await this.postStatusHistoryModel.create({
            postId: new Types.ObjectId(_id),
            ...request
        });
    }
}